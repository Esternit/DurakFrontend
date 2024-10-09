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

	return <>
		{allDeck.map((card, index) => (
			<GameCard
				style={{ zIndex: game.deck.length - index }}
				key={`${index}${card.name}${card.value}`}
				name={card.name}
				value={card.nominal}
				trumpCard={game?.trumpCard}
				setRenderCard={setRenderCard}
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