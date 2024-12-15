import React, { useEffect } from "react";
import Players from "../components/players.tsx";
import CounterPlayers from "../components/counterPlayers.tsx";
import axios from "axios";
import config from "../../config.js";


function Lobby ({game}){

	useEffect(()=>{getUsersLobbyCosmetick()}, [game.players])
	return <> 
		<Players game={game} initActive={true}/>
		<CounterPlayers game={game} />
	</>
}

export default Lobby

async function getUsersLobbyCosmetick(){
	await axios.get(config.url + "/game/enemy-cosmetics", {
		headers: {
		  "Access-Control-Expose-Headers": "X-Session",
		  "X-Session": localStorage.getItem("session_key"),
		},
	  }).then(res=>
	  {
		console.log(res.data)
		localStorage.setItem('lobbyCosmetic',JSON.stringify(res.data))
	  }
	  ).catch(err=>console.log(err));
}