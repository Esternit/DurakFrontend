import React from 'react'
//
import Preloader from '../includes/preloader.jsx'
// import { Outlet } from "react-router-dom";
import IconCoinDUR from '../components/icons/dur.jsx'
import IconCoin from '../components/icons/coin.jsx'
import IconCoinTON from '../components/icons/coinTon'
import '../media/css/layout/lobbies.layout.css'
import { I18nText } from '../components/i18nText.jsx'

const LobbiesLayout = ({
	tonValue = '0.00',
	coinValue = '0.00',
	durValue = '0.00',
	children,
}) => {
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
