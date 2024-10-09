import React from "react";
import {I18nText} from '../../components/i18nText'
import finishTurn from "../responce/sendFinishTurn.ts";

function PlayerButtons ({game, setShowEmojiPopup}){
	let clickButnUserId = true
	if(game && game.attackerIndex != undefined && game.players){
		clickButnUserId = +game.players[game.attackerIndex].id == +JSON.parse(localStorage.getItem('user')||'').id
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
						disabled={clickButnUserId} 
						style={{
							pointerEvents: clickButnUserId ? 'none' : 'all', opacity: clickButnUserId ?  0.7: 1
						}}
					>
						<I18nText path="take_button" values={'take_button'}/>
					</button>
					<button className="pass"onClick={passEvent} 
						disabled={clickButnUserId} 
						style={{
							pointerEvents: clickButnUserId ? 'none' : 'all', opacity: clickButnUserId ?  0.7: 1
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
	const gameId = JSON.parse(localStorage.getItem("game_status") || '').gameId
	finishTurn(gameId).catch()
}

export default PlayerButtons