import axios from "axios";
import config from "../config";

async function initUser() {
  console.log(window.Telegram.WebApp.initData)
  await axios
    .post(config.url + "/users/init", {
      initData: window.Telegram.WebApp.initData,
    })
    .then(res => {
      console.log(res.headers);
      localStorage.setItem("session_key", res.headers.get("X-Session"));
      localStorage.setItem("user", JSON.stringify(res.data));
    });
    
  // const response = await fetch(`${config.url}/users/init`, {
  //   method: "POST",
  //   credentials: "include",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ initData: window.Telegram.WebApp.initData }),
  // });
  // const data = await response.json();
  // localStorage.setItem("user", JSON.stringify(data));
  // .then(
  //   await axios.get(config.url + "/users").then((res) => {
  //     console.log(res.data);
  //   })
  // );
}

export default initUser;
