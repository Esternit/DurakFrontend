import {connectToSocket} from "../../connectToSocket"

type Tprops = {
	setGame: React.Dispatch<any>
	setEmoji: React.Dispatch<any>
	setExpectationState: React.Dispatch<any>
	setPlayerAmount: React.Dispatch<any>
}

function expectation (props: Tprops){
	const gameStatus = JSON.parse(localStorage.getItem("game_status") || '') as {gameId: ''}
	connectToSocket(gameStatus['gameId'], change.bind(this, props))
}
export default expectation

function change(props: Tprops, data){
	const {setGame, setEmoji,setExpectationState, setPlayerAmount} = props

	if(data){
		if(data.emoji == undefined){
			setTimeout(()=>{
				setGame(data)
	
				if(data['playerAmount']){
					console.log(data['playerAmount'])
					setPlayerAmount(data['playerAmount'])
				}else{
					setExpectationState(false)
				}
			}, 300)
		}else{
			setEmoji(data)
		}
	}
}