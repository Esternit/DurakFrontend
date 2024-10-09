import axios from "axios";
import config from "../../config";

function finishTurn(gameId){
	const body = { 
		gameId: gameId, 
	}
	return axios.post(`${config.url}/game/finish-turn`, body, {
		headers: {
			"Access-Control-Expose-Headers": "X-Session",
			"X-Session": localStorage.getItem("session_key"),
		},
	}
	).then(rez=>{}).catch(err=>{})
}
export default finishTurn