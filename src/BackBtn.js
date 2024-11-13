const BackBtn = (to, navigate) => {
	try{
		const tg = window.Telegram.WebApp;
		const backBtn = tg.BackButton;
		backBtn.show();
		backBtn.onClick(() => {
			navigate(to);
			backBtn.hide();
		});
	}catch(err){
		console.log(err)
	}
};

export default BackBtn;
