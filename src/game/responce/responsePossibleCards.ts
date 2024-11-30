import axios from "axios";
import config from "../../config";

const responsePossibleCards = (gameId, userId)=>{
	const body = { gameId, id: `1` }
	return axios.post(`${config.url}/game/possible-cards`, body, {
		headers: {
			"Access-Control-Expose-Headers": "X-Session",
			"X-Session": localStorage.getItem("session_key"),
		},
	}
	)
}

export default responsePossibleCards