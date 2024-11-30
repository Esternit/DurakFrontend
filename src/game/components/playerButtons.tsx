import React from "react";
import {I18nText} from '../../components/i18nText'
import finishTurn from "../responce/sendFinishTurn.ts";

import checkMarkImg from '../res/icon/checkMark.svg'
import closeImg from '../res/icon/close.svg'
import emotionImg from '../res/icon/emotion.svg'

function PlayerButtons ({game, setShowEmojiPopup}){
	let clickButnUserId = true
	let coveredCards = false
	let presenceAttCards = false

	if(game && game.attackerIndex != undefined && game.players){
		const userId = +JSON.parse(localStorage.getItem('user')||'').id
		const attackerId = +game.players[game.attackerIndex].id

		const defI = game.attackerIndex+1 >= game.players.length ? 0 : game.attackerIndex+1
		const defenderId = +game.players[defI].id

		clickButnUserId = attackerId == userId

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

		const checkActive = userId == attackerId || userId == defenderId
		if(!checkActive){
			presenceAttCards = false
		}
	}
	return <>
		{(game?.status !== "await" && game?.status !== "load") && (
				<div className="control_btns">
					{/* {
						game.type == 'SHULLERS' ? 
						<button className="cheat">
							<I18nText path="cheat_button" values={'cheat_button'} />
						</button> : 
						<></>
					} */}

					<div className="player__button-container" onClick={passEvent}>
						<button className={`
								player__button 
								${(presenceAttCards && !clickButnUserId) && 'pas'} 
								${(clickButnUserId && coveredCards) && 'play'}
							`}>
							<img src={checkMarkImg}/>
							<img src={closeImg}/>
						</button>
						<div className="player__button-text">
							{(presenceAttCards && !clickButnUserId) && <I18nText path="take_button" values={'take_button'}/>}
							{(clickButnUserId && coveredCards) && <I18nText path="pass_button" values={'pass_button'}/>}
						</div>
					</div>

					<div className="player__button-item">
						<div className="player__text-attack">
							{clickButnUserId && <I18nText path="attack_you" values={'attack_you'}/>}
							{!clickButnUserId && <I18nText path="attack_no_you" values={'attack_no_you'}/>}
						</div>
						<button
							className="react"
							onClick={()=>setShowEmojiPopup(p=>!p)}
						>
							<img className="react__icon" src={emotionImg}></img>
						</button>
					</div>
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