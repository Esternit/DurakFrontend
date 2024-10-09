import axios from "axios";
import config from "../../config";

function sendWalking(gameId, attack, defend, type){
	const body = { 
		gameId: gameId, 
		attackCard: attack, 
		defendCard: defend, 
		type
	}
	return axios.post(`${config.url}/game/play`, body, {
		headers: {
			"Access-Control-Expose-Headers": "X-Session",
			"X-Session": localStorage.getItem("session_key"),
		},
	}
	)
}
export default sendWalking