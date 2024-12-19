import React, { useEffect, useRef } from "react";
import finishTurn from "../../responce/sendFinishTurn.ts";

const Timer = React.memo(({game}:{game})=>{
	const timerRef = useRef<HTMLSpanElement>(null)

	useEffect(()=>{
		let interval: any = null

		const current = timerRef.current
		if(current){
			let counter = 30
			const callback = ()=>{
				counter--
				current.innerHTML = `${counter}`
				
				const userC = game.players.findIndex(el=>+el.id == +JSON.parse(localStorage.getItem('user') || '').id)
				if(counter == 0){
					if(userC == game.attackerIndex){
						const gameId = JSON.parse(localStorage.getItem("game_status") || '').gameId
						finishTurn(gameId).catch()
					}
					clearInterval(interval)
				}
			}
			interval = new WorkerInterval(callback, 1000);
		}

		return ()=> interval.stop();
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
				<span id="timerTick" className="time" ref={timerRef}></span>
			</div>
		);
	}else{
		return ''
	}
});

export default Timer;

class WorkerInterval {
	worker = null;
	constructor(callback, interval) {
	  const blob = new Blob([`setInterval(() => postMessage(0), ${interval});`]);
	  const workerScript = URL.createObjectURL(blob);
	  this.worker = new Worker(workerScript);
	  this.worker.onmessage = callback;
	}
  
	stop() {
	  this.worker.terminate();
	}
  }