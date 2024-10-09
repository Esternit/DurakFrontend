//
// display touch events
import { gsap } from "gsap";
import { animateMoveTo, animateVibrateCard } from "../utils/animationUtils";
import G from "../utils/mathUtils";
import { openCard } from "../utils/cardUtils";
import { Cone } from "react-bootstrap-icons";
import axios from "axios";
import config from "../../config";
import ShowPopup from "../../ShowPopup";

function debounce(func, delay) {
  let timeoutId;

  return function executedFunction(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

//
export const touchEvents = (
  playersSelfCards,
  cardsDisabled,
  setMadeMove,
  timerActive
) => {
  let tempic = document.querySelectorAll(".table_card");
  let newTableCards = [];
  for (let i = 0; i < tempic.length; i++) {
    if (
      !tempic[i].classList.contains("enemy_defend_card") &&
      !tempic[i].classList.contains("enemy_attacked_card")
    ) {
      newTableCards.push(tempic[i]);
    }
  }
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
      gsap.to(aCard, { y: `+=${aW / 2}`, rotate: `-=${8}`, duration: 0 });
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
  document.addEventListener("click", debounce(handleClick, 150));

  // handle
  function handleClick(e) {
    const target = e.target;
    // self cards touch events
    if (!cardsDisabled) {
      if (target.classList.contains("self_card")) {
        // Если нажимают на уже активную карту, вернуть ее в исходное положение
        if (activeCard && activeCard === target) {
          if (!target.classList.contains("enemy_card"))
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
          if (!target.classList.contains("enemy_card"))
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

        let convertedType;
        if (activeCard.dataset.type == "d") {
          convertedType = "Diamonds";
        } else if (activeCard.dataset.type == "h") {
          convertedType = "Hearts";
        } else if (activeCard.dataset.type == "s") {
          convertedType = "Spades";
        } else if (activeCard.dataset.type == "c") {
          convertedType = "Clubs";
        }

        const gameType = JSON.parse(localStorage.getItem("game_status"))?.type;
        let typeMove = "attack";
        
        if (gameType === "PODKIDNOY") {
          if (newTableCards?.length > 0 && newTableCards?.find((card) => card?.dataset?.value === activeCard?.dataset?.value)) {
            typeMove = "addCard";
          }
        }

        if (gameType === "PEREVODNOY") {
          if (newTableCards?.length > 0 && newTableCards?.every((card) => card?.dataset?.value === activeCard?.dataset?.value)) {
            typeMove = "transfer";
          }
        }

        axios
          .post(
            config.url + "/game/play",
            {
              attackCard: {
                name: convertedType,
                nominal: parseInt(activeCard.dataset.value, 10),
              },
              defendCard: {
                name: "Hearts",
                nominal: 10,
              },
              type: typeMove,
              gameId: JSON.parse(localStorage.getItem("game_status")).gameId,
            },
            {
              headers: {
                "Access-Control-Expose-Headers": "X-Session",
                "X-Session": localStorage.getItem("session_key"),
              },
            }
          )
          .then((res) => {
            localStorage.setItem("session_key", res.headers.get("X-Session"));

            localStorage.setItem("game_status", JSON.stringify(res.data));
            activeCard.classList.remove("self_card");
            cardDeactive(activeCard);
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
            if (newTableCards.length % 3 === 0) {
              setTimeout(() => {
                let el2 = null;
                let fullTable = [];
                let tableCards = document.querySelectorAll(".table_card");
                for (let i = 0; i < tableCards.length; i++) {
                  fullTable.push(tableCards[i]);
                }
                for (let i = 0; i < fullTable.length; i++) {
                  const el = fullTable[i];
                  if (i == 2) {
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

                animateMoveTo(
                  document.querySelector(".change_card"),
                  document.documentElement.clientWidth / 2 -
                    Math.min(
                      20,
                      document.documentElement.clientWidth * 0.05,
                      40
                    ),
                  document.documentElement.clientHeight / 2 - 60,
                  1,
                  0.6,
                  0,
                  false
                );
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
            activeCard = null;
          })
          .catch((err) => {
            if (err.status === 400) {
              localStorage.setItem(
                "session_key",
                err.response.headers.get("X-Session")
              );
            }
            animateVibrateCard(activeCard);
            applyCardState(activeCard, cardStates.get(activeCard));
            defaultSelfCards();
          });
        }
        
        // last ev
      }
      if (target.classList.contains("table_card")) {
        let cardsScale = 1;
        let cCard = target;

        let firstCard =
          newTableCards.length == 0 || newTableCards == 1 ? true : false;
        let gameStatus = JSON.parse(localStorage.getItem("game_status"));
        let playerMas = gameStatus.players;
        let des = 0;
        for (let i = 0; i < playerMas.length; i++) {
          if (playerMas[i].id == JSON.parse(localStorage.getItem("user")).id) {
            des = i;
            break;
          }
        }
        if (
          des ===
          (gameStatus.attackerIndex + 1) % gameStatus.players.length
        ) {
          let convertedType;
          if (activeCard.dataset.type == "d") {
            convertedType = "Diamonds";
          } else if (activeCard.dataset.type == "h") {
            convertedType = "Hearts";
          } else if (activeCard.dataset.type == "s") {
            convertedType = "Spades";
          } else if (activeCard.dataset.type == "c") {
            convertedType = "Clubs";
          }
          let convertedTypeTarget;
          if (cCard.dataset.type == "d") {
            convertedTypeTarget = "Diamonds";
          }
          if (cCard.dataset.type == "h") {
            convertedTypeTarget = "Hearts";
          }
          if (cCard.dataset.type == "s") {
            convertedTypeTarget = "Spades";
          }
          if (cCard.dataset.type == "c") {
            convertedTypeTarget = "Clubs";
          }
          let moveType = "defend";

          axios
            .post(
              config.url + "/game/play",
              {
                defendCard: {
                  name: convertedType,
                  nominal: parseInt(activeCard.dataset.value, 10),
                },
                attackCard: {
                  name: convertedTypeTarget,
                  nominal: parseInt(cCard.dataset.value, 10),
                },
                type: moveType,
                gameId: JSON.parse(localStorage.getItem("game_status")).gameId,
              },
              {
                headers: {
                  "Access-Control-Expose-Headers": "X-Session",
                  "X-Session": localStorage.getItem("session_key"),
                },
              }
            )
            .then((res) => {
              localStorage.setItem("session_key", res.headers.get("X-Session"));

              localStorage.setItem("game_status", JSON.stringify(res.data));
              activeCard.classList.remove("self_card");
              cardDeactive(activeCard);
              activeCard.classList.add("table_card");
              activeCard.style.zIndex = cCard.style.zIndex + 1;
              newTableCards.push(activeCard);
              let rect = cCard.getBoundingClientRect();

              let commonY = rect.y; // Установите общую Y координату для всех карт.
              let newPosCard = {
                x: firstCard ? rect.x : rect.x,
                y: commonY - rect.height / 5,
                z: rect.z + 1,
              };
              let newPosChangeCard = {
                x: firstCard ? rect.x + 10 : rect.x + rect.width + 5,
                y: commonY,
              };
              // if (newTableCards.length >= 3) {
              //   setTimeout(() => {
              //     let el2 = null;
              //     let fullTable = [];
              //     let tableCards = document.querySelectorAll(".table_card");
              //     for (let i = 0; i < tableCards.length; i++) {
              //       fullTable.push(tableCards[i]);
              //     }
              //     for (let i = 0; i < fullTable.length; i++) {
              //       const el = fullTable[i];
              //       if (i == 1) {
              //         el2 = el.getBoundingClientRect();
              //       }
              //       let elRect = el.getBoundingClientRect();
              //       let elY = elRect.y + elRect.height + 5;
              //       animateMoveTo(el, null, elY, 1, 0.5, 0);
              //     }
              //     if (el2) {
              //       animateMoveTo(
              //         cCard,
              //         el2.x - 5,
              //         null,
              //         cardsScale,
              //         0.3,
              //         0.1,
              //         false
              //       );
              //     }
              //   }, 500);
              // }
              animateMoveTo(
                activeCard,
                newPosCard.x,
                newPosCard.y,
                cardsScale,
                0.3,
                0.1
                // false
              );
              // animateMoveTo(
              //   cCard,
              //   newPosChangeCard.x,
              //   newPosChangeCard.y,
              //   cardsScale,
              //   0.3,
              //   0.1,
              //   false
              // );
              activeCard = null;
            })
            .catch((err) => {
              if (err.status === 400) {
                localStorage.setItem(
                  "session_key",
                  err.response.headers.get("X-Session")
                );
              }
              animateVibrateCard(activeCard);
              applyCardState(activeCard, cardStates.get(activeCard));
              defaultSelfCards();
            });
        }
      }
  }

  return () => {
    document.removeEventListener("click", handleClick);
  };
};
