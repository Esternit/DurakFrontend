import React, { useState } from "react";
import imgAvatar from '../../media/img/avatar.png'
import Player from "./player.tsx";

function Players({game, emoji}) {
	const [selectedEmoji, setSelectedEmoji] = useState(null);
	const [selectedEmojiClass, setSelectedEmojiClass] = useState("");

	return <div className="players">
		{game?.players?.map((player) => (
			<Player 
				player={player} 
				selectedEmoji={selectedEmoji} 
				selectedEmojiClass={selectedEmojiClass} 
				imgAvatar={imgAvatar}
				emoji={emoji}
				setSelectedEmoji={setSelectedEmoji}
				setSelectedEmojiClass={setSelectedEmojiClass}
				attakerPlayer={player.id == game.attackerId}
			/>
		))}
	</div>
}

export default Players