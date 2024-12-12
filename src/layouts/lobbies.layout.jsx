import React, { useEffect, useState } from 'react'
//
import Preloader from '../includes/preloader.jsx'
// import { Outlet } from "react-router-dom";
import IconCoinDUR from '../components/icons/dur.jsx'
import IconCoin from '../components/icons/coin.jsx'
import '../media/css/layout/lobbies.layout.css'
import { I18nText } from '../components/i18nText.jsx'
import axios from 'axios'
import config from '../config.js'

const LobbiesLayout = ({
	children,
}) => {
	const [durValue, setDurValue] = useState(0)
	const [coinValue, setCoinValue] = useState(0)

	useEffect(() => {
		const fn = async () => {
			await axios.get(config.url + "/users/balance", {
				headers: {
					"Access-Control-Expose-Headers": "X-Session",
					"X-Session": localStorage.getItem("session_key"),
				},
			}).then(rez => {
				if (rez.data.premiumBalanceReturnable) {
					setDurValue(rez.data.premiumBalanceReturnable)
				}
				if (rez.data.usualBalance) {
					setCoinValue(rez.data.usualBalance)
				}
			}
			).catch(err => { })


		}
		fn()
	}, [])

	return (
		<section className="page lobbies">
			<Preloader />
			<div className="container">
				{/* check */}
				<div className="check">
					<div className="vall dur">
						<IconCoinDUR />
						<span className="value">{durValue} DUR</span>
					</div>
					<div className="vall dur">
						<IconCoin />
						<span className="value">{coinValue} COIN</span>
					</div>
				</div>

				{/* content */}
				<div className="page_title">
					<h1 className="title">
						<I18nText path="lobbies" />
					</h1>
					<span>
						<I18nText path="lobbies_tagline" />
					</span>
				</div>

				{/* Additional content injected through props.children */}
				{children}
			</div>
		</section>
	)
}

export default LobbiesLayout
