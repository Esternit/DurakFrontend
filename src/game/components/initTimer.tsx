import React, { useEffect, useRef } from "react";
import finishTurn from "../responce/sendFinishTurn.ts";

function Timer ({game}){
	const timerRef = useRef<HTMLSpanElement>(null)

	useEffect(()=>{
		let interval: any = null

		const current = timerRef.current
		if(current){
			let counter = 15
			interval = setInterval(()=>{
				counter--
				current.innerHTML = `${counter}`
				
				const userC = game.players.findIndex(el=>+el.id == +JSON.parse(localStorage.getItem('user') || '').id)
				if(counter == 0){
					if(userC == 0){
						const gameId = JSON.parse(localStorage.getItem("game_status") || '').gameId
						finishTurn(gameId).catch()
					}
					clearInterval(interval)
				}
			}, 1000)
		}

		return ()=> clearInterval(interval)
	}, [game, timerRef])

	let check = game['playerAmount']
	if(check == undefined){
		check = game.players.length
	}
	const attackerId = game?.players[game?.attackerIndex]?.id
	const userId = JSON.parse(localStorage.getItem('user') || '').id
	if(check == game.players.length){
		return (
			<div className={
				`timer 
				${game['playerAmount'] ? 'timer_fast_active': 'timer_active'}
				${attackerId == userId ? 'green' : 'red'}
				`
			}>
				<span className="time" ref={timerRef}></span>
			</div>
		);
	}else{
		return ''
	}
};

export default Timer;
