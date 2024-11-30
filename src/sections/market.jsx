import React, { useEffect, useState } from "react";
// css
import "../media/css/market.css";
// components
import Preloader from "../includes/preloader";
import NavBar from "../components/nav.bar";
import ImageLoader from "../includes/imageLoader";
import PModal from "../components/ui/pModal";
// img
import catFrame from "../media/img/catFrame.png";
import catTable from "../media/img/catTable.png";
import catCard from "../media/img/catCard.png";
import catEmoji from "../media/img/catEmoji.png";
import { I18nText } from "../components/i18nText";
import { getMarket } from "../api/market";
import IconCoin from "../components/icons/coin";
import IconCoinDUR from "../components/icons/dur";
import axios from "axios";
import config from "../config";
import ShowPopup from "../ShowPopup";
import { useNavigate } from "react-router-dom";
import BackBtn from "../BackBtn";

const Market = () => {
	const [market, setMarket] = useState();
	const navigate = useNavigate();

	React.useEffect(() => {
		BackBtn("/", navigate);
	});

	useEffect(() => {
		async function fetchMarket() {
			const data = await getMarket();
			setMarket(data);
		}

		fetchMarket();
	}, []);

	// Состояние для активного типа
	const [activeType, setActiveType] = useState("frame");
	const [activeCategories, setActiveCategories] = useState([]);

	const handleTypeClick = (type) => {
		setActiveType(type);
	};

	const handleCategoryClick = (category) => {
		setActiveCategories((prevCategories) => {
			if (prevCategories.includes(category)) {
				return prevCategories.filter((cat) => cat !== category);
			} else {
				return [...prevCategories, category];
			}
		});
	};

	// Фильтрация продуктов по активному типу и категориям
	const filteredProducts = market?.filter(
		(product) =>
			product.cosmetic.type === activeType &&
			(activeCategories.length === 0 ||
				activeCategories.includes(product.cosmetic.rarity))
	);

	// modal state
	const [modalState, setModalState] = useState({
		isActive: false,
		type: null, // "success" или "fail"
		succesText: <I18nText path="new_item" />, // "success" или "fail"
	});

	const closeModal = () => {
		setModalState({ isActive: false, type: null });
	};

	const handleBuy = async (itemData) => {
		try {
			await axios
				.post(
					config.url + "/market",
					{
						id: itemData.id,
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

					setModalState({
						isActive: true,
						type: "success",
						succesText: <I18nText path="new_item" />,
					});
				})
				.catch((error) => {
					if (error.response.data === "Not enough balance") {
						setModalState({
							isActive: true,
							type: "fail",
						});
					} else {
						setModalState({
							isActive: true,
							type: "fail",
						});
					}
				});
		} catch (e) {
			ShowPopup(e.response.data, "Error");
		}
	};

	return (
		<>
			<section className="page market pb-80">
				<Preloader />
				<div className="container">
					{/* main */}
					<header className="header_menu">
						<div className="type_btns">
							<button
								className={`btn frame ${activeType === "frame" ? "active-type" : ""
									}`}
								onClick={() => handleTypeClick("frame")}
							>
								<I18nText path="frames" />
								<img src={catFrame} alt="category" />
							</button>
							<button
								className={`btn table ${activeType === "table" ? "active-type" : ""
									}`}
								onClick={() => handleTypeClick("table")}
							>
								<I18nText path="tables" />
								<img src={catTable} alt="category" />
							</button>
							<button
								className={`btn card ${activeType === "card" ? "active-type" : ""
									}`}
								onClick={() => handleTypeClick("card")}
							>
								<I18nText path="cards" />
								<img src={catCard} alt="category" />
							</button>
							<button
								className={`btn emoji ${activeType === "emoji" ? "active-type" : ""
									}`}
								onClick={() => handleTypeClick("emoji")}
							>
								<I18nText path="emojis" />
								<img src={catEmoji} alt="category" />
							</button>
						</div>
						<div className="category_btns active_category">
							<button
								className={`btn standart ${activeCategories.includes("standard") ? "active" : ""
									}`}
								onClick={() => handleCategoryClick("standard")}
							>
								<I18nText path="standart" />
							</button>
							<button
								className={`btn special ${activeCategories.includes("special") ? "active" : ""
									}`}
								onClick={() => handleCategoryClick("special")}
							>
								<I18nText path="special" />
							</button>
							<button
								className={`btn rare ${activeCategories.includes("rare") ? "active" : ""
									}`}
								onClick={() => handleCategoryClick("rare")}
							>
								<I18nText path="rare" />
							</button>
							<button
								className={`btn relic ${activeCategories.includes("relic") ? "active" : ""
									}`}
								onClick={() => handleCategoryClick("relic")}
							>
								<I18nText path="relic" />
							</button>
						</div>
					</header>
					{/* products */}
					<div className="products">
						{filteredProducts?.map((product) => (
							<div key={product.id} className="product">
								<ImageLoader
									src={`/res/skins${product.cosmetic.link}`}
									alt={product.title}
								/>
								<div className="content">
									<p className="title">{product.title}</p>
									<span className="price">
										{product.price}{" "}
										{product.priceCurrency === "usual" ? (
											<IconCoin />
										) : product.priceCurrency === "premium" ? (
											<IconCoinDUR />
										) : (
											"$"
										)}
									</span>
									<button
										className="buy_btn"
										onClick={() =>
											handleBuy({
												value: product.price,
												currency: product.priceCurrency,
												id: product.id,
											})
										}
									>
										<I18nText path="buy" />
									</button>
								</div>
							</div>
						))}
					</div>
					{/* BModal component usage */}
					<PModal
						isActive={modalState.isActive}
						type={modalState.type}
						closeModal={closeModal}
						succesText={modalState.succesText}
					/>

					{/* nav */}
				</div>
			</section>
			<NavBar />
		</>
	);
};

export default Market;
