import React from "react";
import Players from "../components/players.tsx";
import CounterPlayers from "../components/counterPlayers.tsx";


function Lobby ({game}){
	return <> 
		<Players game={game} initActive={true}/>
		<CounterPlayers game={game} />
	</>
}

export default Lobby