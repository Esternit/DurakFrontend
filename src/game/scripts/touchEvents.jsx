//
// display touch events
import { gsap } from "gsap";
import { animateMoveTo, animateVibrateCard } from "../utils/animationUtils";
import localStorageUtils from "../utils/localStorageUtils";
import G from "../utils/mathUtils";
//
export const touchEvents = (playersSelfCards, cardsDisabled) => {
  let newTableCards = [];
  let activeCard = null;
  const cardStates = new Map(); // Хранит состояние каждой карты
  // Функция для получения полного состояния карты
  function getCardState(card) {
    return {
      scale: gsap.getProperty(card, "scale"),
      x: gsap.getProperty(card, "x"),
      y: gsap.getProperty(card, "y"),
      opacity: gsap.getProperty(card, "opacity"),
      rotate: gsap.getProperty(card, "rotate"),
      rotateY: gsap.getProperty(card, "rotateY"),
    };
  }

  // Функция для применения сохраненного состояния карты
  function applyCardState(card, state) {
    gsap.to(card, {
      scale: state.scale,
      x: state.x,
      y: state.y,
      opacity: state.opacity,
      rotate: state.rotate,
      rotateY: state.rotateY,
      duration: 0.3,
    });
  }

  function defaultSelfCards() {
    document.querySelectorAll(".self_card").forEach((card) => {
      card.classList.remove("b-card");
    });
  }
  function deactiveSelfCards() {
    let aCard = document.querySelector(".game .active-card");
    if (aCard) {
      let aW = aCard.getBoundingClientRect.width;
      gsap.to(aCard, { y: `+=${aW / 2}`, rotate: `-=${8}`, duration: 0.3 });
      cardDeactive(aCard);
    }
    document.querySelectorAll(".self_card").forEach((card) => {
      card.classList.add("b-card");
    });
  }
  function cardActive(card) {
    card.classList.add("active-card");
  }
  function cardDeactive(card) {
    card.classList.remove("active-card");
  }
  // event
  document.addEventListener("click", handleClick);

  // handle
  function handleClick(e) {
    const target = e.target;
    // self cards touch events
    if (!cardsDisabled) {
      if (target.classList.contains("self_card")) {
        // Если нажимают на уже активную карту, вернуть ее в исходное положение
        if (activeCard && activeCard === target) {
          applyCardState(activeCard, cardStates.get(activeCard));
          cardDeactive(activeCard);
          activeCard.classList.remove("b-card");
          activeCard = null;
          document.querySelectorAll(".self_card").forEach((card) => {
            if (card !== target) {
              card.classList.remove("b-card");
            }
          });
          return;
        }

        // Если уже есть другая активная карта, возвращаем её в исходное положение
        if (activeCard) {
          applyCardState(activeCard, cardStates.get(activeCard));
          activeCard.classList.remove("b-card");
          cardDeactive(activeCard);
        }

        // Сохраняем состояние текущей карты
        cardStates.set(target, getCardState(target));

        // Поднимаем текущую карту на 20px
        let tW = G.getWidth(target) / 2;
        gsap.to(target, { y: `-=${tW}`, rotate: `+=${8}`, duration: 0.3 });

        // Устанавливаем новую активную карту
        activeCard = target;
        activeCard.classList.remove("b-card");
        cardActive(activeCard);

        // Добавляем класс .b-card всем остальным картам
        document.querySelectorAll(".self_card").forEach((card) => {
          if (card !== activeCard) {
            card.classList.add("b-card");
          }
        });
      }
      //
      // change card touch events
      //
      if (target.classList.contains("change_card") && activeCard) {
        let cardsScale = 1;
        let cCard = target;
        let firstCard =
          newTableCards.length == 0 || newTableCards == 1 ? true : false;
        // verifying card types
        console.log(newTableCards[0]?.dataset.type, activeCard.dataset.type);

        if (
          !newTableCards[0] ||
          newTableCards[0].dataset.value == activeCard.dataset.value
        ) {
          activeCard.classList.remove("self_card");
          cardDeactive(activeCard);
          activeCard.classList.add("table_card");
          newTableCards.push(activeCard);
          let rect = cCard.getBoundingClientRect();

          let commonY = rect.y; // Установите общую Y координату для всех карт.
          let newPosCard = {
            x: firstCard ? rect.x - rect.width + 5 : rect.x,
            y: commonY,
          };
          let newPosChangeCard = {
            x: firstCard ? rect.x + 10 : rect.x + rect.width + 5,
            y: commonY,
          };
          if (newTableCards.length >= 3) {
            setTimeout(() => {
              let el2 = null;
              for (let i = 0; i < newTableCards.length; i++) {
                const el = newTableCards[i];
                if (i == 1) {
                  el2 = el.getBoundingClientRect();
                }
                let elRect = el.getBoundingClientRect();
                let elY = elRect.y - elRect.height - 10;
                animateMoveTo(el, null, elY, 1, 0.5, 0);
              }
              if (el2) {
                animateMoveTo(
                  cCard,
                  el2.x - 5,
                  null,
                  cardsScale,
                  0.3,
                  0.1,
                  false
                );
              }
            }, 500);
          }
          animateMoveTo(
            activeCard,
            newPosCard.x,
            newPosCard.y,
            cardsScale,
            0.3,
            0.1
            // false
          );
          animateMoveTo(
            cCard,
            newPosChangeCard.x,
            newPosChangeCard.y,
            cardsScale,
            0.3,
            0.1,
            false
          );
        } else {
          animateVibrateCard(activeCard);
          applyCardState(activeCard, cardStates.get(activeCard));
          defaultSelfCards();
        }
        // for (let i = 0; i < newTableCards.length; i++) {
        //   const el = newTableCards[i];

        // }

        // last ev
        activeCard = null;
      }
    } else {
      deactiveSelfCards();
    }
  }

  return () => {
    document.removeEventListener("click", handleClick);
  };
};
