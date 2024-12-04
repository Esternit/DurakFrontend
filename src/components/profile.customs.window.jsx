import React from "react";

// css
import "../media/css/profile.css";
import ImageLoader from "../includes/imageLoader";
import { I18nText } from "./i18nText";

const ProfileCustomsWindow = ({ open, cosmetics, onSelect, onClose }) => {
	const getHandleSelect = (cosmetic) => {
		return () => {
			onSelect?.(cosmetic);
		}
	}

	return (
		<div className={`modal ${open ? "modal_open" : ""} modal-overlay`}>
			<div className="modal_content">
				<div className="modal_body">
					<div className="card_grid">
						{cosmetics?.map((cosmetic) => (
							<button key={cosmetic.id} className="card_cosmetic" onClick={getHandleSelect(cosmetic)}>
								<div className="card_cosmetic-img-box">
									<ImageLoader
										src={`/res/skins${cosmetic?.cosmetic?.link}`}
										alt="cBorder"
									/>
								</div>
							</button>
						))}
					</div>
				</div>
				<div className="modal_footer">
					<button className="cancel_button" onClick={onClose}>
						<I18nText path="user_profile_cancel" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProfileCustomsWindow;