import sendWalking from "../../../responce/sendWalking.ts"
import { animateVibrateCard, animateMoveTo } from "../../../utils/animationUtils"

type TlastCardActive = {name:string,value: string,ref:React.MutableRefObject<HTMLElement> | null}
let lastCardActive:TlastCardActive = { 
	name: '', value: '', ref: null,
}

function cardClick(e, name, value, refCard, game) {
	if (e.target.dataset.side == 'back') {
		if (refCard.current && refCard.current.dataset.trump != 'true') {
			if (lastCardActive['name'] == name && lastCardActive['value'] == value) {
				const gameId = JSON.parse(localStorage.getItem('game_status') || '').gameId

				sendReqVarType(game, gameId, name, value, refCard)
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

	if(e.target.dataset.side == 'onTable' && e.target.dataset.pointer != 'false'){
		const gameId = JSON.parse(localStorage.getItem('game_status') || '').gameId

		const attack = {name: lastCardActive.name, nominal: lastCardActive.value}
		const defend = {name, nominal: value}

		const checkOneCard = lastCardActive.name != undefined && lastCardActive.value != undefined
		if(checkOneCard){
			sendWalking(gameId, defend, attack, 'defend').then(res=>{
				const changeCart =  document.getElementById('change_cart')
				const cardAnim = [...document.querySelectorAll('[data-nominal]')].map((el:any)=>{
					if(+el.dataset.nominal == +lastCardActive.value && el.dataset.name == lastCardActive.name){return el}
				}).filter(el=>el!=undefined)[0]
	
				if(changeCart && cardAnim){
					animateMoveTo(
						cardAnim,
						changeCart,
						+refCard.current.dataset.indexInTable,
						'enemy'
					)
				}
			}).catch(err=>{
				console.log(game)
				console.log(err)
				const lastRef = lastCardActive.ref
				if(lastRef){
					err.status == 400 && animateVibrateCard(lastRef.current)
				}
			})
		}
	}
}

export default cardClick

function sendReqVarType(game, gameId, name, value, refCard){
	let attack: any = {name, nominal: value}
	let defend: any = {}
	let typeReq = 'attack'

	

	sendWalking(gameId, attack, defend, typeReq).then(res=>{
		const changeCart =  document.getElementById('change_cart')
		if(changeCart){
			animateMoveTo(
				refCard.current,
				changeCart,
				res.data.attackerCards.length-1,
				'change'
			)
		}
	}).catch(err=>{
		console.log(err)
		err.status == 400 && animateVibrateCard(refCard.current)
	})
}