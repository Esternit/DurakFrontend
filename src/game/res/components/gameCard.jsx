import React, { forwardRef } from "react";

const GameCard = forwardRef(({ id, type, name, value, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`game_card ${name}`}
      data-name={name}
      data-type={type}
      data-value={value}
      data-id={id}
      {...props}
    ></span>
  );
});

export default GameCard;
