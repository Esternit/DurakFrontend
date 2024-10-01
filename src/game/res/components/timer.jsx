import React, { useState, useEffect, useRef } from "react";

const Timer = ({ duration, onFinish, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);
  const timerId = useRef(null);

  // Функция для старта таймера
  const startTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
    }
    setTimeLeft(duration);
    timerRef.current.classList.add("timer_active");

    timerId.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId.current);
          timerRef.current.classList.remove("timer_active");
          if (onFinish) {
            onFinish(true); // Сообщаем о завершении таймера
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    console.log(isActive);

    if (isActive) {
      startTimer();
    } else {
      clearInterval(timerId.current);
      timerRef.current.classList.remove("timer_active");
    }

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current); // Очистка таймера при размонтировании
      }
    };
  }, [isActive, duration]);

  useEffect(() => {
    if (timerRef.current) {
      timerRef.current.style.setProperty("--timer-dur", `${duration}s`);
    }
  }, [duration]);

  return (
    <div className="timer" ref={timerRef}>
      <span className="time">{timeLeft}</span>
    </div>
  );
};

export default Timer;
