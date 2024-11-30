import React from "react";
//
import "../media/css/component/filter.window.css";
import "../media/css/games.css";
// components
import GamesPlayCards from "../components/games.play.cards";
import GamesRooms from "../components/games.rooms";
import Preloader from "../includes/preloader";
// NavBar
import NavBar from "../components/nav.bar";
import { I18nText } from "../components/i18nText";
import { useNavigate } from "react-router-dom";
import BackBtn from "../BackBtn";
import axios from "axios";
import config from "../config";
import ShowPopup from "../ShowPopup";

const Games = () => {
	const [loading, setLoading] = React.useState(true);
	const [data, setData] = React.useState([]);
	const navigate = useNavigate();

	React.useEffect(() => {
		BackBtn("/", navigate);
	});

	React.useEffect(() => {
		try {
			if (loading === false) return;
			axios
				.get(config.url + "/game/all-awaiting-games", {
					headers: {
						"Access-Control-Expose-Headers": "X-Session",
						"X-Session": localStorage.getItem("session_key"),
					},
				})
				.then((res) => {
					localStorage.setItem("session_key", res.headers.get("X-Session"));
					setData(res.data);
					setLoading(false);
				});
		} catch (e) {
			ShowPopup(e.response.data, "Error");
		}
	}, []);
	return (
		<>
			{loading ? (
				<Preloader />
			) : (
				<>
					<section className="page games">
						<Preloader />
						<div className="container">
							{/* play cards */}
							<GamesPlayCards />
							{/* rooms */}
							<GamesRooms roomsData={data} />
							{/* / */}

							{/* nav */}
						</div>
					</section>
					<NavBar />
				</>
			)}
		</>
	);
};
export default Games;
