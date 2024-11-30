import React, { useRef } from "react";
import "../media/css/component/games.rooms.css";
import "../media/css/component/rooms.list.css";
import IconSearch from "../components/icons/search";
import IconFilter from "../components/icons/filter";
import IconChevronRight from "./icons/chevronRight";
import IconArrowDegRight from "./icons/arrowDegRight";
import IconPlayWhite from "./icons/playWhite";
import IconDur from "./icons/dur";
import IconAlertCircle from "./icons/alertCircle";
import IconRefresh from "./icons/refresh";
import IconCoin from "./icons/coin";
import PostRequester from "../PostRequester";
//
import { useNavigate } from "react-router-dom";
//
import FilterWindow from "../components/lobbies.filter.window";
import { I18nText } from "./i18nText";
import { useIntl } from "react-intl";
import axios from "axios";
import config from "../config";
import ShowPopup from "../ShowPopup";
import EndgamePrevew from '../game/res/skins/endgame/priview.png'

//
const GamesRooms = ({ roomsData }) => {
	const [isFilterOpen, setIsFilterOpen] = React.useState(false);
	const navigate = useNavigate();
	const popapPassRef = useRef(null)
	const popapErrorRef = useRef(null)

	const connectToGame = async (id, pass) => {
		try {
			await axios
				.post(
					config.url + "/game/connect",
					{
						gameId: id,
						password: pass
					},
					{
						headers: {
							"Access-Control-Expose-Headers": "X-Session",
							"X-Session": localStorage.getItem("session_key"),
						},
					}
				)
				.then((res) => {
					localStorage.setItem("session_key", res.headers.get("X-Session"));
					localStorage.setItem("game_status", JSON.stringify(res.data));
					window.location.href = `/game?type=quick`;
				});
		} catch (e) {
			return 'error'
		}
	};

	const deleteGame = async (id) => {
		try {
			await axios
				.post(
					config.url + "/game/leave",
					{
						gameId: id,
					},
					{
						headers: {
							"Access-Control-Expose-Headers": "X-Session",
							"X-Session": localStorage.getItem("session_key"),
						},
					}
				)
				.then((res) => {
					localStorage.setItem("session_key", res.headers.get("X-Session"));
					localStorage.setItem("game_status", JSON.stringify(res.data));
				});
		} catch (e) {
			ShowPopup(e.response.data, "Error");
		}
	};

	const linkLobbies = () => {
		navigate("/lobbies/create");
	};

	const toggleSearchBar = () => {
		const bar = document.querySelector(".search_bar");
		bar.classList.toggle("search_bar_active");
	};

	const intl = useIntl();
	const placeholder = intl.formatMessage({ id: "search_room" });

	// const roomsData = [
	//   {
	//     id: 1,
	//     price: 5,
	//     currency: null,
	//     owner_name: "Christian Bale",
	//     players_count: 2,
	//     players_limit: 3,
	//     status: null,
	//   },
	//   {
	//     id: 2,
	//     price: null,
	//     currency: null,
	//     owner_name: "Christian Bale",
	//     players_count: 2,
	//     players_limit: 3,
	//     status: null,
	//   },
	//   {
	//     id: 3,
	//     price: 10,
	//     currency: "DUR",
	//     owner_name: "Christian Bale",
	//     players_count: 1,
	//     players_limit: 2,
	//     status: null,
	//   },
	//   {
	//     id: 4,
	//     price: 2,
	//     currency: "Coin",
	//     owner_name: "Christian Bale",
	//     players_count: 2,
	//     players_limit: 3,
	//     status: null,
	//   },
	//   {
	//     id: 5,
	//     price: null,
	//     currency: null,
	//     owner_name: "Christian Bale",
	//     players_count: 2,
	//     players_limit: 2,
	//     status: null,
	//   },
	//   {
	//     id: 6,
	//     price: 1,
	//     currency: "Coin",
	//     owner_name: "Christian Bale",
	//     players_count: 2,
	//     players_limit: 3,
	//     status: null,
	//   },
	// ];

	const getPriceContent = (price, currency) => {
		if (price === null || price === 0) return "Free";
		if (currency === "premium")
			return (
				<>
					{price}
					<IconDur />
				</>
			);
		if (currency === "usual")
			return (
				<>
					{price}
					<IconCoin />
				</>
			);
		return price;
	};
	const toggleFilter = () => {
		setIsFilterOpen(!isFilterOpen);
		let w = document.querySelector(".filter_window"),
			btns = document.querySelector(".btn_bar");
		w.classList.toggle("filter_window_active");
		btns.classList.toggle("fmode");
		document.body.classList.toggle("filter-open", !isFilterOpen);
	};

	return (
		<div className="rooms">
			{/* Header */}
			<header className="header anim_sjump">
				<div className="row">
					<h2 className="title">
						<I18nText path="rooms" />:
					</h2>
					<div className="right-group">
						<button className="btn_create" onClick={linkLobbies}>
							<I18nText path="create_game" />
						</button>
						<div className="btns">
							<button className="btn_search" onClick={toggleSearchBar}>
								<IconSearch />
							</button>
							<button className="btn_filter" onClick={toggleFilter}>
								<IconFilter />
							</button>
						</div>
					</div>
				</div>
				<div className="search_bar">
					<input
						type="text"
						name="search"
						className="search_input"
						placeholder={placeholder}
					/>
				</div>
			</header>
			<FilterWindow isOpen={isFilterOpen} onClose={toggleFilter} />

			{/* list */}
			<div className="rooms_list anim_sjump">

				<div id="enterpassPopap" ref={popapPassRef} data-room='' className="rooms__popap-enterpass">
					<div className="rooms__popap-enterpass-title">
						<I18nText path="join__lobby" />
					</div>
					<input id="enterpassInput" type="number" onInput={(e) => {
						e.target.value.length > 4 && (e.target.value = e.target.value.slice(0, 4))
					}} className="rooms__popap-enterpass-input" placeholder="Enter lobby password..."></input>
					<button className="rooms__popap-enterpass-button" onClick={() => {
						const pass = document.getElementById('enterpassInput').value
						const { room } = document.getElementById('enterpassPopap').dataset
						connectToGame(room, pass).then(e => {
							if (e == 'error') {
								popapPassRef.current.classList.remove('active')
								popapErrorRef.current.classList.add('active')
								setTimeout(() => {
									popapErrorRef.current.classList.remove('active')
								}, 1000)
							}
						})
					}}><I18nText path="join" /></button>
				</div>

				<div ref={popapErrorRef} className="rooms__popap-error">
					<img className="rooms__popap-error-icon" src={EndgamePrevew} alt=""></img>
					<div className="rooms__popap-error-title"><I18nText path="sorry__join" /></div>
					<div className="rooms__popap-error-text"><I18nText path="wrong__password" /></div>
				</div>

				{roomsData.map((room) => (
					<div
						className="room"
						key={room.gameId}
						onClick={() => {
							if (room.password) {
								popapPassRef.current.classList.add('active')
								popapPassRef.current.setAttribute('data-room', room.gameId)
							} else {
								connectToGame(room.gameId, '')
							}
						}}
					>
						<div className="gr">
							<div className="price" >
								{getPriceContent(room.betAmount, room.betType)}
							</div>
							<span className="owner_name">{room.name}</span>
							{room.password ? <span className="owner_name" style={{ color: '#51C4FF' }}>Private</span> : <></>}
						</div>
						<div className="info">
							{/* <button onClick={() => deleteGame(room.gameId)}>Delete</button> */}
							<div className="corner">
								{room.type === "CLASSIC" ? (
									<IconPlayWhite />
								) : room.type === "PODKIDNOY" ? (
									<IconArrowDegRight />
								) : room.type === "PEREVODNOY" ? (
									<IconRefresh />
								) : room.type === "SHULLERS" ? (
									<IconAlertCircle />
								) : null}
								{/* {room.players_count < room.players_limit ? (
                  <IconArrowDegRight />
                ) : (
                  <IconPlayWhite />
                )} */}
							</div>
							<div className="players_count">{`${room.players.length}/${room.playerAmount}`}</div>
							<button
								className="sign_btn"
								onClick={() => connectToGame(room.gameId)}
							>
								<IconChevronRight />
							</button>
						</div>
					</div>
				))}
			</div>
			{/* / */}
		</div >
	);
};

export default GamesRooms;
