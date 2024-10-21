import React, { useEffect, useState } from "react";
import Timer from "./initTimer.tsx";

function TimerCheck ({game}){
	const [localGame, setLocalGame] = useState<any>({players: []})
	useEffect(()=>{
		let check = checkAccordance(game.players)
		if(check == false){
			const timerScore: any = document.getElementById('timerTick')?.innerHTML
			if(+timerScore < 2){
				check = true
			}
		}
		if(check){
			setLocalGame({...game})
		}
	}, [game])

	return <Timer game={localGame}/>
}

let lastPlayers = []
function checkAccordance(players){
	let check = false

	if(lastPlayers.length == 0){check = true}
	players.forEach((el, i)=>{
		const cardsAct = el.cards
		const cardsLast = lastPlayers[i]?.cards
		if(cardsLast && cardsAct){
			cardsLast.forEach(lastC=>{
				const lastCard = cardsAct.findIndex(cardAct => cardAct.name == lastC.name && cardAct.nominal == lastC.nominal)
				if(lastCard == -1){check = true}
			})
			cardsAct.forEach(cardAct=>{
				const lastCard = cardsLast.findIndex(lastC => cardAct.name == lastC.name && cardAct.nominal == lastC.nominal)
				if(lastCard == -1){check = true}
			})
		}
	})
	lastPlayers = players

	return check
}

export default TimerCheck