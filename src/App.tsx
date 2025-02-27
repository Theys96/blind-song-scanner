import { Header } from "./components/Header.tsx";
import { SpotifyLogin } from "./components/SpotifyLogin.tsx";
import { checkSpotifyAccessToken } from "./util/checkSpotifyAccessToken.ts";
import { useEffect, useState } from "react";
import Main from "./components/Main.tsx";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expired, setExpired] = useState<boolean>(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const newCode = queryParameters.get("code");
  if (newCode) {
    window.localStorage.setItem("spotifyCode", newCode);
    window.history.replaceState({}, document.title, "/");
  }

  // useEffect to make sure this happens exactly once
  useEffect(() => {
    checkSpotifyAccessToken().then(() => {
      setIsLoading(false);
    });
  });

  const accessToken = window.localStorage.getItem("spotifyAccessToken");
  const accessTokenExpiresAt = window.localStorage.getItem(
    "spotifyAccessTokenExpiresAt",
  );

  if (accessTokenExpiresAt) {
    setTimeout(
      () => {
        window.localStorage.removeItem("spotifyAccessToken");
        window.localStorage.removeItem("spotifyAccessTokenExpiresAt");
        setExpired(true);
      },
      Math.max(0, parseInt(accessTokenExpiresAt) - Date.now()),
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Header onLogoClick={() => {}} />
      {!isLoading && !accessToken ? <SpotifyLogin /> : null}
      {accessToken && accessTokenExpiresAt ? (
        <Main accessToken={accessToken} expired={expired} />
      ) : null}
    </div>
  );
}

export default App;
