import axios from "axios";
import config from "../config";

async function activateCosmetic({ id }){
    try {
        const res =
            await axios
                .post(
                    config.url + "/users/cosmetic/activate",
                    {id},
                    {
                            headers: {
                                "Access-Control-Expose-Headers": "X-Session",
                                "X-Session": localStorage.getItem("session_key"),
                            },
                        });
        localStorage.setItem("session_key", res.headers.get("X-Session"));
        return res.data;
    } catch (error) {
        console.error("Error connect:", error);
        return null;
    }
}

export default activateCosmetic;