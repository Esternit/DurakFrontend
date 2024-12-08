import React, { useEffect, useState } from "react";
// css
import "../media/css/profile.css";
// img
import imgFriend from "../media/img/profile/friend.png";
// icon
import IconPlayArrow from "../components/icons/playArrow";
import IconChat from "../components/icons/chat";
import IconAddFriends from "../components/icons/addFriends";
import IconPresent from "../components/icons/present";
import { I18nText } from "./i18nText";
import getFriends from "../api/getFriends";

const ProfileFriends = () => {
  const [friends, setFriends] = useState();

  useEffect(() => {
    async function fetchFriends() {
      const { data } = await getFriends();
      let newData = data.filter(
        (friend) => friend.id != JSON.parse(localStorage.getItem("user")).id
      );
      setFriends(newData);
    }

    fetchFriends();
  }, []);

  const openChat = (tgNickname) => {
    window.Telegram.WebApp.openTelegramLink(`https://t.me/${tgNickname}`);
  };

  const openWindows = (id) => {
    const w = document.querySelector(".profile_section .windows");
    w.classList.add("windows_active");
    localStorage.setItem("selected_friend", id);
  };

  return (
    <div className="profile_friends">
      {friends && friends.length > 0 ? (
        friends.map((friend, index) => (
          <div className="row anim_sjump" key={index}>
            <div className="user">
              <img
                className="picture"
                src={`https://t.me/i/userpic/160/${friend.tgNickname}.jpg`}
                alt="friend"
              />
              <div className="info">
                <p className="name">{friend.tgNickname || "Anonim"}</p>
                <div className="status">
                  <IconPlayArrow />
                  {friend.status}
                </div>
              </div>
            </div>
            <div className="btns">
              <button
                className="btn chat"
                onClick={() => openChat(friend.tgNickname)}
              >
                <IconChat />
              </button>
              <button
                className="btn present"
                onClick={() => {
                  openWindows(friend.id);
                }}
              >
                <IconPresent />
              </button>
            </div>
          </div>
        ))
      ) : (
        <I18nText path="no_friends" />
      )}
    </div>
  );
};

export default ProfileFriends;
