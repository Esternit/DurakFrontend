import React from 'react'
// import { Plus, ArrowUpRight } from "react-bootstrap-icons";
// css

// icons
import IconPlusB from './icons/plusB'
import IconArrowFb from './icons/arrowFb'
import IconTraficB from './icons/traficB'
import { I18nText } from './i18nText'
// Array of user data

const TransactionHistory = () => {
	return (
		<div className="transaction_history">
			<h2>
				<I18nText path="transaction_history" />:
			</h2>
			<div className="row_container">
				{/* <div className="row">
					<span className="date">13.08.24 - 14:31</span>
					<div className="vall">
						<IconPlusB />
						100 DUR (6-TON)
					</div>
				</div> */}
				<div style={{
					textAlign: 'center',
					padding: '20px 10px',
					backgroundColor: ' #114865',
					borderRadius: 10
				}}>Здесь появится ваша история операций</div>
			</div>
		</div>
	)
}

export default TransactionHistory
