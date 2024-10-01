export const generateDeck = (cardCount) => {
  if (![24, 36, 52].includes(cardCount)) {
    throw new Error("Invalid number of cards. Valid values are 24, 36, or 52.");
  }

  const suits = ["h", "d", "c", "s"];
  const ranks = {
    24: [
      { name: "6", value: 6 },
      { name: "7", value: 7 },
      { name: "8", value: 8 },
      { name: "9", value: 9 },
      { name: "10", value: 10 },
      { name: "J", value: 11 },
      { name: "Q", value: 12 },
      { name: "K", value: 13 },
      { name: "A", value: 14 },
    ],
    36: [
      { name: "6", value: 6 },
      { name: "7", value: 7 },
      { name: "8", value: 8 },
      { name: "9", value: 9 },
      { name: "10", value: 10 },
      { name: "J", value: 11 },
      { name: "Q", value: 12 },
      { name: "K", value: 13 },
      { name: "A", value: 14 },
    ],
    52: [
      { name: "2", value: 2 },
      { name: "3", value: 3 },
      { name: "4", value: 4 },
      { name: "5", value: 5 },
      { name: "6", value: 6 },
      { name: "7", value: 7 },
      { name: "8", value: 8 },
      { name: "9", value: 9 },
      { name: "10", value: 10 },
      { name: "J", value: 11 },
      { name: "Q", value: 12 },
      { name: "K", value: 13 },
      { name: "A", value: 14 },
    ],
  };

  const deck = [];
  let id = 1;

  const selectedRanks = ranks[cardCount];

  suits.forEach((suit) => {
    selectedRanks.forEach((rank) => {
      deck.push({
        id: id++,
        type: suit,
        name: suit + rank.name,
        value: rank.value,
      });
    });
  });

  return deck;
};
