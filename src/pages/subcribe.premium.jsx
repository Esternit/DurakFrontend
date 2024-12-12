import React from "react";
// css
import "../media/css/page/subcribe.premium.css";
// components
import Preloader from "../includes/preloader";
//icons
import IconCheck from "../components/icons/check";
import IconBigBlueChek from "../components/icons/bigBlueCheck";
// img
import ImgPremium from "../media/svg/premium.svg";
import { I18nText } from "../components/i18nText";
import { useNavigate } from "react-router-dom";
import buyPremium from "../api/buyPremium";
import getPremium from "../api/getPremium";
import BackBtn from "../BackBtn";
import generatedWallet from "../api/generatedWallet";
import ShowPopup from "../ShowPopup";

import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
//

const PagePremium = () => {
  const navigate = useNavigate();
  const [id, setId] = React.useState(null);
  const [premiums, setPremiums] = React.useState([]);
  const address = useTonAddress();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const [generatedAddress, setGeneratedAddress] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    BackBtn("/", navigate);
  });

  const buy = async () => {
    if (id == null) return;
    setIsLoading(true);
    let item = premiums.filter((item) => item.id === id)[0];
    if (address != null && generatedAddress != null && item != null) {
      const transaction = {
        validUntil: Math.floor(new Date() / 1000) + 360,
        messages: [
          {
            address: generatedAddress, // destination address
            amount: item.priceInTon * 1000000000, //Toncoin in nanotons
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);

      setTimeout(async () => {
        let res = await buyPremium(item.id);
        console.log(res);
        if (res.status === 400) {
          ShowPopup("Вам будет выдан Premium в ближайшее время", "Premium");
        }
      }, 2000);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    getPremium().then((res) => {
      setPremiums(res.data);
    });
    const getGenWallet = async () => {
      let res = await generatedWallet();
      if (res != null) {
        console.log(res);
        setGeneratedAddress(res);
      }
    };
    getGenWallet();
  }, []);
  return (
    <section className="page premium pb-80">
      <Preloader />
      <div className="container">
        <header className="banner anim_sjump">
          <img src={ImgPremium} alt="img" />
          <h1 className="page_title">Durak Premium</h1>
        </header>
        {/* offers */}
        <div className="card offers anim_sjump">
          {/* Monthly */}
          <input
            type="radio"
            name="offer"
            id="mounth"
            onClick={() => setId(1)}
          />
          <label htmlFor="mounth">
            <div className="offer-container">
              <div className="crc">
                <IconCheck />
              </div>
              <div className="title">
                <p>
                  <I18nText path="month" />
                </p>
              </div>
            </div>
            <div className="price">
              <span className="installment" style={{ opacity: 0 }}>
                -0%
              </span>
              5.00 TON/
              <I18nText path="month" />
            </div>
          </label>

          {/* 6 Months */}
          <input type="radio" name="offer" id="sexmounths" />
          <label htmlFor="sexmounths" onClick={() => setId(2)}>
            <div className="offer-container">
              {" "}
              <div className="crc">
                <IconCheck />
              </div>
              <div className="title">
                <p>
                  6 <I18nText path="months" />
                </p>
                <div className="subtext">
                  <span
                    className="old"
                    style={{ textDecoration: "line-through" }}
                  >
                    30 TON/
                    <I18nText path="half_a_year" />
                  </span>
                  <br />
                  <span className="new">
                    25 TON/
                    <I18nText path="half_a_year" />
                  </span>
                </div>
              </div>
            </div>
            <div className="price">
              <span className="installment">-15%</span>
              4.16 TON/
              <I18nText path="month" />
            </div>
          </label>

          {/* Annual */}
          <input type="radio" name="offer" id="annual" />
          <label htmlFor="annual" onClick={() => setId(3)}>
            <div className="offer-container">
              <div className="crc">
                <IconCheck />
              </div>
              <div className="title">
                <p>
                  <I18nText path="annual" />
                </p>
                <div className="subtext">
                  <span
                    className="old"
                    style={{ textDecoration: "line-through" }}
                  >
                    60 TON/
                    <I18nText path="year" />
                  </span>
                  <br />
                  <span className="new">
                    45 TON/
                    <I18nText path="year" />
                  </span>
                </div>
              </div>
            </div>
            <div className="price">
              <span className="installment">-25%</span>
              3.75 TON/
              <I18nText path="month" />
            </div>
          </label>
        </div>
        {/* Features */}
        <div className="group anim_sjump">
          <p className="card_title">
            <I18nText path="features" />
          </p>
          <div className="card features">
            {/* rows */}
            <div className="row">
              <IconBigBlueChek />
              <div className="title">
                <p>+100% XP</p>
                <span className="subtext">
                  <I18nText path="100_percent_xp" />
                </span>
              </div>
            </div>
            <div className="row">
              <IconBigBlueChek />
              <div className="title">
                <p>
                  <I18nText path="50_percent_xp" />
                </p>
                <span className="subtext">
                  <I18nText path="50_percent_buff" />
                </span>
              </div>
            </div>
            <div className="row">
              <IconBigBlueChek />
              <div className="title">
                <p>
                  <I18nText path="priority" />
                </p>
                <span className="subtext">
                  <I18nText path="always_on_top" />
                </span>
              </div>
            </div>
            <div className="row">
              <IconBigBlueChek />
              <div className="title">
                <p>
                  <I18nText path="help_games" />
                </p>
                <span className="subtext">
                  <I18nText path="help_desc" />
                </span>
              </div>
            </div>
            <div className="row">
              <IconBigBlueChek />
              <div className="title">
                <p>
                  {" "}
                  <I18nText path="friend_bonuses" />
                </p>
                <span className="subtext">
                  <I18nText path="friend_desc" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        disabled={isLoading}
        onClick={buy}
        className="subcribe_btn anim_sjump"
      >
        <I18nText path="subscribe" />
      </button>
    </section>
  );
};
export default PagePremium;
