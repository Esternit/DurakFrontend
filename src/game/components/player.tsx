import React, { useEffect, useState } from "react";

function Player ({
	player,imgAvatar, emoji, attakerPlayer
}){
	const [selectedEmoji, setSelectedEmoji] = useState(null);
	const [selectedEmojiClass, setSelectedEmojiClass] = useState("");

	useEffect(()=>{
		if(emoji && player.id == emoji.user.id){
			setSelectedEmoji(emoji?.emoji)
			setSelectedEmojiClass("active");
			
			setTimeout(()=>{setSelectedEmojiClass("");}, 2000)
			setTimeout(() => {setSelectedEmoji(null);}, 2250);
		}
	}, [emoji])

	return (
		<div
			className={"player"}
			id={player.id}
			key={player.id}
			style={{ position: "relative" }}
		>	{
				player?.cards.length > 0 ? 
				<div className="player__cards">{player?.cards.length} {numberCardName(player?.cards.length)}</div> : 
				<></>
			}
			<div className="picture">
				<img
					className="profile"
					src={
						`https://t.me/i/userpic/160/${player.user?.tgNickname}.jpg` || 
						imgAvatar
					}
					alt="player_picture"
				/>
				<div className={`outline ${attakerPlayer ? 'active': ''}`}></div>
			</div>
			<span className="player_name">{player.username || player.user.username}</span>

			<div className={`selected_emoji user ${selectedEmojiClass}`}>
				{selectedEmoji && <img src={selectedEmoji || ''} alt="Selected Emoji" />}
			</div>
		</div>
	);
}
export default Player

export function numberCardName(num){
	let text = '';
	if(num > 5 && num < 21){text = 'карт'}else{
		if([1].includes(num % 10)){text = 'карта'}
		if([2,3,4].includes(num % 10)){text = 'карты'}
		if([5,6,7,8,9,0].includes(num % 10)){text = 'карт'}
	}
	return text
}