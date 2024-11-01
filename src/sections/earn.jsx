import React, { useEffect, useState } from "react";
// css
import "../media/css/earn.css";
// components
import Preloader from "../includes/preloader";
// img
import imgT1 from "../media/img/earn/t1.png";
import collectStorage from "../api/collectStorage.js";
import buyPassive from "../api/buyPassive.js";
import { useNavigate } from "react-router-dom";
import BackBtn from "../BackBtn";
// icon
import IconCoin from "../components/icons/coin";
import IconDUR from "../components/icons/dur";
import IconChevronRight from "../components/icons/chevronRight";
// NavBar
import NavBar from "../components/nav.bar";
import { I18nText } from "../components/i18nText.jsx";
import PModal from "../components/ui/pModal.jsx";
import { useIntl } from "react-intl";
import availablePassive from "../api/availablePassive.js";
import getAllQuests from "../api/quests.js";
import ownedPassive from "../api/ownedPassive.js";
import { useIntlProvider } from "../Prodivers.js";
import textTranslate from "../api/textTranslate.js";

import balance from '../images/balance/index.js'

const Earn = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		BackBtn("/", navigate);
	});
	// const tasks = [
	//   {
	//     id: 1,
	//     picture: imgT1,
	//     title: "Daily Login",
	//     info: "Login in to the game 7 days in a row",
	//     prize: "+50",
	//     prize_type: "DUR",
	//     category: "basic",
	//   },
	//   {
	//     id: 2,
	//     picture: imgT2,
	//     title: "First victory",
	//     info: "Win one game during the day",
	//     prize: "+1000",
	//     prize_type: "Coin",
	//     category: "basic",
	//   },
	//   {
	//     id: 3,
	//     picture: imgT3,
	//     title: "Ready, steady, go!",
	//     info: "Play one game in Training mode",
	//     prize: "rare avatar frame",
	//     prize_type: "IconUnknownFrame",
	//     category: "basic",
	//   },
	//   // ... добавь все остальные задачи аналогично
	// ];

	const [tasks, setTasks] = useState();
	const { locale } = useIntlProvider()

	useEffect(() => {
		async function fetchTasks() {
			const data = await getAllQuests();
			if (locale == 'en') {
				for (const el in data) {
					const transDes = await textTranslate(data[el].quest.description, 'ru', 'en')
					const transName = await textTranslate(data[el].quest.name, 'ru', 'en')
					data[el].quest.description = transDes
					data[el].quest.name = transName
				}
			}
			setTasks(data);
		}

		fetchTasks();
	}, []);

	const intl = useIntl();
	const speed = intl.formatMessage({ id: "buff_speed" });
	const capacity = intl.formatMessage({ id: "buff_capacity" });
	const perHour = intl.formatMessage({ id: "buff_per_hour" });

	const [modalState, setModalState] = useState({
		isActive: false,
		type: null,
		succesText: null,
		coinCount: null,
		skillText: null,
		skillPrice: null,
		buttonOnClick: null,
	});
	const [earnData, setEarnData] = useState();
	const [availablePassives, setAvailablePassives] = useState();
	const [perHourInfo, setPerHourInfo] = useState({});
	const [storageInfo, setStorageInfo] = useState({});
	const [userInfo, setUserInfo] = useState(
		JSON.parse(localStorage.getItem("user"))
	);

	async function fetch() {
		setPerHourInfo({});
		setStorageInfo({});
		const data = await ownedPassive();
		const data2 = await availablePassive();

		for (let i = 0; i < data2.length; i++) {
			if (data2[i].type === "количество_час") {
				setPerHourInfo(data2[i]);
			}

			if (data2[i].type === "вместимость") {
				setStorageInfo(data2[i]);
			}
		}
		setAvailablePassives(data2);
		setEarnData(data);
	}

	useEffect(() => {
		fetch();
	}, []);

	const closeModal = () => {
		setModalState({ isActive: false, type: null });
	};

	const openModal = async (type, id, price, value, premium, completed) => {
		if (type === "success-speed") {
			fetch();
			setModalState({
				isActive: true,
				type: "success",
				succesText: <I18nText path="speed_increased" />,
			});
		} else if (type === "success-capacity") {
			fetch();
			setModalState({
				isActive: true,
				type: "success",
				succesText: <I18nText path="capacity_increased" />,
			});
		} else if (type === "success-buff-per-hour") {
			fetch();
			setModalState({
				isActive: true,
				type: "success",
				succesText: <I18nText path="buff_per_hour_increased" />,
			});
		} else if (type === "collect") {
			let res = await collectStorage();
			setUserInfo((prevUser) => ({
				...prevUser,
				storage: 0,
			}));
			setModalState({
				isActive: true,
				type: "collect",
				coinCount: res ? res.passiveAmount : 0,
			});
		} else if (type === "skill-speed") {
			setModalState({
				isActive: true,
				type: "skill",
				skillText: `+ ${value} ${speed}`,
				skillPrice: price,
				buttonOnClick: async () => {
					let res = await buyPassive(id);
					if (res != null) {
						openModal("success-speed");
					} else {
						openModal("fail");
					}
				},
			});
		} else if (type === 'taskComplete') {
			const textCheck = await textTranslate('Поздравляем!', 'ru', locale)
			setModalState({
				isActive: true,
				type: "taskComplete",
				skillText: textCheck,
				skillPrice: { price, premium },
			});
		} else if (type === 'task') {
			const textCheck = await textTranslate('Проверить', 'ru', locale)
			setModalState({
				isActive: true,
				type: "task",
				succesText: textCheck,
				skillText: `${value}`,
				skillPrice: { price, premium },
				buttonOnClick: async () => {
					if (completed) {
						openModal("taskComplete", null, price, null, premium);
					} else {
						openModal("taskNotComplete");
					}
				},
			});
		} else if (type === 'taskNotComplete') {
			const textCheck = await textTranslate('Пожалуйста, попробуйте еще раз', 'ru', locale)
			setModalState({
				isActive: true,
				type: "taskNotComplete",
				skillText: textCheck,
				skillPrice: { price, premium },
			});
		} else if (type === "skill-capacity") {
			setModalState({
				isActive: true,
				type: "skill",
				skillText: `X ${value} ${capacity}`,
				skillPrice: price,
				buttonOnClick: async () => {
					let res = await buyPassive(id);
					if (res != null) {
						openModal("success-capacity");
					} else {
						openModal("fail");
					}
				},
			});
		} else if (type === "buff-per-hour") {
			setModalState({
				isActive: true,
				type: "skill",
				skillText: `+ ${value} ${perHour}`,
				skillPrice: price,
				buttonOnClick: async () => {
					let res = await buyPassive(id);
					if (res != null) {
						openModal("success-buff-per-hour");
					} else {
						openModal("fail");
					}
				},
			});
		} else {
			setModalState({
				isActive: true,
				type: "fail",
			});
		}
	};

	const uniqueTypes = [...new Set(tasks?.map((task) => task.quest.type))];
	const capacityValue = earnData ? earnData[0]?.value : 0
	const balanceIdImage = Math.floor(userInfo.storage / (capacityValue / 7)) - 1
	return (
		<>
			<section className="page earn pb-80">
				<Preloader />
				<div className="container">
					<h1 className="page_title">
						<I18nText path="earn" />
					</h1>
					{/* header */}
					<div className="header_bar anim_sjump">
						<div className="content">
							<img className="back_img" src={balance[`coin${balanceIdImage > 0 ? balanceIdImage : 0}`]} alt="imgCoins" />
							<p className="coins">
								{userInfo.storage}/{capacityValue}{" "}
								<IconCoin />
							</p>
							<span className="per">
								{earnData ? earnData[1]?.value : 0}/
								<I18nText path="per_hour" />
							</span>
						</div>
						<div className="buffs">
							<button onClick={() => openModal("collect", -1)}>
								<I18nText path="buff_collect" />
							</button>
							{/* <button
                onClick={() =>
                  openModal(
                    "skill-speed",
                    availablePassives ? availablePassives[2]?.id : -1,
                    availablePassives ? availablePassives[2]?.price : 0,
                    availablePassives ? availablePassives[2]?.value : 0
                  )
                }
              >
                + {availablePassives ? availablePassives[2]?.value : 0}{" "}
                <I18nText path="buff_speed" />
              </button> */}
							{perHourInfo.value != null && (
								<button
									onClick={() =>
										openModal(
											"buff-per-hour",
											perHourInfo ? perHourInfo.id : -1,
											perHourInfo ? perHourInfo.price : 0,
											perHourInfo ? perHourInfo.value - earnData[1]?.value : 0
										)
									}
								>
									{/* +{" "}
                {availablePassives
                  ? availablePassives[1]?.value - earnData[1]?.value
                  : 0}{" "} */}
									<I18nText path="buff_per_hour" />
								</button>
							)}
							{storageInfo.value != null && (
								<button
									onClick={() =>
										openModal(
											"skill-capacity",
											availablePassives ? storageInfo.id : -1,
											availablePassives ? storageInfo.price : 0,
											availablePassives
												? storageInfo.value / earnData[0]?.value
												: 0
										)
									}
								>
									{/* X{" "}
                {availablePassives
                  ? availablePassives[0]?.value / earnData[0]?.value
                  : 0}{" "} */}
									<I18nText path="buff_capacity" />
								</button>
							)}
						</div>
					</div>
					{/* tasks */}

					<div className="tasks">
						{tasks &&
							uniqueTypes.map((type) => (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "15px",
									}}
									key={type}
								>
									<h2>
										{type === "Обычные Квесты" ? (
											<I18nText path="basic_tasks" />
										) : type === "Особые Квесты" ? (
											<I18nText path="specific_tasks" />
										) : type === "Редкие Квесты" ? (
											<I18nText path="rare_tasks" />
										) : type === "Реликтовые Квесты" ? (
											<I18nText path="relic_tasks" />
										) : type === "Специальные Квесты" ? (
											<I18nText path="special_tasks" />
										) : type === "Дополнительные Квесты" ? (
											<I18nText path="other_tasks" />
										) : (
											<I18nText path="other_tasks" />
										)}
									</h2>
									{tasks
										.filter(
											(task) => task.quest.type === type && !task.completed
										)
										.map((task) => (
											< button
												onClick={() => openModal(
													'task',
													task.id,
													task.quest.award,
													task.quest.description,
													task.quest.awardCurrency === "premium",
													task.completed
												)}
												key={task.id}
												className="task anim_sjump"
											>
												<img
													className="picture anim_sjump"
													src={imgT1}
													alt="task_picture"
												/>
												<div className="content">
													<p className="title">{task.quest.name}</p>
													<span className="info">{task.quest.description}</span>
													<div className="prize">
														+{task.quest.award}{" "}
														{task.quest.awardCurrency === "premium" ? (
															<IconDUR />
														) : (
															<IconCoin />
														)}
													</div>
												</div>
												<IconChevronRight />
											</button>
										))}
								</div>
							))}
					</div>
				</div>
				<PModal
					isActive={modalState.isActive}
					type={modalState.type}
					closeModal={closeModal}
					succesText={modalState.succesText}
					coinCount={modalState.coinCount}
					skillText={modalState.skillText}
					skillPrice={modalState.skillPrice}
					buttonOnClick={modalState.buttonOnClick}
				/>
			</section >
			<NavBar />
		</>
	);
};
export default Earn;
