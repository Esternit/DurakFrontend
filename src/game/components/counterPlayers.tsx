import React from "react";

function counterPlayers ({game}){
	return <>
		<div
			className="await"
			style={{
				zIndex: 1000,
				position: "absolute",
				left: "50%",
				top: "20%",
				transform: "translate(-50%, -50%)",
				fontSize: "clamp(30px, 4vw, 40px)",
			}}
		>
			{game.players.length}/{game.playerAmount}
		</div>
	</>
}
export default counterPlayers