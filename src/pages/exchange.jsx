import React from "react";
//
import Preloader from "../includes/preloader";
// css
import "../media/css/page/exchange.css";
//icons
import IconArrowRight from "../components/icons/arrowRight";
import IconCoin from "../components/icons/coin";
//
import TransactionHistory from "../components/transaction.history";
import { I18nText } from "../components/i18nText";
import { useNavigate } from "react-router-dom";
import BackBtn from "../BackBtn";
import balanceOwned from "../api/balanceOwned";
import IconDUR from "../components/icons/dur";
import buyUsual from "../api/buyUsual";
import ShowPopup from "../ShowPopup";
//
const PageExchange = () => {
  const navigate = useNavigate();
  const [calculatedValue, setCalculatedValue] = React.useState(0);
  const [balanceInfo, setBalanceInfo] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    BackBtn("/", navigate);
  }, []);

  const makeTransaction = () => {
    setIsLoading(true);
    buyUsual(calculatedValue)
      .then((data) => {
        ShowPopup("Транзакция успешно совершена", "Транзакция");
        setCalculatedValue(0);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        ShowPopup("Произошла ошибка", "Ошибка");
      });
  };

  React.useEffect(() => {
    async function fetch() {
      const data = await balanceOwned();
      setBalanceInfo(data);
    }

    setTimeout(() => {
      fetch();
    }, 2000);
  }, []);
  return (
    <section className="page dwe exchange pb-80">
      <Preloader />
      <div className="container">
        {/* form */}
        <form className="wrap">
          <div className="page_title">
            <h1>
              <I18nText path="user_profile_exchange" />
            </h1>
            <p>
              <I18nText path="exchange_desc" />
            </p>
          </div>
          <div className="echange">
            <h2>
              <I18nText path="user_profile_exchange" />:
            </h2>
            <div className="change">
              <input type="checkbox" id="change_dur" />
              <label className="btn_change" htmlFor="change_dur">
                DUR <IconArrowRight />
                <IconCoin />
              </label>
            </div>
          </div>
          <div className="choose">
            <h2>
              <I18nText path="choose_amount" />:
            </h2>
            <div className="list">
              <input
                type="radio"
                id="v1"
                name="choose"
                onClick={() => setCalculatedValue(1)}
              />
              <label htmlFor="v1">1 DUR</label>
              <input
                type="radio"
                id="v2"
                name="choose"
                onClick={() => setCalculatedValue(2)}
              />
              <label htmlFor="v2">2 DUR</label>
              <input
                type="radio"
                id="v3"
                name="choose"
                onClick={() => setCalculatedValue(3)}
              />
              <label htmlFor="v3">3 DUR</label>
              <input
                type="radio"
                id="v4"
                name="choose"
                onClick={() => setCalculatedValue(4)}
              />
              <label htmlFor="v4">4 DUR</label>
              <input
                type="radio"
                id="v5"
                name="choose"
                onClick={() => setCalculatedValue(5)}
              />
              <label htmlFor="v5">5 DUR</label>
              {/* 5 */}
              <input
                type="radio"
                id="v6"
                name="choose"
                onClick={() => setCalculatedValue(6)}
              />
              <label htmlFor="v6">6 DUR</label>
              <input
                type="radio"
                id="v7"
                name="choose"
                onClick={() => setCalculatedValue(7)}
              />
              <label htmlFor="v7">7 DUR</label>
              <input
                type="radio"
                id="v8"
                name="choose"
                onClick={() => setCalculatedValue(8)}
              />
              <label htmlFor="v8">8 DUR</label>
              <input
                type="radio"
                id="v9"
                name="choose"
                onClick={() => setCalculatedValue(9)}
              />
              <label htmlFor="v9">9 DUR</label>
              <input
                type="radio"
                id="v10"
                name="choose"
                onClick={() =>
                  setCalculatedValue(
                    balanceInfo ? balanceInfo.premiumBalanceReturnable * 1 : 0
                  )
                }
              />
              <label htmlFor="v10">
                <I18nText path="all" /> DUR
              </label>
            </div>
          </div>
          {/* conversion */}
          <div className="convert">
            <h2>
              <I18nText path="conversion_rate" />:
            </h2>
            <div className="list">
              <span>
                1 DUR = 1000 <IconCoin />
              </span>
            </div>
          </div>
          {/* pay */}
          <div className="pay">
            <h2>
              <I18nText path="you_will_pay" />:
            </h2>
            <div className="list">
              <span>
                {calculatedValue}
                <IconCoin />
              </span>
            </div>
          </div>
          {/* TransactionHistory */}
          <TransactionHistory />
          {/* submit */}
          <div className="bar_btn">
            <button
              className="btn_submit"
              type="submit"
              disabled={isLoading}
              onClick={makeTransaction}
            >
              <I18nText
                path={isLoading ? "await_btn" : "user_profile_exchange"}
              />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default PageExchange;
