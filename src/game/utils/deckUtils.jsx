export const generateDeck = (cardCount) => {
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
  const fullDeck = [];
  const backendDeck = JSON.parse(localStorage.getItem("game_status")).deck;
  const players = JSON.parse(localStorage.getItem("game_status")).players;
  for (let i = 0; i < players.length; i++) {
    fullDeck.push(...players[i].cards);
  }
  for (let i = 0; i < backendDeck.length; i++) {
    fullDeck.push(backendDeck[i]);
  }
  let id = 1;

  const selectedRanks = ranks[cardCount];

  fullDeck.forEach((card) => {
    let seconpart = "";
    if (card.nominal <= 10) {
      seconpart = card.nominal.toString();
    } else if (card.nominal == 11) {
      seconpart = "J";
    } else if (card.nominal == 12) {
      seconpart = "Q";
    } else if (card.nominal == 13) {
      seconpart = "K";
    } else if (card.nominal == 14) {
      seconpart = "A";
    }
    let car = card.name[0].toLowerCase() + seconpart;
    deck.push({
      id: id++,
      type: card.name[0].toLowerCase(),
      name: car,
      value: card.nominal,
      nominal: card.nominal,
      nameBack: card.name,
      playerOwner: card.playerOwner,
    });
  });

  return deck;
};
