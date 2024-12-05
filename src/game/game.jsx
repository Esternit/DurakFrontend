import React, { useEffect, useRef, useState } from "react";
import "../game/css/game.css";

import Lobby from "./components/lobby.tsx";
import GameMain from "./components/gameMain.jsx";
import expectation from "./mainFn/expectation.ts";
import responseStartGame from "./responce/responseStartGame.ts";


// game
const Game = () => {
	const [game, setGame] = useState(JSON.parse(localStorage.getItem("game_status") || ''))
	const [expectationState, setExpectationState] = useState(true)
	const [emoji, setEmoji] = useState(null)
	const [playerAmount, setPlayerAmount] = useState(0)
	const sectionRef = useRef(null)

	useEffect(() => { expectation({ setGame, setEmoji, setExpectationState, setPlayerAmount }) }, [])

	useEffect(() => {
		if (expectationState && game.players?.length == playerAmount) {
			setTimeout(() => { responseStartGame(game) }, 5000)
		}
	}, [expectationState, playerAmount, game.players])


	useEffect(() => {
		const resize = () => {
			setGame(p => ({ ...p }))
		}
		window.addEventListener('resize', resize)
		return () => window.removeEventListener('resize', resize)
	}, [])

	useEffect(() => {
		sectionRef.current.style.height = window.innerHeight + 'px';
	})
	const userCosmetic = JSON.parse(localStorage.getItem("user_cosmetic"));

	return (
		<section
			ref={sectionRef}
			className="game"
			style={{
				backgroundImage: `url(/res/skins${userCosmetic?.find((item) => item.cosmetic?.type === "table")
					?.cosmetic?.link
					})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "auto 100%",
				backgroundPosition: 'center'
			}}
		>
			{expectationState && <Lobby game={game} setExpectation={setExpectationState} />}
			{!expectationState && <GameMain game={game} emoji={emoji} setEmoji={setEmoji} />}
		</section>
	);
};

export default Game;
