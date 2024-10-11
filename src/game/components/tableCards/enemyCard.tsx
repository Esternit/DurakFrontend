import React, { useRef } from "react";
import GameCard from "../../res/components/gameCard/gameCard";
import {genEnemyCards} from './genCards.ts'

function EnemyCard ({game}){
	const enemyCardRef = useRef<HTMLElement>(null)
	const boxWidth = enemyCardRef.current && enemyCardRef.current.getBoundingClientRect().width || 0
	let length = game?.attackerCardsFromMap?.length

	const userId = JSON.parse(localStorage.getItem('user') || '').id
	const userIndex = game?.players.findIndex(el=> el.id == userId)

	const enemyCards = genEnemyCards(game.defenderCardsFromMap, game.attackerCardsFromMap)
	return (
		<span className="enemy_card" ref={enemyCardRef}
			style={{
				left: `-${length * (boxWidth/4.6)}px`, transition: '0.3s'
			}}
		>
			{enemyCards.map((card)=>(
				card &&
				<GameCard
					type={''}
					style={{ 
						zIndex: game.deck.length - card.index, 
						transform: `translate(${
							card.index > 2 ? 110*(card.index-3) : 110*card.index
						}%, ${
							card.index > 2 ? -110 : 0
						}%)`,
						transition: '0.3s'
					}}
					key={`${card.index}${card.name}${card.value}`}
					name={card.name}
					value={card.nominal}
					className="game_card_box open-card change_pos"
					typeCard='onTable'
					setRenderCard={()=>{}}
					hide={false}
					pointerNone={game.attackerIndex == userIndex}
					game={game}
				></GameCard>
			))}
		</span>
	)
}

export default EnemyCard