import React, { useRef } from "react";
import GameCard from "../res/components/gameCard/gameCard";

function ChangeCard ({game}){
	const changeCardRef = useRef<HTMLElement>(null)

	if(game?.status !== "await" && game?.status !== "load"){
		const boxWidth = changeCardRef.current && changeCardRef.current.getBoundingClientRect().width || 0
		let length = game?.attackerCards?.length

		return (
			<span className="change_card" id="change_cart" ref={changeCardRef}
				style={{
					left: `-${length * (boxWidth/4)}px`,
				}}
			>
				{game?.attackerCardsFromMap?.map((card, index)=>(
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
					></GameCard>
				))}
			</span>
		)
	}else{
		return <></>
	}
}

export default ChangeCard