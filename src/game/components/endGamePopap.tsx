import React from "react";
import preview from '../res/skins/endgame/priview.png'
import money from '../res/skins/endgame/money.png'

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
			return createPopap('draw', 0)
		}else{
			if(+userId == +winnerId){
				return createPopap('winner', game.betAmount)
			}else{
				return createPopap('defend', game.betAmount)
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

function createPopap(type, reward){
		return(
		<div className="endgame__popap">
			<div className="endgame__popap-logo"><img src={preview} alt="" /></div>
			<div className="endgame__popap-text">{comparison[type]}</div>
			<div className="endgame__popap-reward">
				{reward}
				<img src={money} alt="" />
			</div>
			<button onClick={()=>{window.location.href = '/games'}} className="endgame__popap-button blue">Играть снова</button>
			<button onClick={()=>{window.location.href = '/profile'}} className="endgame__popap-button white">Выйти</button>
		</div>
		)
}