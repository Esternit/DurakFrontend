import React, { useEffect, useState } from "react";

function Player ({
	player, imgAvatar, emoji, attakerPlayer, index, topIndex, sizePlayersArr
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

	if(sizePlayersArr % 2 === 0){
		if(topIndex >= 0){
			topIndex+=1
		}
	}
	if(topIndex < 0){topIndex = Math.abs(topIndex)}

	const userCosmetic = JSON.parse(localStorage.getItem("user_cosmetic") || '');
	const userInfo = JSON.parse(localStorage.getItem("user") || '');
	return (
		<div
			className={"player"}
			id={player.id}
			key={player.id}
			style={sizePlayersArr > 3? { 
				position: "absolute", 
				transform: `translate(0, ${15*topIndex + 5}px)`,
				top: 0,
				left: `${(100/sizePlayersArr * index)}%`,
				maxWidth: `${(100/sizePlayersArr)-1}%`
			}: {transform: `translate(0, ${5}px)`,}}
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
						(player.user.profilePhoto == 'profile/1.png' ? '/res/skins/profile/1.svg' : player.user.profilePhoto)
					}
					
					onLoad={(e: any) => {
						if (e.target.width < 10) {
							e.target.src = player.user.profilePhoto == 'profile/1.png' ? '/res/skins/profile/1.svg' : player.user.profilePhoto
						}
						
					}}
					alt="player_picture"
				/>
				<div 
					style={{
						background: 
						`url(/res/skins${userCosmetic?.find((item) => item.cosmetic?.type === "frame")?.cosmetic?.link}) 0 0/100% 100% no-repeat`
					}} 
					className={`outline ${attakerPlayer ? 'active': ''}`}></div>
				<div className="player_game-level">{player?.user?.level}</div>
			</div>
			<span className="player_name" >{player.username || player.user.username}</span>

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