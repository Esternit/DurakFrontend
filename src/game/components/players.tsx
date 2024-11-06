import React from "react";
import imgAvatar from '../../media/img/avatar.png'
import Player from "./player.tsx";

function Players({game, emoji}) {
	if(!game){return <div className="players"></div>}
	
	const step = Math.floor(game.players?.length/2)
	return <div className="players" style={{position: 'relative'}}>
		{game.players?.map((player, i) => (
			<Player 
				player={player} 
				imgAvatar={imgAvatar}
				emoji={emoji}
				attakerPlayer={player.id == game.attackerId}
				index={i}
				topIndex={i - step}
				sizePlayersArr={game.players?.length}
			/>
		))}
	</div>
}

export default Players