import React, { useEffect, useLayoutEffect, useState } from "react";
import GameCard from "../res/components/gameCard/gameCard";


const AllDeck = React.memo(({ game, setRenderCard }) => {
	const [allDeck, setAllDeck] = useState([])
	useEffect(() => {
		if (game) {
			const allDeck = genAllDeck(game)
			setAllDeck(allDeck)
		}
	}, [game])
	useLayoutEffect(() => {
		setRenderCard(p => {
			p.length = 0
			return p
		})
	})
	useEffect(() => {
		if (allDeck[0]) {
			setRenderCard(p => [...p])
		}
	}, [allDeck])
	const opponentCard = opponentCardGen(allDeck, game)

	return <>

		{allDeck.map((card, index) => (
			<GameCard
				style={{ zIndex: game.deck.length - index }}
				key={`${index}${card.name}${card.value}`}
				name={card.name}
				value={card.nominal}
				trumpCard={game?.trumpCard}
				setRenderCard={setRenderCard}
				hide={opponentCard.includes(index)}
				game={game}
			></GameCard>
		))}
	</>
})

export default AllDeck

function genAllDeck(game) {
	if (!game.deck) return []
	let deck = [...game.deck]

	game.players.forEach(el => deck = [...deck, ...el.cards])
	return deck
}


function opponentCardGen(allDeck, game) {
	const userId = JSON.parse(localStorage.getItem('user') || '').id
	const comparisIndex = []
	if (game) {
		let playersCard = game.players.reduce((acc, el) => {
			if (el.id != userId) {
				acc = [...acc, ...el.cards]
			}
			return acc
		}, [])

		playersCard.forEach((el) => {
			const pl = allDeck.findIndex((opponent) => opponent.name == el.name && opponent.nominal == el.nominal)
			if (pl != -1) {
				comparisIndex.push(pl)
			}
		})
	}
	return comparisIndex
}