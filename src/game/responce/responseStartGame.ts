import axios from "axios";
import config from "../../config";

function responseStartGame(game) {
	const body = { gameId: game.gameId }
	axios.post(`${config.url}/game/start-game`, body, {
		headers: {
			"Access-Control-Expose-Headers": "X-Session",
			"X-Session": localStorage.getItem("session_key"),
		},
	}
	).then((res) => { }).catch((err) => { });
}
export default responseStartGame