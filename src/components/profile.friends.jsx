import React, { useEffect, useState } from "react";
// css
import "../media/css/profile.css";
// icon
import IconPlayArrow from "../components/icons/playArrow";
import IconChat from "../components/icons/chat";
import IconPresent from "../components/icons/present";
import { I18nText } from "./i18nText";
import getFriends from "../api/getFriends";

const ProfileFriends = () => {
  const [friends, setFriends] = useState();

	const userInfo = JSON.parse(localStorage.getItem("user"));
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
		window.Telegram.WebApp.close();
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
								src={
									userInfo?.tgNickname
										? `https://t.me/i/userpic/160/${userInfo?.tgNickname}.jpg`
										: (userInfo.profilePhoto == 'profile/1.png' ? '/res/skins/profile/1.png' : userInfo.profilePhoto)
								}

								onLoad={(e) => {
									if (e.target.width < 10) {
										e.target.src = userInfo.profilePhoto == 'profile/1.png' ? '/res/skins/profile/1.png' : userInfo.profilePhoto
									}
								}}
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
							<button onClick={() => openChat(friend.tgNickname)} className="btn chat">
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
