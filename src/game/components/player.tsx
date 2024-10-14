import React, { useEffect } from "react";

function Player ({
	player, selectedEmoji, selectedEmojiClass, imgAvatar, emoji, setSelectedEmoji, setSelectedEmojiClass, attakerPlayer
}){
	useEffect(()=>{
		if(emoji && player.id == emoji.user.id){
			setSelectedEmoji(emoji?.emoji)
			setSelectedEmojiClass("active");
			
			setTimeout(()=>{setSelectedEmojiClass("");}, 2000)
			setTimeout(() => {setSelectedEmoji(null);}, 2250);
		}
	}, [emoji])

	let topPosition = "0px";

	return (
		<div
			className={"player"}
			id={player.id}
			key={player.id}
			style={{ position: "relative", marginTop: topPosition }}
		>
			<div className="picture">
				<img
					className="profile"
					src={player.avatar || imgAvatar}
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