import React, { useEffect, useState } from 'react'
// import { Plus, ArrowUpRight } from "react-bootstrap-icons";
// css

// icons
import IconPlusB from './icons/plusB'
import IconArrowFb from './icons/arrowFb'
import IconTraficB from './icons/traficB'

import { I18nText } from './i18nText'
import axios from 'axios'
import config from '../config'
// Array of user data

const TransactionHistory = () => {
	const [list, setList] = useState([])
	useEffect(() => {
		axios.get(
			config.url + "/users/operations",
			{
				headers: {
					"Access-Control-Expose-Headers": "X-Session",
					"X-Session": localStorage.getItem("session_key"),
				},
			}
		).then(res => { console.log(res); setList(res.data) }).catch(err => console.log(err))
	}, [])

	return (
		<div className="transaction_history">
			<h2>
				<I18nText path="transaction_history" />:
			</h2>
			<div className="row_container">

				{list.length == 0
					?
					<div style={{
						textAlign: 'center',
						padding: '20px 10px',
						backgroundColor: ' #114865',
						borderRadius: 10
					}}><I18nText path="transaction_history_text" /></div>
					:
					list.map(el => <div key={el.id} className="row">
						<span className="date">{el.operationTime}</span>
						<div className="vall">
							{el.type == 'EXCHANGE' ? <IconTraficB /> : el.type == 'FRIEND_GIFT' ? <IconArrowFb /> : <IconPlusB />}
							{`
							${el.amount} 
							${el.currency == "USUAL" || el.type == 'EXCHANGE' ? 'gold' : 'DUR'}
							(${calcTon(el)} TON)`}
						</div>
					</div>)
				}
			</div>
		</div>
	)
}

export default TransactionHistory

function calcTon(el) {
	if (el.currency == 'USUAL' || el.type == 'EXCHANGE') {
		return (+el.amount / 100000).toFixed(2)
	} else {
		return (+el.amount / 100).toFixed(2)
	}
}