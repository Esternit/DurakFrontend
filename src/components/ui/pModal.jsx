import React, { useRef, useEffect } from "react";
// css
import "../../media/css/ui/pModal.css";
// Assume pSucces and pFail are imported images
import pSucces from "../../media/img/profile/pSucces.png";
import pFail from "../../media/img/icons/coinGold.png";
import pSkill from "../../media/img/icons/pSkill.png";
import pTg from "../../media/img/icons/tg.png";
import { I18nText } from "../i18nText";
import IconCoin from "../icons/coin";
import IconDUR from "../icons/dur";

const PModal = ({
	isActive,
	type,
	closeModal,
	succesText,
	coinCount,
	skillText,
	skillPrice,
	buttonOnClick,
}) => {
	const modalRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				closeModal();
			}
		};

		if (isActive) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isActive, closeModal]);

	if (!isActive) return null;

	return (
		<div className="p_verify_modal modal_active">
			<div ref={modalRef}>
				{type === "success" ? (
					<div className="modal success active">
						<img src={pSucces} alt="Success" />
						<h1>
							<I18nText path="congratulations" />
						</h1>
						<h2>{succesText}</h2>
						<button className="close_btn" onClick={closeModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				) : type === "collect" ? (
					<div className="modal success active">
						<img src={pSucces} alt="Collect" />
						<h1>
							<I18nText path="congratulations" />
						</h1>
						<h2 className="coin_count">
							+{coinCount} <IconCoin />
						</h2>
						<button className="close_btn" onClick={closeModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				) : type === "skill" ? (
					<div className="modal success active">
						<img src={pSkill} alt="Skill" />
						<h1>{skillText}</h1>
						<button onClick={buttonOnClick} className="buy_button">
							<I18nText path="buy_for" /> {skillPrice} <IconCoin />
						</button>
						<button className="close_btn" onClick={closeModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				) : type == 'task' ? (
					<div className="modal success active">
						<img src={pTg} alt="Task" />
						<h1>{skillText}</h1>
						<div className="modal__info">
							+{skillPrice.price}
							{skillPrice.premium ? <IconDUR /> : <IconCoin />}
						</div>
						<button onClick={buttonOnClick} className="buy_button">
							{succesText}
						</button>
						<button className="close_btn" onClick={closeModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				) : type == 'taskComplete' ? (
					<div className="modal success active">
						<img src={pTg} alt="Task" />
						<h1>{skillText}</h1>
						<div className="modal__info">
							+{skillPrice.price}
							{skillPrice.premium ? <IconDUR /> : <IconCoin />}
						</div>
						<button className="close_btn" onClick={closeModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				) : type == 'taskNotComplete' ? (
					<div className="modal success active">
						<img src={pTg} alt="Task" />
						<h1>{skillText}</h1>

						{skillPrice.price}

						<button className="close_btn" onClick={closeModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				) : (
					<div className="modal fail active">
						<img src={pFail} alt="Fail" />
						<h1>
							<I18nText path="sorry_message" />
						</h1>
						<h2>
							<I18nText path="insufficient_balance" />
						</h2>
						<button className="close_btn" onClick={closeModal}>
							<I18nText path="user_profile_close" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default PModal;
