import React, { useState, useEffect, useMemo, Suspense } from 'react'


const EmojiButton = React.memo(({ emoji, onClick }) => (
	<button
		className="emoji_button"
		onClick={() => onClick(emoji.src)}
	>
		<Suspense fallback={<div>Loading...</div>}>
			<img
				src={emoji.src}
				alt={emoji.alt}
			/>
		</Suspense>
	</button>
))

const userCosmetic = JSON.parse(localStorage.getItem("user_cosmetic"));
const emojis = []
userCosmetic?.forEach((item) => {
	if (item.cosmetic?.type === "emoji") {
		console.log(item)
		emojis.push({ src: '/res/skins' + item.cosmetic.link })
	}
})

const EmojiPopup = ({ onSelectEmoji, show }) => {
	const [isVisible, setIsVisible] = useState(show)

	useEffect(() => {
		if (show) {
			setIsVisible(true)
		} else {
			const timer = setTimeout(() => {
				setIsVisible(false)
			}, 500)
			return () => clearTimeout(timer)
		}
	}, [show])

	const emojiButtons = useMemo(
		() =>
			emojis.map((emoji, index) => (
				<EmojiButton
					key={index}
					emoji={emoji}
					onClick={onSelectEmoji}
				/>
			)),
		[onSelectEmoji],
	)

	if (!isVisible && !show) return null

	return (
		<div className={`emoji_popup ${show ? 'show' : ''}`}>{emojiButtons}</div>
	)
}

export default EmojiPopup
