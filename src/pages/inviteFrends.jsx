import { useRef } from "react";

const InviteFrends = () => {
	const copyAllertRef = useRef(null)

	return <div className='user_profile' style={{ margin: 0, height: '110vh', justifyContent: 'center' }}>
		<div className="btns" style={{ flexDirection: 'column', display: 'flex', transform: 'translate(0, -50%)' }}>
			<button onClick={() => tgSend()} className="btn_deposit">Поделиться ссылкой в сообщении</button>
			<button onClick={() => copyClickboard(copyAllertRef)} className="btn_deposit">Скопировать</button>
			<button onClick={() => window.location.href = '/profile'} className="btn_deposit">Вернуться на галавную</button>
		</div>

		<div ref={copyAllertRef} className="copyAllert" style={{
			borderRadius: 20,
			padding: 5,
			color: '#565656',
			backgroundColor: '#969696',
			position: 'fixed',
			top: '75%',
			left: '50%',
			width: '15em',
			textAlign: 'center',
			transform: 'translate(-50%, -50%)',
			opacity: 0,
			pointerEvents: 'none',
			transition: '0.3s'
		}}>Ссылка была скопирована</div>
	</div>
}
export default InviteFrends

const inviteUrl = "https://t.me/durakwithton_bot/tonDurak?startapp=";
function tgSend() {
	const id = window.Telegram.WebApp.initDataUnsafe.user.id; window.Telegram.WebApp.openTelegramLink(
		`https://t.me/share/url?url=${inviteUrl}${id}`);
}
function copyClickboard(copyAllertRef) {
	const id = window.Telegram.WebApp.initDataUnsafe.user.id;
	navigator.clipboard.writeText(`${inviteUrl}${id}`);

	copyAllertRef.current.classList.add('active')
	setTimeout(() => {
		copyAllertRef.current.classList.remove('active')
	}, 1500)
}