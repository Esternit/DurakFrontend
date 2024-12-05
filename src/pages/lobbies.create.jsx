import React, { useRef } from "react";
import "../media/css/page/lobbies.create.css";
// import IconAlertCircle from "../components/icons/alertCircle";
import IconArrowDegRight from "../components/icons/arrowDegRight";
import IconRefresh from "../components/icons/refresh";
// UI
import ProgressBar from "../components/ui/progressBar";
// data
import LobbiesLayout from "../layouts/lobbies.layout";
import IconDUR from "../components/icons/dur";
import IconCoin from "../components/icons/coin";
// -
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import BackBtn from "../BackBtn";
import { I18nText } from "../components/i18nText";
import IconPlay from "../components/icons/play";
import IconAlertCircle from "../components/icons/alertCircle";
import { useIntlProvider } from "../Prodivers";
// img
import checkMarkPassImg from '../game/res/icon/checkMarkPass.svg'
import closeImg from '../game/res/icon/closeGray.svg'
const bids = [0, 1, 10, 100, 500, 1000, 5000, 10000, 50000, 100000];
const players = [2, 3, 4, 5, 6, 7, 8];
const maxPlayersMap = {
	24: 3,
	36: 5,
	52: 8,
	0: 8
}

const LobbiesCreate = () => {
	const [playerAmount, setPlayerAmount] = React.useState(2);
	const [bidCur, setBidCur] = React.useState("Free");
	const [bidAmount, setBidAmount] = React.useState(0);
	const [progress, setProgress] = React.useState(0);
	const [progressPlayers, setProgressPlayers] = React.useState(0);
	const [name, setName] = React.useState("Anonim");
	const [gameType, setGameType] = React.useState("CLASSIC");
	const [fieldSize, setFieldSize] = React.useState(0);
	const [password, setPassword] = React.useState('');
	const navigate = useNavigate();
	const intlProviderValue = useIntlProvider()

	const passRef = useRef(null)

	React.useEffect(() => {
		BackBtn("/", navigate);
	});

	const createGame = async () => {
		try {
			await axios
				.post(
					config.url + "/game/create",
					{
						fieldSize: fieldSize || 24,
						type: gameType,
						allowedShullerMoves: gameType === "SHULLER" ? 1 : 0,
						betAmount: bidCur === "Free" ? 0 : bidAmount,
						betType: bidCur === "Free" ? "usual" : bidCur,
						name: name.length > 0 ? name : "Anonimus",
						playerAmount: playerAmount,
						password: password
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
		} catch (err) {
			localStorage.setItem(
				"session_key",
				err.response.headers.get("X-Session")
			);
			return null;
		}
	};

	const bidChanger = (value) => {
		setBidAmount(bids[value]);
		setProgress(value);
	};

	const playersNumberChanger = (value) => {
		setPlayerAmount(players[value]);
		setProgressPlayers(value);
	};

	const getHandleChangeFieldSize = (value) => {
		return () => {
			setFieldSize(value);
			playersNumberChanger(0);
		}
	};
	const userInfo = JSON.parse(localStorage.getItem("user"));
	return (
		<LobbiesLayout coinValue={userInfo.usualBalance || 0} durValue={userInfo.premiumBalance || '0.00'}>
			<div className="filter_window create_window">
				<div className="lobby_name">
					<input
						type="text"
						placeholder={intlProviderValue.locale == 'ru' ? "Введите название комнаты..." : "Enter lobby name..."}
						name="lobby_name"
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<p>
					<I18nText path="filter_window_choose_number_of_cards" />
				</p>

				<div className="cards_number">
					<input
						type="radio"
						id="v1"
						name="cards_count"
						onClick={getHandleChangeFieldSize(24)}
					/>
					<label htmlFor="v1">24</label>
					<input
						type="radio"
						id="v2"
						name="cards_count"
						onClick={getHandleChangeFieldSize(36)}
					/>
					<label htmlFor="v2">36</label>
					<input
						type="radio"
						id="v3"
						name="cards_count"
						onClick={getHandleChangeFieldSize(52)}
					/>
					<label htmlFor="v3">52</label>
				</div>

				<p>
					<I18nText path="filter_window_amount_of_players" />
				</p>

				<ProgressBar
					values={players.filter((item) => item <= maxPlayersMap[fieldSize])}
					progress={progressPlayers}
					setProgress={playersNumberChanger}
				/>

				<p>
					<I18nText path="filter_window_bid_type" />
				</p>

				<div className="bid">
					<input type="radio" id="cbid2" name="bid" />
					<label
						htmlFor="cbid2"
						onClick={() => setBidCur("premium")}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: '0 auto'
						}}
					>
						<IconDUR />
					</label>
					<input type="radio" id="cbid3" name="bid" />
					<label
						htmlFor="cbid3"
						onClick={() => setBidCur("usual")}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: '0 auto'
						}}
					>
						<IconCoin />
					</label>
				</div>

				<p>
					<I18nText path="filter_window_bids_amount" />
				</p>
				<ProgressBar
					values={[0, 1, 10, 100, 500, "1k", "5k", "10k", "50k", "100k"]}
					progress={progress}
					setProgress={bidChanger}
				/>

				<p>
					<I18nText path="filter_window_game_type" />
				</p>

				<div className="game_type">
					<input type="radio" id="cgt1" name="game_type" />
					<label htmlFor="cgt1" onClick={() => setGameType("CLASSIC")}>
						<I18nText path="filter_window_classical" /> <IconPlay />
					</label>
					<input type="radio" id="cgt2" name="game_type" />
					<label htmlFor="cgt2" onClick={() => setGameType("PEREVODNOY")}>
						<I18nText path="filter_window_passing" /> <IconRefresh />
					</label>
					<input type="radio" id="cgt3" name="game_type" />
					<label htmlFor="cgt3" onClick={() => setGameType("PODKIDNOY")}>
						<I18nText path="filter_window_throwing_extra" /> <IconArrowDegRight />
					</label>
					<input type="radio" id="cgt4" name="game_type" />
					<label htmlFor="cgt4" onClick={() => setGameType("SHULLERS")}>
						<I18nText path="filter_window_with_schullers" /> <IconAlertCircle />
					</label>
				</div>

				<div className="create__room-private-box">
					<div onClick={(e) => {
						const box = e.target.closest('#privateCheckbox')
						if (box.className.includes('active')) {
							passRef.current.value = ''
							setPassword('')
							box.classList.remove('active')
							document.getElementById('passPopap').classList.remove('active')
						} else {
							box.classList.add('active')
							document.getElementById('passPopap').classList.add('active')
						}
					}} id="privateCheckbox" className="create__room-private-checkbox">
						<img className="create__room-private-checkbox-icon" src={checkMarkPassImg}></img>
					</div>
					<div className="create__room-private-text"><I18nText path="private" /></div>

					<div id="passPopap" className="create__room-private-popap">
						<div className="create__room-private-popap-title"><I18nText path="enter_password" /></div>
						<div className="create__room-private-popap-inputs">
							<div className="create__room-private-popap-input-plug"></div>
							<div className="create__room-private-popap-input-plug"></div>
							<div className="create__room-private-popap-input-plug"></div>
							<input ref={passRef} tabindex="-1" type="number" className="create__room-private-popap-input"></input>
						</div>
						<div className="create__room-private-popap-buttons">
							<div onClick={() => clickPassButtonNum(passRef, '1', setPassword)} className="create__room-private-popap-button">1</div>
							<div onClick={() => clickPassButtonNum(passRef, '2', setPassword)} className="create__room-private-popap-button">2</div>
							<div onClick={() => clickPassButtonNum(passRef, '3', setPassword)} className="create__room-private-popap-button">3</div>
						</div>
						<div className="create__room-private-popap-buttons">
							<div onClick={() => clickPassButtonNum(passRef, '4', setPassword)} className="create__room-private-popap-button">4</div>
							<div onClick={() => clickPassButtonNum(passRef, '5', setPassword)} className="create__room-private-popap-button">5</div>
							<div onClick={() => clickPassButtonNum(passRef, '6', setPassword)} className="create__room-private-popap-button">6</div>
						</div>
						<div className="create__room-private-popap-buttons">
							<div onClick={() => clickPassButtonNum(passRef, '7', setPassword)} className="create__room-private-popap-button">7</div>
							<div onClick={() => clickPassButtonNum(passRef, '8', setPassword)} className="create__room-private-popap-button">8</div>
							<div onClick={() => clickPassButtonNum(passRef, '9', setPassword)} className="create__room-private-popap-button">0</div>
						</div>
						<div className="create__room-private-popap-buttons">
							<div onClick={(e) => {
								if (passRef.current.value.length == 4) {
									passRef.current.value = ''
									e.target.closest('#passPopap').classList.remove('active')
								}
							}} className="create__room-private-popap-button">ОК</div>
							<div onClick={() => clickPassButtonNum(passRef, '0', setPassword)} className="create__room-private-popap-button">0</div>
							<div onClick={(e) => {
								passRef.current.value = ''
								document.getElementById('privateCheckbox').classList.remove('active')
								e.target.closest('#passPopap').classList.remove('active')
							}} className="create__room-private-popap-button">
								<img className="create__room-private-popap-button-icon" src={closeImg}></img>
							</div>
						</div>
					</div>
				</div>
				<div className="btn_bar">
					<button className="create_btn" onClick={createGame}>
						Create game
					</button>
				</div>
			</div>
		</LobbiesLayout >
	);
};

export default LobbiesCreate;


function clickPassButtonNum(passRef, v, setPassword) {
	passRef.current.value.length < 4 && (passRef.current.value += v);
	setPassword(passRef.current.value)
}