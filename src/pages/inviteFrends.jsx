const InviteFrends = () => {
	return <div className='user_profile' style={{ margin: 0, height: '110vh', justifyContent: 'center' }}>
		<div className="btns" style={{ flexDirection: 'column', display: 'flex', transform: 'translate(0, -50%)' }}>
			<button onClick={() => tgSend()} className="btn_deposit">Поделиться ссылкой в сообщении</button>
			<button onClick={() => copyClickboard()} className="btn_deposit">Скопировать</button>
			<button onClick={() => window.location.href = '/profile'} className="btn_deposit">Вернуться на галавную</button>
		</div>
	</div>
}
export default InviteFrends

const inviteUrl = "https://t.me/durakwithton_bot/tonDurak?startapp=";
function tgSend() {
	const id = window.Telegram.WebApp.initDataUnsafe.user.id; window.Telegram.WebApp.openTelegramLink(
		`https://t.me/share/url?url=${inviteUrl}${id}`);
}
function copyClickboard() {
	const id = window.Telegram.WebApp.initDataUnsafe.user.id;
	navigator.clipboard.writeText(`${inviteUrl}${id}`);
}