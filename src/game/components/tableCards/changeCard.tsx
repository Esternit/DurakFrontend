import React, { useRef } from "react";
import GameCard from "../../res/components/gameCard/gameCard";
import {genAttackerCards} from './genCards.ts'

function ChangeCard ({game}){
	const changeCardRef = useRef<HTMLElement>(null)

	if(game?.status !== "await" && game?.status !== "load"){
		const boxWidth = changeCardRef.current && changeCardRef.current.getBoundingClientRect().width || 0
		let length = game?.attackerCards?.length
		
		const userId = JSON.parse(localStorage.getItem('user') || '').id
		const userIndex = game?.players.findIndex(el=> el.id == userId)

		const attackerCards = genAttackerCards(game.attackerCardsFromMap)
		return (
			<span className="change_card" id="change_cart" ref={changeCardRef}
				style={{
					left: `-${length * (boxWidth/4)}px`, transition: '0.3s'
				}}
			>
				{attackerCards.map((card, index)=>(
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
						typeCard={'onTable'}
						setRenderCard={()=>{}}
						hide={false}
						pointerNone={game.attackerIndex != userIndex}
						indexInTable={index}
						game={game}
					></GameCard>
				))}
			</span>
		)
	}else{
		return <></>
	}
}

export default ChangeCard