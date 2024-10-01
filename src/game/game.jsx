import React, { useRef, useEffect, useState, useCallback } from 'react'
// css
import '../game/css/game.css'
// img
import imgAvatar from '../media/img/avatar.png'
import imgFrame from './res/skins/frames/frame-0.svg'
// components
import GameCard from './res/components/gameCard'
import Timer from './res/components/timer'
// functions
import { generateDeck } from './utils/deckUtils'
// card Utils
import {
  shuffleDeck,
  getRandomCards,
  findCardById,
  findCardsById,
  cardToSelf,
} from './utils/cardUtils'
// animate Utils
import {
  animateMoveTo,
  animateGetCardsPlayerSelf,
  animateShowTrumpCard,
} from './utils/animationUtils'
// localStorageUtils
import localStorageUtils from './utils/localStorageUtils'
// events
import { touchEvents } from './scripts/touchEvents'
import EmojiPopup from '../components/emoji.popup'
import { I18nText } from '../components/i18nText'

// game
const Game = () => {
  const [game, setGame] = useState({
    status: 'load', // loading, await, start, distribution,trump_card, play, end ...
    cardsCount: 36,
    playersCount: 6,
    trumpCard: null,
  })
  // Сам игрок
  let player_self = {
    id: 4,
    index: 4,
    status: 'online',
    name: 'Player 1',
    avatar: imgAvatar,
    cards: [],
    cardsCount: 0,
    self: true,
  }
  // Массив других игроков
  let otherPlayers = [
    {
      id: 1,
      index: 1,
      status: 'online',
      name: 'Player 1',
      avatar: imgAvatar,
      cards: [],
      cardsCount: 0,
      self: false,
    },
    {
      id: 2,
      index: 2,
      status: 'online',
      name: 'Player 2',
      avatar: imgAvatar,
      cards: [],
      cardsCount: 0,
      self: false,
    },
    {
      id: 3,
      index: 3,
      status: 'online',
      name: 'Player 3',
      avatar: imgAvatar,
      cards: [],
      cardsCount: 0,
      self: false,
    },
  ]
  // functions
  // timer
  const [timerActive, setTimerActive] = useState(false)
  //
  const handleTimerFinish = (finished) => {
    if (finished) {
      console.log('Таймер завершился')
      // Ваш код для обработки завершения таймера
    }
  }

  const handleTimerStop = useCallback(() => {
    setTimerActive(false)
    disablePlayerControls()
    console.log('Таймер остановлен')
  }, [])

  const toggleTimer = () => {
    setTimerActive((prev) => !prev)
  }

  const disablePlayerControls = () => {
    setCardsDisabled(true)
    controlBtns(false, false, false, true)
    setCardsDisabled(true)
  }
  const controlBtns = (cheat, take, pass, react) => {
    setButtonStates({
      cheat: cheat,
      take: take,
      pass: pass,
      react: react,
    })
  }
  //
  //
  //
  const [allPlayers, setAllPlayers] = useState([...otherPlayers, player_self])
  const [deck, setDeck] = useState([])
  const [remainingDeck, setRemainingDeck] = useState([])
  const [cardsShuffled, setCardsShuffled] = useState(false)
  const [playerSelfCards, setPlayerSelfCards] = useState([])
  const [showEmojiPopup, setShowEmojiPopup] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState(null)
  const [selectedEmojiClass, setSelectedEmojiClass] = useState('')
  const [buttonStates, setButtonStates] = useState({
    cheat: false,
    take: false,
    pass: false,
    react: false,
  })
  // Refs
  const playerRefs = useRef([])
  const cardRefs = useRef([])
  // play
  const [gamePlaying, setGamePlaying] = useState(false)
  // UI bools
  const [cardsDisabled, setCardsDisabled] = useState(false)
  // eff

  // game-load
  useEffect(() => {
    if (game.status === 'load') {
      setGame((prevGame) => ({
        ...prevGame,
        status: 'start',
      }))
    }
  }, [game.status])

  // game-start
  useEffect(() => {
    if (game.status === 'start' && !cardsShuffled) {
      // Перемешивание и раздача карт
      const generatedDeck = generateDeck(game.cardsCount)
      const shuffledDeck = shuffleDeck(generatedDeck)
      setDeck(shuffledDeck)

      // Обновляем состояние игроков с уникальными картами
      const updatedPlayers = [...allPlayers]
      const deckCopy = [...shuffledDeck] // Создаем копию колоды для раздачи

      updatedPlayers.forEach((player) => {
        const playerCards = getRandomCards(deckCopy, 6) // Получаем уникальные карты
        player.cards = playerCards
        player.cardsCount = playerCards.length

        // Удаляем выданные карты из колоды
        playerCards.forEach((card) => {
          const cardIndex = deckCopy.findIndex(
            (deckCard) => deckCard.id === card.id,
          )
          if (cardIndex !== -1) {
            deckCopy.splice(cardIndex, 1)
          }
        })
      })

      setAllPlayers(updatedPlayers)
      setCardsShuffled(true)
      setGame((prevGame) => ({
        ...prevGame,
        status: 'distribution',
      }))
    }
  }, [game.status, cardsShuffled])

  // game-distribution
  useEffect(() => {
    if (game.status === 'distribution') {
      const animDur = 0.6

      async function distributeCardsToPlayer(player, playerIndex) {
        const playerRef =
          playerRefs.current[playerIndex].getBoundingClientRect()
        const pX = playerRef.left
        const pY = playerRef.top

        let playerCards = player.cards
        const boolPlayerSelf = player.self

        if (!boolPlayerSelf) {
          const cardPromises = playerCards.map((card, index) => {
            const cardElement = findCardById(card.id)
            if (cardElement) {
              return new Promise((resolve) => {
                setTimeout(() => {
                  animateMoveTo(cardElement, pX, pY, 0, animDur, 0)
                  resolve()
                }, index * 100) // Задержка в миллисекундах для каждой карты
              })
            } else {
              return Promise.resolve()
            }
          })

          await Promise.all(cardPromises)
        } else {
          playerCards = findCardsById(playerCards)
          setPlayerSelfCards(playerCards)
          await animateGetCardsPlayerSelf(playerCards, pX, pY, 1.5, animDur, 0)
        }
      }

      async function distributeAllCards() {
        // Сначала раздаем карты всем игрокам
        const playerPromises = allPlayers.map((player, i) => {
          return new Promise((resolve) => {
            setTimeout(async () => {
              await distributeCardsToPlayer(player, i)
              resolve()
            }, i * allPlayers[i].cards.length * 100) // Задержка для каждого игрока
          })
        })

        await Promise.all(playerPromises)

        // Обновляем колоду, удаляя разданные карты
        const dealtCards = allPlayers.flatMap((player) => player.cards)
        const rDeck = deck.filter(
          (card) => !dealtCards.some((dealtCard) => dealtCard.id === card.id),
        )
        setRemainingDeck(rDeck)

        // После завершения анимаций, выбираем козырную карту из оставшейся колоды

        setGame((prevGame) => ({
          ...prevGame,
          status: 'trump_card', // Меняем статус на следующую фазу
        }))
      }

      distributeAllCards()
    }
  }, [game.status, allPlayers, cardRefs, playerRefs, deck])

  const playerSelfRef = useRef(null) // Создаем ref для player_self

  // Обновляем useEffect
  useEffect(() => {
    if (playerSelfRef.current) {
      playerRefs.current.push(playerSelfRef.current) // Добавляем ref в конец массива playerRefs
    }
  }, [playerSelfRef])

  // game-selecting trump Card
  useEffect(() => {
    if (game.status === 'trump_card') {
      // Проверяем, что колода не пуста
      if (remainingDeck.length > 0) {
        // Выбираем последнюю карту из оставшейся колоды как козырную карту
        const trumpCard = remainingDeck[remainingDeck.length - 1]
        const trumpCardEl = findCardById(trumpCard.id)
        if (trumpCardEl) {
          trumpCardEl.classList.add('trump_card')
          animateShowTrumpCard(trumpCardEl)
        }
        // Можно сохранить козырную карту в состояние игры или выполнить другие действия
        // Пример: обновляем состояние игры с козырной картой
        setGame((prevGame) => ({
          ...prevGame,
          trumpCard: trumpCard, // Сохраняем козырную карту
          status: 'play', // Меняем статус на следующую фазу (например)
        }))
      }
    }
  }, [game.status, deck])

  // play
  useEffect(() => {
    if (game.status === 'play') {
      // Получаем функцию очистки
      const cleanUp = touchEvents(playerSelfCards, cardsDisabled)

      // Очистка при размонтировании или изменении зависимостей

      const timer = document.querySelector('.game .timer')
      if (!gamePlaying) {
        controlBtns(true, true, true, true) // Активируем все кнопки
        setGamePlaying(true)
        setTimerActive(true)
        timer.classList.add('timer_active')
      }

      setGame((prevGame) => ({
        ...prevGame,
        status: 'play', // Меняем статус на следующую фазу (например)
      }))
      return () => cleanUp()
    }
  }, [game.status, playerSelfCards, cardsDisabled])
  // ~

  // Новые функции для эмодзи
  const toggleEmojiPopup = useCallback(() => {
    setShowEmojiPopup((prev) => !prev)
  }, [])

  const selectEmoji = useCallback((emoji) => {
    setSelectedEmoji(emoji)
    setShowEmojiPopup(false)
    setSelectedEmojiClass('show')

    const hideTimeout = setTimeout(() => setSelectedEmojiClass('hide'), 1750)
    const clearTimeout = setTimeout(() => {
      setSelectedEmoji(null)
      setSelectedEmojiClass('')
    }, 2250)

    return () => {
      clearTimeout(hideTimeout)
      clearTimeout(clearTimeout)
    }
  }, [])

  const playerCenterIndex = Math.floor(otherPlayers.length / 2)

  // render
  return (
    <section className="game">
      {/* players */}
      <div className="players">
        {otherPlayers.map((player, index) => {
          let topPosition = '0px'

          if (otherPlayers.length > 2) {
            if (index <= playerCenterIndex) {
              // Подъем до центрального элемента
              topPosition = `${(playerCenterIndex - index) * 50}px`
            } else {
              // Спуск после центрального элемента
              topPosition = `${(index - playerCenterIndex) * 50}px`
            }
          }

          return (
            <div
              className="player"
              id={player.id}
              key={player.id}
              ref={(el) => (playerRefs.current[index] = el)}
              style={{ position: 'relative', marginTop: topPosition }}
            >
              <div className="picture">
                <img
                  className="profile"
                  src={player.avatar}
                  alt="player_picture"
                />
                <img
                  className="frame"
                  src={imgFrame}
                  alt="frame"
                />
              </div>
              <span className="player_name">{player.name}</span>
              <span className="cards_count">
                {allPlayers[index].cards.length} cards
              </span>
            </div>
          )
        })}
      </div>
      {/* timer */}
      <Timer
        duration={15}
        onFinish={handleTimerFinish}
        isActive={timerActive}
      />
      {/* change_card */}
      <span className="change_card"></span>

      {deck.map((card, index) => (
        <GameCard
          style={{ zIndex: deck.length - index }} // Передаем объект стиля
          ref={(el) => (cardRefs.current[index] = el)}
          key={card.id}
          id={card.id}
          type={card.type}
          name={card.name}
          value={card.value}
        ></GameCard>
      ))}

      {/* player_self */}
      <div
        className="player_self"
        ref={playerSelfRef}
      >
        {/* <div className="cards"></div> */}
      </div>
      {/* game control buttons */}
      <div className="control_btns">
        <button
          className="cheat"
          onClick={toggleTimer}
          disabled={!buttonStates.cheat}
        >
          <I18nText path="cheat_button" />
        </button>
        <button
          className="take"
          disabled={!buttonStates.take}
        >
          <I18nText path="take_button" />
        </button>
        <button
          className="pass"
          disabled={!buttonStates.pass}
        >
          <I18nText path="pass_button" />
        </button>
        <button
          className="react"
          onClick={toggleEmojiPopup}
          disabled={!buttonStates.react}
        >
          <I18nText path="react_button" />
        </button>
      </div>

      {/* Popup с эмодзи */}
      <EmojiPopup
        onSelectEmoji={selectEmoji}
        show={showEmojiPopup}
      />

      {selectedEmoji && (
        <div className={`selected_emoji ${selectedEmojiClass}`}>
          <img
            src={selectedEmoji}
            alt="Selected Emoji"
          />
        </div>
      )}
    </section>
  )
}

export default Game
