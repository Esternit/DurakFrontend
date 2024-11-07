import config from "./config";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const connectToSocket = (gameId, onChangeFunction) => {
	// let stompClient = null;
	let socket = new WebSocket(
		config.url + "/gameplay?X-Session=" +JSON.parse(localStorage.getItem("user")).id
	);
	socket.onopen = function (event) {
		console.log(event)
        return true;
    };
	socket.onmessage = e =>{
		console.log(e)
		onChangeFunction(e)
	};
	socket.onclose = function (event) {
		console.log(event)
        connectionState = false;
    };
	// stompClient = Stomp.over(socket);
	// stompClient.connect({}, function (frame) {
	// 	stompClient.subscribe(`/topic/game-progress/${gameId}`, response=> {
	// 			let data = JSON.parse(response.body);
	// 			onChangeFunction(data);
	// 		}
	// 	);
	// });

	// const client = new Client({
	// 	brokerURL: config.url + "/gameplay?X-Session=" +JSON.parse(localStorage.getItem("user")).id,
	// 	onConnect: () => {
	// 	  client.subscribe(`/topic/game-progress/${gameId}`, message =>
	// 		console.log(`Received: ${message.body}`)
	// 	  );
	// 	  client.publish({ destination: `/topic/game-progress/${gameId}`, body: 'First Message' });
	// 	},
	//   });
	  
	//   client.activate();
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
