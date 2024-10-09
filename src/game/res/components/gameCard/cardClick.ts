import sendWalking from "../../../responce/sendWalking.ts"
import { animateVibrateCard, animateMoveTo } from "../../../utils/animationUtils"

type TlastCardActive = {name:string,value: string,ref:React.MutableRefObject<HTMLElement> | null}
let lastCardActive:TlastCardActive = { 
	name: '', value: '', ref: null,
}

function cardClick(e, name, value, refCard) {
	if (e.target.dataset.side == 'back' && e.target.dataset.inTable != 'true') {
		
		if (refCard.current && refCard.current.dataset.trump != 'true') {
			if (lastCardActive['name'] == name && lastCardActive['value'] == value) {
				const gameId = JSON.parse(localStorage.getItem('game_status') || '').gameId

				sendWalking(gameId, {name, nominal: value}, {}, 'attack').then(res=>{
					const changeCart =  document.getElementById('change_cart')
					if(changeCart){
						animateMoveTo(
							refCard.current,
							changeCart
						)
					}
				}).catch(err=>{
					err.status == 400 && animateVibrateCard(refCard.current)
				})
			} else {
				const lastRef = lastCardActive['ref']
				if (lastRef && lastRef.current) { 
					lastRef.current.classList.remove('active')
				}

				refCard.current.classList.add('active')
				lastCardActive = { name, value, ref: refCard }
			}
		}
	}

	if(e.target.dataset.side == 'onTable'){
		const gameId = JSON.parse(localStorage.getItem('game_status') || '').gameId

		const attack = {name: lastCardActive.name, nominal: lastCardActive.value}
		const defend = {name, nominal: value}

		sendWalking(gameId, defend, attack, 'defend').catch(err=>{
			const lastRef = lastCardActive.ref
			if(lastRef){
				err.status == 400 && animateVibrateCard(lastRef.current)
			}
		})
	}
}

export default cardClick