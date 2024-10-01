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
  toX,
  toY,
  toScale = 1,
  duration,
  delay,
  rotation = true
) => {
  return new Promise((resolve) => {
    if (element) {
      const currentScale = gsap.getProperty(element, "scale");
      const currentX = gsap.getProperty(element, "x");
      const currentY = gsap.getProperty(element, "y");

      const rect = element.getBoundingClientRect();
      gsap.fromTo(
        element,
        {
          x: rect.x,
          y: rect.y,
          scale: currentScale,
          opacity: 1,
          rotate: 0,
        },
        {
          x: toX == null ? currentX : toX,
          y: toY == null ? currentY : toY,
          scale: toScale,
          opacity: 1,
          rotate: rotation ? 360 : 0,
          duration: duration,
          delay: delay,
          ease: "power2.out",
          onComplete: resolve, // Разрешаем промис по завершению анимации
        }
      );
    } else {
      resolve(); // Если элемент не существует, сразу разрешаем промис
    }
  });
};

// Анимация получения карт игроком
export const animateGetCardsPlayerSelf = (
  elements,
  toX,
  toY,
  toScale = 1,
  duration,
  delay = 0
) => {
  if (elements.length > 0) {
    const promises = elements.map((element, index) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementWidth = rect.width;
        const elementHeight = rect.height;
        const offsetX = elementWidth * 0.5 * index;
        const zIndex = elements.length - index;

        return new Promise((resolve) => {
          gsap.fromTo(
            element,
            {
              x: rect.left,
              y: rect.top,
              scale: 1,
              opacity: 1,
              zIndex: zIndex,
              rotate: 0,
              rotateY: 0,
            },
            {
              x: toX - offsetX + (elementWidth * (elements.length / 2)) / 4,
              y: toY - elementHeight / 1.2,
              scale: toScale,
              opacity: 1,
              zIndex: 0,
              rotate: -368,
              rotateY: 360,
              duration: duration,
              delay: delay + index * 0.1,
              ease: "power2.out",
              onStart: () => {
                element.style.zIndex = zIndex;
              },
              onComplete: () => {
                openCard(element);
                cardToSelf(element);
                element.style.zIndex = zIndex;
                resolve(); // Разрешаем промис по завершению анимации
              },
            }
          );
        });
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
  return new Promise((resolve) => {
    if (element) {
      // Запоминаем начальное положение и масштаб
      const initialX = gsap.getProperty(element, "x");
      const initialY = gsap.getProperty(element, "y");
      const initialScale = gsap.getProperty(element, "scale");

      // Этап 1: Показ карты
      gsap.fromTo(
        element,
        {
          scale: initialScale,
          x: initialX, // Начальная позиция для вибрации
          y: initialY, // Начальная позиция для вибрации
        },
        {
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            // Этап 2: Добавление эффекта вибрации без изменения позиции
            gsap.to(element, {
              x: initialX + 5, // Вибрация
              yoyo: true,
              repeat: 10, // Количество повторений для вибрации
              duration: 0.05,
              ease: "sine.inOut",
              onComplete: () => {
                // Возвращаем элемент в исходное положение
                gsap.to(element, {
                  x: initialX,
                  duration: 0.1, // Быстрое возвращение
                  ease: "power1.inOut",
                  onComplete: () => {
                    resolve();
                  },
                });
              },
            });
          },
        }
      );
    } else {
      resolve(); // Если элемент не существует, сразу разрешаем промис
    }
  });
};
