import config from "./config";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const connectToSocket = (gameId, onChangeFunction) => {
	let stompClient = null;
	let socket = new SockJS(
	config.url +
		"/gameplay?X-Session=" +
		JSON.parse(localStorage.getItem("user")).id
	);
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function (frame) {
		stompClient.subscribe(`/topic/game-progress/${gameId}`, response=> {
				let data = JSON.parse(response.body);
				onChangeFunction(data);
			}
		);
	});
};


let socket = null;
let connectionState = false;

function initConnection(gameId, listener) {
    const getSocket = () =>
        (socket = new WebSocket(config.url + "/gameplay?X-Session=" + JSON.parse(localStorage.getItem("user")).id));
    socket = getSocket();

    socket.onopen = function (event) {
        connectionState = true;
        return false;
    };

    socket.onmessage = e =>{
		console.log(e)
		listener(e)
	};

    socket.onclose = function (event) {
        connectionState = false;
    };
}

async function sendMessage(message) {
    if (socket && connectionState) {
        socket.send(message);
    } else {
        setTimeout(() => {
            sendMessage(message);
        }, 200);
    }
}
function closeConnection() {
    if (!socket) return new Error('Ой! WebSocket = null');
    socket.close();
}
const exp = () => {
    return { init: initConnection, send: sendMessage, close: closeConnection };
};
export default exp
