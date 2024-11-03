import React from "react";
import preview from '../res/skins/endgame/priview.png'
import IconCoin from "../../components/icons/coin";
import IconDUR from "../../components/icons/dur";

const EndGamePopap = ({game}: {game})=>{
	console.log(game)
	if(game.gameState != 'game_over'){
		return <></>
	}else{
		const winner = game.winner
		let winnerId = ''
		if(winner.length == 0){
			winnerId = 'draw'
		}

		winner.forEach(el=>{
			if(el.cards.length == 0){
				winnerId = el.id
			}
		})

		
		const userId = JSON.parse(localStorage.getItem('user') || '')?.id
		if(winner == 'draw'){
			return createPopap('draw', 0, game.betType)
		}else{
			if(+userId == +winnerId){
				const reward = getReward(game, 'winner')
				return createPopap('winner', reward, game.betType)
			}else{
				const reward = getReward(game, 'defender', +userId)
				return createPopap('defend', reward, game.betType)
			}
		}
	}
	
}
export default EndGamePopap

const comparison = {
	'draw': 'Это ничья!',
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
	if(type == 'winner'){
		if(game.betType == "premium"){
			let initAllBalance = 0; let endAllBalance = 0
			game.usersBalanceBeforeAndAfter.after.forEach(el=>initAllBalance += el.balance.premiumBalanceReturnable)
			game.usersBalanceBeforeAndAfter.before.forEach(el=>endAllBalance += el.balance.premiumBalanceReturnable)

			const reward = initAllBalance - endAllBalance
			return reward
		}else{
			let initAllBalance = 0; let endAllBalance = 0
			game.usersBalanceBeforeAndAfter.after.forEach(el=>initAllBalance += el.balance.usualBalance)
			game.usersBalanceBeforeAndAfter.before.forEach(el=>endAllBalance += el.balance.usualBalance)

			const reward = initAllBalance - endAllBalance
			return reward
		}
	}else{
		const afterUser = game.usersBalanceBeforeAndAfter.after.filter(el=>el.user.id == userId)[0]
		const beforeUser = game.usersBalanceBeforeAndAfter.before.filter(el=>el.user.id == userId)[0]

		if(!afterUser && !beforeUser){return}
		if(game.betType == "premium"){
			const reward = beforeUser.balance.premiumBalanceReturnable - afterUser.balance.premiumBalanceReturnable
			return reward
		}else{
			const reward = beforeUser.balance.usualBalance - afterUser.balance.usualBalance
			return reward
		}
	}
}