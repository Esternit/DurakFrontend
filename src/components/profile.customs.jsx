import React, { useEffect, useState } from "react";

// api
import getCosmeticActive from "../api/cosmeticActive";
import ImageLoader from "../includes/imageLoader";
import ProfileCustomsWindow from "./profile.customs.window";
import getUsersCosmetics from "../api/usersCosmetics";
import activateCosmetic from "../api/cosmeticActivate";
import { I18nText } from "./i18nText";

const ProfileCustomsBar = () => {
	const [activeCosmetic, setActiveCosmetic] = useState();
	const [availableCosmetic, setAvailableCosmetic] = useState();
	const [currentCosmetics, setCurrentCosmetics] = useState();
	const [isOpenWindow, setIsOpenWindow] = useState(false);

	useEffect(() => {
		async function fetch() {
			const data = await getCosmeticActive();
			const availableCosmeticData = await getUsersCosmetics();

			if (data?.data) {
				localStorage.setItem("user_cosmetic", JSON.stringify(data.data));
			}

			console.log(data?.data)
			setActiveCosmetic(data?.data);
			setAvailableCosmetic(availableCosmeticData);
		}

		fetch();
	}, []);

	const getHandleOpenWindow = (type) => {
		return () => {
			setCurrentCosmetics(
				availableCosmetic?.filter((item) => item.cosmetic?.type === type)
			);
			setIsOpenWindow(true);
		};
	};

	const handleCloseWindow = () => {
		setIsOpenWindow(false);
	};

	const handleSelect = async (cosmetic) => {
		console.log(activeCosmetic)
		const newCosmetic = activeCosmetic?.map((item) => {
			if (item.cosmetic?.type === cosmetic?.cosmetic?.type) {
				return { ...cosmetic, type: "ACTIVE" };
			}

			return item;
		});

		if (newCosmetic) {
			localStorage.setItem("user_cosmetic", JSON.stringify(newCosmetic));
		}

		window.dispatchEvent(new Event("user_cosmetic_changed"));
		setActiveCosmetic(newCosmetic);
		await activateCosmetic({ id: cosmetic.id });

		setIsOpenWindow(false);
	};

	return (
		<>
			<ProfileCustomsWindow
				open={isOpenWindow}
				onClose={handleCloseWindow}
				cosmetics={currentCosmetics}
				onSelect={handleSelect}
			/>
			<div className=""><I18nText path="my_inventory" /></div>
			<div className="profile_customs anim_sjump">
				{/* 4/c */}
				<button
					className="btn border_skin"
					onClick={getHandleOpenWindow("frame")}
				>
					<ImageLoader
						src={`/res/skins${activeCosmetic?.filter(
							(item) => item.cosmetic?.type === "frame"
						)?.[0]?.cosmetic?.link
							}`}
						alt="cBorder"
					/>
				</button>
				<button className="btn bg_skin" onClick={getHandleOpenWindow("table")}>
					<ImageLoader
						src={`/res/skins${activeCosmetic?.filter(
							(item) => item.cosmetic?.type === "table"
						)?.[0]?.cosmetic?.link
							}`}
						alt="cTable"
					/>
				</button>
				<button className="btn smile" onClick={getHandleOpenWindow("emoji")}>
					<ImageLoader
						src={`/res/skins${activeCosmetic?.filter(
							(item) => item.cosmetic?.type === "emoji"
						)?.[0]?.cosmetic?.link
							}`}
						alt="cEmoji"
					/>
				</button>
				<button className="btn card_skin" onClick={getHandleOpenWindow("card")}>
					<ImageLoader
						src={`/res/skins${activeCosmetic?.filter(
							(item) => item.cosmetic?.type === "card"
						)?.[0]?.cosmetic?.link
							}`}
						alt="cCard"
					/>
				</button>
				{/* navbar */}
			</div>
		</>
	);
};
export default ProfileCustomsBar;
