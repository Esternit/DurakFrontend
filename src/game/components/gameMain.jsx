import React, { useEffect, useState } from "react";
import PlayerButtons from "./playerButtons.tsx";
import Emoji from "./emoji.tsx";
import Cards from "./cards.tsx";
import Players from "./players.tsx";
import Timer from "./initTimer.tsx";
import ChangeCard from "./changeCard.tsx";
import EnemyCard from "./enemyCard.tsx";


function GameMain({ game, emoji, setEmoji }) {
	const [showEmojiPopup, setShowEmojiPopup] = useState(false);
	const userId = JSON.parse(localStorage.getItem('user')).id

	useEffect(() => {
		if (game) {
			if (game.gameState == 'game_over') {
				window.location.href = '/games'
			}
		}
	}, [game])

	return <>
		<Players game={{ 'players': game.players.filter(el => el.id != userId) }} emoji={emoji} setEmoji={setEmoji} />
		<Timer game={game} type="game" />

		<ChangeCard game={game} />
		<EnemyCard game={game} />

		<Cards game={game} />

		<PlayerButtons game={game} setShowEmojiPopup={setShowEmojiPopup} />
		<Emoji showEmojiPopup={showEmojiPopup} setShowEmojiPopup={setShowEmojiPopup} />
	</>
}
export default GameMain