import React, { useRef } from "react";
import GameCard from "../res/components/gameCard/gameCard";

function EnemyCard ({game}){
	const enemyCardRef = useRef<HTMLElement>(null)
	const boxWidth = enemyCardRef.current && enemyCardRef.current.getBoundingClientRect().width || 0
	let length = game?.attackerCardsFromMap?.length

	return (
		<span className="enemy_card" ref={enemyCardRef}
			style={{
				left: `-${length * (boxWidth/4.6)}px`
			}}
		>
			{game?.defenderCardsFromMap?.map((card, index)=>(
				card &&
				<GameCard
					type={''}
					style={{ 
						zIndex: game.deck.length - index, 
						transform: `translate(${
							index > 2 ? 110*(index-3) : 110*index
						}%, ${
							index > 2 ? -110 : 0
						}%)`
					}}
					key={`${index}${card.name}${card.value}`}
					name={card.name}
					value={card.nominal}
					className="game_card_box open-card change_pos"
					typeCard='onTable'
					setRenderCard={()=>{}}
				></GameCard>
			))}
		</span>
	)
}

export default EnemyCard