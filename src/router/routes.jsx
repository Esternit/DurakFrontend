// routes.jsx

import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes as Switch,
} from "react-router-dom";
import Main from "../sections/main";
import Games from "../sections/games";
import Profile from "../sections/profile";
import Earn from "../sections/earn";
import Market from "../sections/market";
import Tourneys from "../pages/tourneys";
import Lobbies from "../pages/lobbies";
import LobbiesCreate from "../pages/lobbies.create";
//
import PageDeposit from "../pages/deposit";
import PageWithDraw from "../pages/withdraw";
import PageExchange from "../pages/exchange";
import PagePremium from "../pages/subcribe.premium";
import PageRanking from "../pages/ranking";
import InviteFrends from "../pages/inviteFrends";
// Game
import Game from "../game/game";
// Routes
const AppRoutes = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" element={<Main />} />
				<Route path="/games" element={<Games />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/earn" element={<Earn />} />
				<Route path="/market" element={<Market />} />
				<Route path="/tourneys" element={<Tourneys />} />
				<Route path="/lobbies" element={<Lobbies />} />
				<Route path="/lobbies/create" element={<LobbiesCreate />} />
				{/*  */}
				<Route path="/deposit" element={<PageDeposit />} />
				<Route path="/withdraw" element={<PageWithDraw />} />
				<Route path="/exchange" element={<PageExchange />} />
				<Route path="/subcribe/premium" element={<PagePremium />} />
				<Route path="/subcribe/invite-friends" element={<InviteFrends />} />
				<Route path="/ranking" element={<PageRanking />} />
				{/* Game */}
				<Route path="/game" element={<Game />} />
				{/* <Route path="/game" element={<Gameplay />} /> */}
			</Switch>
		</Router>
	);
};

export default AppRoutes;
