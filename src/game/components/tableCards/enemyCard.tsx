import React, { useEffect, useRef } from "react";
import GameCard from "../../res/components/gameCard/gameCard";
import {genEnemyCards, comparisonEnemy} from './genCards.ts'
import { animateMoveTo } from "../../utils/animationUtils.jsx";

function EnemyCard ({game}){
	const enemyCardRef = useRef<HTMLElement>(null)
	const boxWidth = enemyCardRef.current && enemyCardRef.current.getBoundingClientRect().width || 0
	let length = game?.attackerCardsFromMap?.length

	const userId = JSON.parse(localStorage.getItem('user') || '').id
	const userIndex = game?.players.findIndex(el=> el.id == userId)

	const enemyCards = genEnemyCards(game.defenderCardsFromMap, game.attackerCardsFromMap)
	const {idSendler, indexNewCard} = comparisonEnemy(enemyCards, game.players) || {}
	
	const parentNewCardRect: any = document.getElementById(idSendler)?.getBoundingClientRect()
	useEffect(()=>{
		if(indexNewCard != undefined){
			const card: any = [...document.querySelectorAll(`[data-index]`)].map((card: any)=>+card.dataset.index == +indexNewCard ? card : null).filter(el=>el!=null)[0]
				const style = `
				z-index: ${game.deck.length - indexNewCard};
				transform: translate(${
					indexNewCard > 2 ? 110*(indexNewCard-3) : 110*indexNewCard
				}%, ${
					indexNewCard > 2 ? -110 : 0
				}%);
				transition: 0.3s
			`
			card.setAttribute('style', style)
		}
	})

	return (
		<span className="enemy_card" ref={enemyCardRef}
			style={{
				transform: `translate(calc(50vw - clamp(20px, 5vw, 40px) - ${length * (boxWidth/4) - 15}px), calc(56vh - 60px))`
			}}
		>
			{enemyCards.map((card)=>(
				card &&
				<GameCard
					type={''}
					style={
						indexNewCard == card.index 
						?
						{	
							zIndex: game.deck.length - card.index, 
							transform: `translate(-${
								parentNewCardRect?.y
							}px,${
								parentNewCardRect?.x - 300
							}px)`,
							transition: '0.3s'
						}
						:
						{ 
							zIndex: game.deck.length - card.index, 
							transform: `translate(${
								card.index > 2 ? 110*(card.index-3) : 110*card.index
							}%, ${
								card.index > 2 ? -110 : 0
							}%)`,
							transition: '0.3s'
						}
					}
					key={`${card.index}${card.name}${card.value}`}
					name={card.name}
					value={card.nominal}
					className="game_card_box open-card change_pos"
					typeCard='onTable'
					setRenderCard={()=>{}}
					hide={false}
					pointerNone={game.attackerIndex == userIndex}
					game={game}
					index={card.index}
				></GameCard>
			))}
		</span>
	)
}

export default EnemyCard