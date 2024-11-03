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
			} else if(e.target.dataset.side != 'onTable') {
				const lastRef = lastCardActive['ref']
				if (lastRef && lastRef.current) { 
					setActiveCard(lastRef.current, 'off')
				}
				
				if(refCard.current){
					setActiveCard(refCard.current, 'on')
				}
				
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
			const timerTick = document.getElementById('timerTick')
			const enemyCheck = refCard.current.dataset.enemy != 'enemy'
			const beatenCheck = refCard.current.dataset.changeLock != 'True'

			if(timerTick && +timerTick.innerHTML > 2 && enemyCheck && beatenCheck){
				sendWalking(gameId, defend, attack, 'defend').then(res=>{
					const changeCart =  document.getElementById('change_cart')
					const cardAnim = [...document.querySelectorAll('[data-nominal]')].map((el:any)=>{
						if(+el.dataset.nominal == +lastCardActive.value && el.dataset.name == lastCardActive.name){return el}
					}).filter(el=>el!=undefined)[0]
		
					refCard.current.dataset.changeLock = 'True'
					if(changeCart && cardAnim){
						animateMoveTo(
							cardAnim,
							changeCart,
							+refCard.current.dataset.indexInTable,
							'enemy'
						)
					}
				}).catch(err=>{
					const lastRef = lastCardActive.ref
					if(lastRef){
						err.status == 400 && animateVibrateCard(lastRef.current)
					}
				})	
			}

			if(game.type == 'SHULLERS' ){
				sendWalking(gameId, {name, nominal: value} ,{},'shulling')
				.then(res=>console.log(res))
				.catch(err=>console.log(err))
			}
		}
	}
}

export default cardClick

function sendReqVarType(game, gameId, name, value, refCard){
	let attack: any = {name, nominal: value}
	let defend: any = {}
	let typeReq = 'attack'

	if(game.type == "PODKIDNOY"){
		const userId = JSON.parse(localStorage.getItem('user') || '').id
		const userIndex = game?.players.findIndex(el=> el.id == userId)

		if(game.attackerIndex != userIndex){
			attack = {name, nominal: value}
			defend = {}
			typeReq = 'addCard'
		}
	}
	if(game.type == "PEREVODNOY"){
		const userId = JSON.parse(localStorage.getItem('user') || '').id
		const userIndex = game?.players.findIndex(el=> el.id == userId)

		if(game.attackerIndex != userIndex){
			const attackMapCard = game.attackerCards.map(el=>value == el.nominal ? el : null).filter(el=>el!=null)[0] || {}
			attack = {name: attackMapCard.name, nominal: attackMapCard.nominal}
			defend = {name, nominal: value}
			typeReq = 'transfer'
		}
	}
	
	const timerTick = document.getElementById('timerTick')
	if(timerTick && +timerTick.innerHTML > 2){
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
			err.status == 400 && animateVibrateCard(refCard.current)
		})
	}
}

function setActiveCard(element, type){
	const style = element.getAttribute('style')
	const splitStr = style.split(';')
	const transformElIndex = splitStr.findIndex(el=>el.includes('transform'))
	
	let check = true
	if(type == 'on'){
		check = true
		element.classList.add('active')
	}
	if(type == 'off'){
		check = false
		element.classList.remove('active')
	}
	
	const setStr = '-20px + '
	const splCalc = splitStr[transformElIndex].split('calc(')

	if(check){
		if(!splCalc[2]?.includes(setStr)){
			splCalc[2] = setStr + splCalc[2]
		}
		const joinCalc = splCalc.join('calc(')
		splitStr[transformElIndex] = joinCalc
		splitStr[splitStr.length] = 'transition: 0.3s; '
	}else{
		if(splCalc[2]?.includes(setStr)){
			splCalc[2] = splCalc[2].split(setStr)[1]
			const joinCalc = splCalc.join('calc(')
			splitStr[transformElIndex] = joinCalc
			splitStr[splitStr.length-1] = ' '
		}
	}
	const newStyle = splitStr.join(';')
	element.setAttribute('style', newStyle)
}