import React, { useEffect, useRef, useState } from "react";
import cardClick from "./cardClick.ts";
import { cards } from "../../../includes/cards.jsx";

const GameCard = (
	({ type, name, value, style, typeCard, trumpCard = {}, setRenderCard, ...props }) => {
		const refCard = useRef(null)
		const [userCosmetic] = useState(
			JSON.parse(localStorage.getItem("user_cosmetic"))
		);

		let trumpCheck = false
		if (trumpCard) {
			if (trumpCard.name == name && trumpCard.nominal == value) {
				trumpCheck = true
			}
		}
		useEffect(() => {
			setRenderCard(p => { p.push(refCard); return p })
		})

		return (
			<div className={`game_card_box ${trumpCheck ? 'rotate open-card' : ''}`} ref={refCard}
				data-name={name}
				data-nominal={value}
				data-trump={trumpCheck}
				{...props}
				style={trumpCheck ? { zIndex: 1 } : { ...style }}
				onClick={e => cardClick(e, name, value, refCard)}
			>
				<div className="game_card_wrapper">
					<img className="game_card_front"
						src={`url(/res/skins${userCosmetic?.find((item) => item.cosmetic?.type === "card")?.cosmetic?.link})`}
						alt=""
						data-side="front"
					/>
					<img
						className={`game_card_back ${name}`}
						alt=""
						src={cards[`${name[0].toLowerCase()}${value}`]}
						data-side={typeCard != 'onTable' ? "back" : 'onTable'}
					/>
				</div>
			</div >
		);
	}
);

export default GameCard;
