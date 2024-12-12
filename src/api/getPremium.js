import axios from "axios";
import config from "../config";

async function getPremium() {
  try {
    const res = await axios.get(config.url + "/users/premium", {
      headers: {
        "Access-Control-Expose-Headers": "X-Session",
        "X-Session": localStorage.getItem("session_key"),
      },
    });
    localStorage.setItem("session_key", res.headers.get("X-Session"));
    return res;
  } catch (error) {
    console.error("Error fetching friends:", error);
    return null;
  }
}

export default getPremium;
