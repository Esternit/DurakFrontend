// cardUtils.js
import { cards } from "../includes/cards";
const suits = ["h", "d", "c", "s"];

/**
 * Функция перемешивания карт в массиве
 * @param {Array} deck - массив карт
 * @returns {Array} - перемешанный массив карт
 */
export const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

/**
 * Функция выбора случайных карт из массива
 * @param {Array} deck - массив карт
 * @param {number} count - количество карт для выбора
 * @returns {Array} - массив случайных карт
 */
export const getRandomCards = (deck, numCards) => {
  const selectedCards = [];
  const deckCopy = [...deck]; // Create a copy of the deck to avoid modifying the original

  for (let i = 0; i < numCards; i++) {
    if (deckCopy.length === 0) {
      // If no cards are left in the deck, return the selected cards
      break;
    }

    const randomIndex = Math.floor(Math.random() * deckCopy.length);
    selectedCards.push(deckCopy[randomIndex]);
    deckCopy.splice(randomIndex, 1); // Remove the selected card from the copy
  }

  return selectedCards;
};

// Находит карту в DOM по идентификатору.
// card
export const findCardById = (id) => {
  const cards = document.querySelectorAll(".game .game_card");
  return Array.from(cards).find((el) => el.dataset.id == id);
};
// cards
export const findCardsById = (array) => {
  const cards = document.querySelectorAll(".game .game_card");
  let eArr = [];
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    eArr.push(findCardById(el.id));
  }
  return eArr;
};
//
// open card
export const openCard = (card) => {
  let name = card.dataset.name;
  // Dynamically access the card using the 'name' variable
  let cardImage = cards[name];
  card.style.backgroundImage = `url(${cardImage})`;
  card.classList.add("open-card");
};
// card to self cards
export const cardToSelf = (el) => {
  el.classList.add("self_card");
};

