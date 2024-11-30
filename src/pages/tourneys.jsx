import React, { useState, useRef, useEffect } from "react";
//
import "../media/css/page/tourneys.css";
//
import Preloader from "../includes/preloader";
//
import IconCoin2 from "../components/icons/coin2";
import IconCoinDUR from "../components/icons/coinDur";
import IconChevronRightBlack from "../components/icons/chevronRightBlack";
import IconTelegram from "../components/icons/telegram";
import { I18nText } from "../components/i18nText";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import BackBtn from "../BackBtn";

const Tourneys = () => {
	const user = {
		check_gold: 1100,
	};
	const navigate = useNavigate();

	React.useEffect(() => {
		BackBtn("/", navigate);
	});

	const intl = useIntl();
	const tournamentTitle = intl.formatMessage({ id: "welcome_tournament" });
	const tournamentPrizeTitle = intl.formatMessage({ id: "main_prize" });
	const tournamentRequirement = intl.formatMessage({
		id: "requirement_tournament",
	});
	const aug = intl.formatMessage({ id: "aug" });

	const tArr = [
		{
			id: 1,
			title: tournamentTitle,
			date: `23 ${aug} - 16:00`,
			prize: `${tournamentPrizeTitle} - 100`,
			requirement: tournamentRequirement,
			prizeType: 'Coin',
			price: 1000,
		},
		{
			id: 2,
			title: `${tournamentTitle} 2`,
			date: `23 ${aug} - 16:00`,
			prize: `${tournamentPrizeTitle} - 100`,
			prizeType: 'DUR',
			requirement: tournamentRequirement,
			price: 2000,
		},
		{
			id: 3,
			title: `${tournamentTitle} 3`,
			date: `23 ${aug} - 16:00`,
			prize: `${tournamentPrizeTitle} - 100`,
			prizeType: 'Coin',
			requirement: tournamentRequirement,
			price: 1000,
		},
	];

	const [activeModal, setActiveModal] = useState(null);
	const [selectedTourney, setSelectedTourney] = useState(null);
	const modalRef = useRef(null);

	const handleTourneySelect = (tourney) => {
		setSelectedTourney(tourney);
	};

	const handleJoinClick = () => {
		if (selectedTourney) {
			const status =
				selectedTourney.price <= user.check_gold ? "success" : "fail";
			setActiveModal(status);
		}
	};

	const handleCloseModal = () => {
		setActiveModal(null);
		setSelectedTourney(null);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				handleCloseModal();
			}
		};

		if (activeModal) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeModal]);

	return (
		<section className="page tourneys">
			<Preloader />
			<div className="container">
				{/* check */}
				<div className="check">
					<div className="vall coin">
						<IconCoin2 />
						<span className="value">{user.check_gold}</span>
					</div>
					<div className="vall dur">
						<IconCoinDUR />
						<span className="value">0.00 DUR</span>
					</div>
				</div>
				{/* content */}
				<div className="page_title">
					<h1 className="title">
						<I18nText path="torneys" />
					</h1>
					<span>
						<I18nText path="torneys_desc" />
					</span>
				</div>
				<div className="tourney__warn">
					<I18nText path="torneys__warn" />
				</div>
				{/* list */}
				<div className="list">
					{tArr.map((tourney) => (
						<button
							key={tourney.id}
							className={`tourney t${tourney.id}`}
							onClick={() => handleTourneySelect(tourney)}
						>
							<p className="title">{tourney.title}</p>
							<div className="content">
								<span className="date">{tourney.date}</span>
								<span className="prize">{tourney.prize}{tourney.prizeType == 'DUR' ? <IconCoinDUR /> : <IconCoin2 />}</span>
								<button className="submit_btn" onClick={handleJoinClick}>{tourney.price}<IconCoin2 /></button>
							</div>
						</button>
					))}
				</div>

			</div>
			{/* modals */}
			{activeModal && (
				<div className="modal modal_active">
					<div className={`window ${activeModal}`} ref={modalRef}>
						<IconTelegram />
						<h1>
							{activeModal === "success"
								? "Congratulations!"
								: "Sorry you can't join"}
						</h1>
						<span>
							{activeModal === "success"
								? "You registered for the tourney"
								: "Insufficient balance"}
						</span>
						<button className="close_btn" onClick={handleCloseModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				</div>
			)}
		</section>
	);
};

export default Tourneys;
