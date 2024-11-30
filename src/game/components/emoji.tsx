import React, { useCallback, useEffect, useState } from "react";
import EmojiPopup from '../../components/emoji.popup'
import axios from "axios";
import config from "../../config";
import ShowPopup from '../../ShowPopup'

let selectedEmojiCheck = null
const Emoji = React.memo(({showEmojiPopup, setShowEmojiPopup}: {showEmojiPopup, setShowEmojiPopup})=>{
	const [selectedEmoji, setSelectedEmoji] = useState(null);
	const [selectedEmojiClass, setSelectedEmojiClass] = useState("");

	useEffect(()=>{selectedEmojiCheck = selectedEmoji}, [selectedEmoji])
	const selectEmoji = useCallback(async (emoji) => {
		if(selectedEmojiCheck == null){
			setSelectedEmoji(emoji);
			setShowEmojiPopup(false);
			setSelectedEmojiClass("show");
			const gameStatus = JSON.parse(localStorage.getItem("game_status") || '');
		
			try {
				await axios
					.post(config.url + "/game/emoji",
					{
						gameId: gameStatus.gameId,
						path: emoji,
					},
					{
						headers: {
						"Access-Control-Expose-Headers": "X-Session",
						"X-Session": localStorage.getItem("session_key"),
						},
					}).then((res: any) => {
						localStorage.setItem("session_key", res.headers.get("X-Session"));
					});
			} catch (e) {
				ShowPopup(e.response.data, "Error");
			}
			
			const hideTimeout = setTimeout(() => setSelectedEmojiClass("hide"), 1750);
			const clearTimeoutFn = setTimeout(() => {
				setSelectedEmoji(null);
				setSelectedEmojiClass("");
			}, 2250);
		
			return () => {
				clearTimeout(hideTimeout);
				clearTimeout(clearTimeoutFn);
			};
		}
	}, []);

	return <>
		<EmojiPopup onSelectEmoji={selectEmoji} show={showEmojiPopup} />

		{selectedEmoji && (
			<div className={`selected_emoji ${selectedEmojiClass}`}>
				<img src={selectedEmoji} alt="Selected Emoji" />
			</div>
		)}
	</>
})
export default Emoji