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