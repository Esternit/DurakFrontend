import React, { useCallback, useEffect, useRef, useState } from "react";
import { animateGetCardsPlayerSelf } from "../utils/animationUtils";
import AllDeck from "./allDeck.jsx";

let lastCountCard = 5, lastArrayCard = []
const Cards = React.memo(({game}: {game})=>{
	const cardBoxRef = useRef<HTMLDivElement>(null)
	const [renderCard, setRenderCard] = useState([])
	const userId = JSON.parse(localStorage.getItem('user') || '').id

	const setRenderCardC = useCallback((p)=>{
		setRenderCard(p)
	}, [])
	
	useEffect(()=>{
		if(renderCard[0]){
			animationStart(game, cardBoxRef, userId, renderCard)
		}
	}, [renderCard])

	return (
		<>
			<AllDeck game={game} setRenderCard={setRenderCardC}/>
			<div className="player_self" ref={cardBoxRef}></div>
		</>
	)
})
export default Cards 

function animationStart(game, cardBoxRef, userId, renderCard){
	if(game.players){
		const usersCards: Array<any> = []
		game.players.forEach(el=>{
			usersCards.push({id: el.id, cards: el.cards})
		})

		renderCard.forEach((el)=>{
			let typeCard: any = null

			if(el.current){typeCard = el.current.getAttribute('data-name')}
			usersCards.forEach(user=>{
				const userCard = user.cards.find(card=>card.name == typeCard && el.current.dataset.nominal == card.nominal)
				if(userCard){userCard.current = el.current}
			})
		})
	
		const curr = cardBoxRef.current
		if(curr){
			usersCards.forEach(user=>{
				if(user.id == userId){

					let refresh = true
	
					if(user.cards.length > lastCountCard){
						refresh = true
					}else{
						refresh = false
					}
					const newCards = game.players.find(el=>el.id == userId).cards
					const comp = comparisArray(newCards)
					lastArrayCard = newCards
					lastCountCard = newCards.length
					animateGetCardsPlayerSelf(user.cards.map(el=>el.current), curr, refresh, comp)
				}
			})
		}
	}
}

function comparisArray(cards){
	const comparisIndex: number[] = []

	cards.forEach((el, i)=>{
		const lastItem: any = lastArrayCard[i]
		
		if(lastItem?.name){
			if(lastItem.name != el.name || lastItem.nominal != el.nominal){
				comparisIndex.push(i)
			}
		}else{
			comparisIndex.push(i)
		}
	})
	return comparisIndex
}