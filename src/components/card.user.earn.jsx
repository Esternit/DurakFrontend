import React, { useEffect, useState } from "react";
// img
import IconCoin from "../components/icons/coin";
import { I18nText } from "./i18nText";
import availablePassive from "../api/availablePassive";
import ownedPassive from "../api/ownedPassive";
import { useNavigate } from "react-router-dom";

const CardUserEarn = () => {
	const [earnData, setEarnData] = useState();
	const userInfo = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate()

	useEffect(() => {
		async function fetch() {
			const data = await ownedPassive();
			setEarnData(data);
		}

		setTimeout(() => {
			fetch();
		}, 1500);
	}, []);

	return (
		<div onClick={() => {
			navigate('/earn')
		}} className="card_user_earn anim_sjump">
			<h1 style={{ textTransform: "uppercase" }}>
				<I18nText path="earn" />
			</h1>
			{earnData && (
				<div className="progress_bar">
					<div
						className="progress"
						style={{
							width: `${(userInfo.storage / earnData[0].value) * 100}%`,
						}}
					></div>
				</div>
			)}

			<div className="earn_info">
				<div className="earn_check">
					{userInfo.storage}/{earnData ? earnData[0]?.value : 0}
					<IconCoin />
				</div>
				<span className="perhour">
					{earnData ? earnData[1]?.value : 0}/
					<I18nText path="per_hour" />
				</span>
			</div>
		</div>
	);
};
export default CardUserEarn;
