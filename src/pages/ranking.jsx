import React from "react";
//
import Preloader from "../includes/preloader";
// css
import "../media/css/page/ranking.css";
// components
import NavBar from "../components/nav.bar";
// icons
import IconCoin from "../components/icons/coin";
import IconStarPremium from "../components/icons/starPremium";
import ImgProfile from "../media/img/avatar.png";
import { I18nText } from "../components/i18nText";
import { useNavigate } from "react-router-dom";
import BackBtn from "../BackBtn";
import getLeaders from "../api/getLeaders";

// Array of user data
// const users = [
//   { id: 1, name: "Nikey", score: "1.234.564", premium: true },
//   { id: 2, name: "Gelar", score: "1.114.444", premium: false },
//   { id: 3, name: "Keyey", score: "1.110.123", premium: false },
//   { id: 4, name: "Krife", score: "1.109.574", premium: false },
//   { id: 5, name: "Riege", score: "1.103.303", premium: false },
//   { id: 6, name: "Arsey", score: "1.101.101", premium: false },
//   { id: 7, name: "Trere", score: "1.101.100", premium: false },
//   { id: 8, name: "Bercleen", score: "1.100.997", premium: false },
//   { id: 9, name: "Nedisi", score: "1.100.994", premium: false },
//   { id: 10, name: "Venti", score: "1.100.243", premium: false },
//   { id: 11, name: "Paul", score: "1.100.101", premium: true, self: true },
//   { id: 12, name: "Harly", score: "1.087.994", premium: false },
//   { id: 13, name: "Elio", score: "1.075.243", premium: false },
// ];

const PageRanking = () => {
	const navigate = useNavigate();

	const [users, setUsers] = React.useState([]);

	React.useState(() => {
		const fetchLeaders = async () => {
			const data = await getLeaders();
			setUsers(data);
		};

		fetchLeaders();
	});

	React.useEffect(() => {
		BackBtn("/", navigate);
	});
	return (
		<>
			<section className="page ranking pb-80">
				<Preloader />
				<div className="container">
					<h1 className="page_title">
						<I18nText path="ranking" />
					</h1>
					<div className="wrap">
						{/* rate_list */}
						<div className="rate_list">
							{users.length > 0 && (
								<>
									{" "}
									{users.map((user, index) => (
										<div
											key={user.id}
											className={`row ${user.id === JSON.parse(localStorage.getItem("user")).id
												? "self"
												: ""
												}`}
										>
											<div className="user">
												<img
													className="user_picture"
													src={`https://t.me/i/userpic/160/${user.user.tgNickname}.jpg`}
													alt={`${user.user.username}'s profile`}
												/>
												<span className="user_name">
													{index + 1}. {user.user.username}
													{user.user.isPremium && <IconStarPremium />}
												</span>
											</div>
											<div className="score">
												{user.usualBalance}
												<IconCoin />
											</div>
										</div>
									))}
								</>
							)}
						</div>
					</div>
					{/* NavBar */}
				</div>
			</section>
			<NavBar />
		</>
	);
};

export default PageRanking;
