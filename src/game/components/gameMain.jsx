import React, { useState } from "react";
import PlayerButtons from "./playerButtons.tsx";
import Emoji from "./emoji.tsx";
import Cards from "./cards.tsx";
import Players from "./players.tsx";
import Timer from "./timer/timerCheckRefresh.tsx";
import ConstCard from "./cosntCard.tsx";
import ChangeCard from "./tableCards/changeCard.tsx";
import EnemyCard from "./tableCards/enemyCard.tsx";
import EndGamePopap from "./endGamePopap.tsx";


function GameMain({ game, emoji, setEmoji }) {
	const [showEmojiPopup, setShowEmojiPopup] = useState(false);
	const userId = JSON.parse(localStorage.getItem('user')).id

	return <>
		<Players game={{
			'attackerId': game.players[game.attackerIndex]?.id,
			'players': game.players.filter(el => el.id != userId),
		}}
			emoji={emoji}
			setEmoji={setEmoji}
			initActive={false}
		/>
		<Timer game={game} />

		<ChangeCard game={game} />
		<EnemyCard game={game} />

		<Cards game={game} />

		<PlayerButtons game={game} setShowEmojiPopup={setShowEmojiPopup} />
		<Emoji showEmojiPopup={showEmojiPopup} setShowEmojiPopup={setShowEmojiPopup} />
		<ConstCard />

		<EndGamePopap game={game} />
	</>
}
export default GameMain