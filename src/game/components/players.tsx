import React, { useState } from "react";
import imgAvatar from '../../media/img/avatar.png'
import Player from "./player.tsx";

function Players({game, emoji}) {
	

	return <div className="players">
		{game?.players?.map((player) => (
			<Player 
				player={player} 
				
				imgAvatar={imgAvatar}
				emoji={emoji}

				attakerPlayer={player.id == game.attackerId}
			/>
		))}
	</div>
}

export default Players