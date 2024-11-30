import React, { useEffect, useRef, useState } from 'react';
import G from '../game/utils/mathUtils';
import gsap from 'gsap';
import { cards } from '../game/includes/cards';

const getNominal = (nominal) => {
	if (nominal < 11) {
		return nominal;
	}

	return { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }[nominal];
}

export const Card = ({ card, onClick, active, className, style, attack }) => {
	const [userCosmetic] = useState(
		JSON.parse(localStorage.getItem("user_cosmetic"))
	);
	const ref = useRef(null);
	const clicked = useRef(false);
	const srcCard = cards[`${card?.name?.[0]?.toLowerCase()}${getNominal(card?.nominal)}`];

	useEffect(() => {
		if (clicked.current) {
			const tW = Math.floor(G.getWidth(ref?.current) / 2);
			if (active) {
				gsap.to(ref?.current, { y: `-=${tW}`, rotate: `+=${8}`, duration: 0.3 });
			} else {
				gsap.to(ref?.current, { y: `+=${tW}`, rotate: `-=${8}`, duration: 0.3 });
			}
		}
	}, [active]);

	useEffect(() => {

	}, [attack])

	const handleClick = () => {
		onClick?.();
		clicked.current = true;
	}

	return (
		<img
			ref={ref}
			alt="Card"
			className={`gameplay__card ${className}`}
			onClick={handleClick}
			style={{
				...style,
				backgroundImage: `url(/res/skins${userCosmetic?.find((item) => item.cosmetic?.type === "card")
						?.cosmetic?.link
					})`
			}}
			src={srcCard}
		/>
	)
}