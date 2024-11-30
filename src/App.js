import React from "react";
import "./app.css";
import "./media/css/animations.css";
// Routes
import Routes from "./router/routes";
import Providers from "./Prodivers";
import Preloader from "./includes/preloader";
import initUser from "./api/initUser";

function App({ intlProviderValue }) {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const tgReady = () => {
      if (tg) {
        tg.headerColor = "#141019";
        tg.backgroundColor = "#141019";

        tg.disableVerticalSwipes();
        tg.ready();
        tg.expand();
        tg.BackButton.hide();
      }
    };

    const auth = async () => {
      let response;

      try {
        if (loading === false) {
          return;
        }
        await initUser().then(() => {
			setLoading(false);
        });
      } catch (error) {
        if (error.response && error.response.status) {
          console.log(error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      }

      if (response && response.status) {
        console.log(response.status);
      }
    };

    auth();
    tgReady();

    document.body.addEventListener(
      "touchmove",
      function (e) {
        if (e.target === document.body) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    function preventCollapse() {
      console.log("preventCollapse");
      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    }

    document.body.addEventListener("touchstart", preventCollapse, {
      passive: false,
    });

    return () => {
      document.body.removeEventListener("touchmove", function (e) {
        if (e.target === document.body) {
          e.preventDefault();
        }
      });

      document.body.removeEventListener("touchstart", preventCollapse);
    };
  }, []);

  return <>{loading === true ? <Preloader /> : <Routes />}</>;
}

export default function AppWithProviders() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}
