let lastAttCards: any = []
export function genAttackerCards(cards){
	let newCards: any[] = []
	lastAttCards.forEach((el)=>{
		const cr = cards.findIndex(nC=>nC.name == el.name && nC.nominal == el.nominal)
		if(cr != -1){
			newCards.push(el)
			cards = cards.filter((e, i)=> i!=cr)
		}
	})
	newCards = [...newCards, ...cards]
	lastAttCards = [...newCards]
	return newCards
}

export function genEnemyCards(cards, cardsAtt){
	const comparison: any = []
	cards.forEach((el, i)=>{
		if(el!=null){
			comparison.push({...el, index: i})
		}
	})
	const attCompl = genAttackerCards(cardsAtt)
	comparison.forEach(el=>{
		const attCardStart = cardsAtt[el.index]
		const newIndex = attCompl.findIndex(a=>a.name == attCardStart.name && a.nominal == attCardStart.nominal)
		el.index = newIndex
	})
	return comparison
}

let lastEnemy: any = []; let lastPlayers: any = []
export function comparisonEnemy(enemy, players): {[key: string]: any} | undefined{
	const noComparsion: any = []

	const userId = JSON.parse(localStorage.getItem('user') || '').id

	let idSendler = '', indexNewCard = null
	if(enemy[0] && players[0]){
		enemy.forEach(el=>{
			const check = lastEnemy.find(ls=>ls.name == el.name && ls.nominal == el.nominal)
			if(!check){
				noComparsion.push(el)
			}
		})
		noComparsion.forEach(el=>{
			lastPlayers.forEach(player=>{
				const check = player.cards.find(card=>card.name == el.name && card.nominal == el.nominal)
				if(check){
					idSendler = player.id
					indexNewCard = el.index
				}
			})
		})
	}
	lastEnemy = enemy
	lastPlayers = players
	
	if(+userId != +idSendler){
		return {idSendler, indexNewCard}
	}
}