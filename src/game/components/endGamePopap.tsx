import React from "react";
import preview from '../res/skins/endgame/priview.png'
import IconCoin from "../../components/icons/coin";
import IconDUR from "../../components/icons/dur";

const EndGamePopap = ({game}: {game})=>{
	if(game.gameState != 'game_over'){
		return <></>
	}else{
		const userId = JSON.parse(localStorage.getItem('user') || '')?.id
		const winner = game.winner
		let checkWinner = false

		const currUserI = winner.findIndex(el=>+el.user.id === +userId)
		if(currUserI === (winner.length-1)){
			checkWinner = true
		}
		
		if(!checkWinner){
			const reward = getReward(game, game.betType, +userId)
			return createPopap('winner', reward, game.betType)
		}else{
			const reward = getReward(game, game.betType, +userId)
			return createPopap('defend', reward, game.betType)
		}
	}
	
}
export default EndGamePopap

const comparison = {
	'winner':'Ура, ты выиграл!',
	'defend':'Ты проиграл...',
}

function createPopap(type, reward, betType){
		return(
		<div className="endgame__popap">
			<div className="endgame__popap-logo"><img src={preview} alt="" /></div>
			<div className="endgame__popap-text">{comparison[type]}</div>
			<div className="endgame__popap-reward">
				{reward}
				{betType == 'premium' ? <IconDUR/> : <IconCoin/>}
				
			</div>
			<button onClick={()=>{window.location.href = '/games'}} className="endgame__popap-button blue">Играть снова</button>
			<button onClick={()=>{window.location.href = '/profile'}} className="endgame__popap-button white">Выйти</button>
		</div>
		)
}

function getReward(game, type, userId = 0){
	const before = game.usersBalanceBeforeAndAfter.before
	const after = game.usersBalanceBeforeAndAfter.after
	
	const userBefore = before.find(el=>el.user.id == userId)
	const userAfter = after.find(el=>el.user.id == userId)

	const balanceBeforePremium = userBefore.balance.premiumBalanceReturnable
	const balanceBeforeUsual = userBefore.balance.usualBalance

	const balanceAfterPremium = userAfter.balance.premiumBalanceReturnable
	const balanceAfterUsual = userAfter.balance.usualBalance

	if(type == 'premium'){
		return Math.round(balanceAfterPremium - balanceBeforePremium)
	}else{
		return Math.round(balanceAfterUsual - balanceBeforeUsual)
	}
	
	return 0
}