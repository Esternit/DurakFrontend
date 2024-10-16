import * as React from 'react'

// css
import '../media/css/component/card.play.quick.css'
// img
import ImgCards from '../media/img/menu/quickGame.png'
import { useNavigate } from 'react-router-dom'
import { I18nText } from './i18nText'
import connectQuickGame from '../api/connectQuickGame'

const CardPlayQuick = () => {
  const navigate = useNavigate()
  
  const linkQuickGame = async () => {
    try {
      const connectInfo = await connectQuickGame();
      
      localStorage.setItem("game_status", JSON.stringify(connectInfo));
      navigate(`/game?type=quick`);
    } catch (err) {
      localStorage.setItem(
        "session_key",
        err.response.headers.get("X-Session")
      );
      return null;
    }
  };

  return (
    <button
      className="card_play_custom anim_sjump"
      onClick={linkQuickGame}
    >
      <div className="texts">
        <h1 className="title">
          <I18nText path="quick_game_title" />
        </h1>
        <p>
          <I18nText path="quick_game_play" />
        </p>
      </div>
      <img
        className="cardImg"
        src={ImgCards}
        alt="icon"
      />
    </button>
  )
}
export default CardPlayQuick
