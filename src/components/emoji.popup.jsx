import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react'

import dragonEmoji from '../media/img/emojis/dragon.png'
import goblinEmoji from '../media/img/emojis/goblin.png'
// import knightEmoji from '../media/img/emojis/knight.png'
import smileEmoji from '../media/img/emojis/smile.png'
import winkEmoji from '../media/img/emojis/wink.png'

const emojis = [
	{ src: dragonEmoji, alt: 'Dragon Emoji' },
	{ src: goblinEmoji, alt: 'Goblin Emoji' },
	// { src: knightEmoji, alt: 'Knight Emoji' },
	{ src: smileEmoji, alt: 'Smile Emoji' },
	{ src: winkEmoji, alt: 'Wink Emoji' },
]

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

const EmojiPopup = ({ onSelectEmoji, show }) => {
	const [isVisible, setIsVisible] = useState(show)

	useEffect(() => {
		if (show) {
			setIsVisible(true)
		} else {
			const timer = setTimeout(() => {
				setIsVisible(false)
			}, 300)
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
