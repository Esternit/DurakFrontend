import React from 'react'
import IconPlay from './icons/play'
import IconAlertCircle from './icons/alertCircle'
import IconArrowDegRight from './icons/arrowDegRight'
import IconRefresh from './icons/refresh'
import ProgressBar from './ui/progressBar'
import { XLg } from 'react-bootstrap-icons'
import { I18nText } from './i18nText'

const players = [2, 3, 4, 5, 6, 7, 8];
const maxPlayersMap = {
	24: 3,
	36: 5,
	52: 8,
	0: 8
}

const FilterWindow = ({ isOpen, onClose, onReset, onApply }) => {
	const [playerAmount, setPlayerAmount] = React.useState(2);
	const [progressPlayers, setProgressPlayers] = React.useState(0);
	const [fieldSize, setFieldSize] = React.useState(0);

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
	return (
		<div className={`filter_window ${isOpen ? 'filter_window_active' : ''}`}>
			<button
				className="close_btn"
				onClick={onClose}
			>
				<XLg fill="#fff5" />
			</button>

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
				<input
					type="radio"
					id="bid1"
					name="bid"
				/>
				<label htmlFor="bid1">DUR</label>
				<input
					type="radio"
					id="bid2"
					name="bid"
				/>
				<label htmlFor="bid2">
					<I18nText path="coins_label" />
				</label>
			</div>

			<p>
				<I18nText path="filter_window_bids_amount" />
			</p>

			<ProgressBar
				values={[0, 1, 10, 100, 500, '1k', '5k', '10k', '50k', '100k']}
			/>

			<p>
				<I18nText path="filter_window_game_type" />
			</p>

			<div className="game_type">
				<div>
					<input
						type="radio"
						id="gt1"
						name="game_type"
					/>
					<label htmlFor="gt1">
						<I18nText path="filter_window_classical" /> <IconArrowDegRight />
					</label>
				</div>
				<div>
					<input
						type="radio"
						id="gt2"
						name="game_type"
					/>
					<label htmlFor="gt2">
						<I18nText path="filter_window_passing" /> <IconRefresh />
					</label>
				</div>
				<div>
					<input
						type="radio"
						id="gt3"
						name="game_type"
					/>
					<label htmlFor="gt3">
						<I18nText path="filter_window_throwing_extra" /> <IconPlay />
					</label>
				</div>
				<div>
					<input
						type="radio"
						id="gt4"
						name="game_type"
					/>
					<label htmlFor="gt4">
						<I18nText path="filter_window_with_schullers" /> <IconAlertCircle />
					</label>
				</div>
			</div>

			<div className="btn_bar">
				<button className="reset">
					<I18nText path="reset_button" />
				</button>
				<button
					className="apply"
					onClick={onClose}
				>
					<I18nText path="apply_button" />
				</button>
			</div>
		</div>
	)
}
export default FilterWindow
