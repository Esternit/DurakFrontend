import React from "react";
import {I18nText} from '../../components/i18nText'
import finishTurn from "../responce/sendFinishTurn.ts";

function PlayerButtons ({game, setShowEmojiPopup}){
	let clickButnUserId = true
	let coveredCards = false
	let presenceAttCards = false

	if(game && game.attackerIndex != undefined && game.players){
		clickButnUserId = +game.players[game.attackerIndex].id == +JSON.parse(localStorage.getItem('user')||'').id

		const attackerCards = game.attackerCards
		const defenderCards = game.defenderCardsFromMap.filter(el=>el!= null)
		if(attackerCards.length != 0){
			if(clickButnUserId){
					if(attackerCards.length == defenderCards.length){
						coveredCards = true
					}
			}else{
				if(attackerCards.length > defenderCards.length){
					presenceAttCards = true
				}
			}
		}
	}
	return <>
		{(game?.status !== "await" && game?.status !== "load") && (
				<div className="control_btns">
					<button
						className="cheat"
						// onClick={toggleTimer}
						// disabled={!buttonStates.cheat}
					>
						<I18nText path="cheat_button" values={'cheat_button'} />
					</button>

					<button className="take" onClick={passEvent} 
						disabled={!presenceAttCards || clickButnUserId}
						style={{
							pointerEvents: !presenceAttCards || clickButnUserId ? 'none' : 'all', 
							opacity: !presenceAttCards || clickButnUserId ?  0.7: 1
						}}
					>
						<I18nText path="take_button" values={'take_button'}/>
					</button>

					<button className="pass"onClick={passEvent} 
						disabled={!clickButnUserId && !coveredCards} 
						style={{
							pointerEvents: clickButnUserId && coveredCards ? 'all' : 'none', 
							opacity: clickButnUserId && coveredCards ?  1: 0.7
						}}
					>
						<I18nText path="pass_button" values={'pass_button'}/>
					</button>

					<button
						className="react"
						onClick={()=>setShowEmojiPopup(p=>!p)}
					>
						<I18nText path="react_button" values={'react_button'}/>
					</button>
				</div>
			)}
	</>
}

function passEvent(){
	const timerTick = document.getElementById('timerTick')
	if(timerTick && +timerTick.innerHTML > 2){
		const gameId = JSON.parse(localStorage.getItem("game_status") || '').gameId
		finishTurn(gameId).catch()
	}
}

export default PlayerButtons