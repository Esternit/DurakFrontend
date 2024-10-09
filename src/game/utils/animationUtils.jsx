import { gsap } from "gsap";
// func
import { openCard, cardToSelf } from "./cardUtils";
/**
 * Плавное перемещение элемента в заданную позицию с использованием gsap.
 * @param {HTMLElement} element - Элемент для анимации.
 * @param {number} toX - Конечное значение по оси X.
 * @param {number} toY - Конечное значение по оси Y.
 * @param {number} [toScale=1] - Конечный масштаб (по умолчанию 1).
 * @param {number} duration - Продолжительность анимации.
 * @param {number} delay - Задержка перед началом анимации.
 */

// Анимация перемещения карты
export const animateMoveTo = (
	element,
	parent
) => {
	const parentRect = parent.getBoundingClientRect();
	element.setAttribute('style', `top: ${parentRect.y}px; left: ${parentRect.x}px; transition: 0.3s; transform: none`)
};

// Анимация получения карт игроком
export const animateGetCardsPlayerSelf = (
	elements,
	parent,
	refresh = true,
	comp
) => {
	if (elements.length > 0) {
		const parentRect = parent.getBoundingClientRect();
		elements = elements.filter(el => el != undefined)

		const promises = elements.map((element, index) => {
			if (element) {
				const rect = element.getBoundingClientRect();
				element.classList.remove('rtRender')

				const elementWidth = rect.width;
				const elementHeight = rect.height;
				const offsetX = (parentRect.width / (elements.length + 1)) * index
				const zIndex = elements.length - index;

				const pos = {
					x: parentRect.x + parentRect.width - offsetX - elementWidth / (elements.length > 8 ? 2 : 1.25),
					y: parentRect.y - parentRect.height - elementHeight,
				}

				if (refresh && comp.includes(index)) {
					element.setAttribute('style', '')
					element.classList.remove('Mov')

					setTimeout(() => {
						element.classList.add('Mov')
						element.setAttribute('style', `
							top: ${pos.y}px; 
							left: ${pos.x}px; 
							z-index: ${zIndex}; 
							transition: 0.3s;
						`)
					}, 300)
				} else {
					element.classList.add('Mov')
					element.setAttribute('style', `top: ${pos.y}px; left: ${pos.x}px; z-index: ${zIndex}`)
				}
				element.dataset.trump = false

				openCard(element)
			} else {
				return Promise.resolve(); // Если элемент не существует, сразу разрешаем промис
			}
		});

		return Promise.all(promises); // Возвращаем промис, который разрешится, когда все анимации завершатся
	} else {
		return Promise.resolve(); // Если нет элементов, сразу разрешаем промис
	}
};

// Анимация показа козырной карты
export const animateShowTrumpCard = (element) => {
	return new Promise((resolve) => {
		if (element) {
			const rect = element.getBoundingClientRect();
			const currentScale = gsap.getProperty(element, "scale");

			gsap.fromTo(
				element,
				{
					x: rect.x,
					scale: currentScale,
					opacity: 1,
					rotate: 0,
				},
				{
					z: 0,
					x: rect.x + 20,
					opacity: 1,
					rotate: 90,
					duration: 0.3,
					delay: 1,
					ease: "power2.out",
					onComplete: () => {
						resolve();
						openCard(element);
					}, // Разрешаем промис по завершению анимации
				}
			);
		} else {
			resolve(); // Если элемент не существует, сразу разрешаем промис
		}
	});
};

//

// Анимация показа козырной карты с эффектом вибрации
export const animateVibrateCard = (element) => {
	console.log('df')
	const startTagStyle = element.getAttribute('style')
	let parseStyle = startTagStyle.split(';')

	let left = (parseStyle.find(el => el.includes('left')))
	if (left) {
		left = left.split(':')
		left[1] = +left[1].slice(0, -2)
	} else {
		left = ['left', 0]
	}

	const leftPl = [left[0], left[1] + 1 + 'px'].join(':')
	const leftMn = [left[0], left[1] - 1 + 'px'].join(':')

	parseStyle = parseStyle.filter(el => !el.includes('left'))
	const stylePl = [...parseStyle, leftPl].join(';')
	const styleMn = [...parseStyle, leftMn].join(';')

	const intervalPl = setInterval(() => {
		element.setAttribute('style', stylePl)
	}, 10)
	const intervalMn = setInterval(() => {
		element.setAttribute('style', styleMn)
	}, 20)
	setTimeout(() => {
		clearInterval(intervalPl)
		clearInterval(intervalMn)
		element.setAttribute('style', startTagStyle)
	}, 600)
};
