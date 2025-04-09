import { Header } from "./components/Header.tsx";
import { SpotifyLogin } from "./components/SpotifyLogin.tsx";
import { checkSpotifyAccessToken, refreshToken } from "./util/spotify.ts";
import { useEffect, useState } from "react";
import Main from "./components/Main.tsx";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTimeout, setRefreshTimeout] = useState<number | null>(null);
  const [isSpotifySDKReady, setIsSpotifySDKReady] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [showSmallHeader, setShowSmallHeader] = useState(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const newCode = queryParameters.get("code");
  if (newCode) {
    window.localStorage.setItem("spotifyCode", newCode);
    window.history.replaceState({}, document.title, "/");
  }

  // useEffect to make sure this happens exactly once
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsSpotifySDKReady(true);
    };
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    const reloadTokens = () => {
      const expiresAt = window.localStorage.getItem(
        "spotifyAccessTokenExpiresAt",
      );
      const accessToken = window.localStorage.getItem("spotifyAccessToken");
      setAccessToken(accessToken);
      if (expiresAt) {
        const timeoutMs = parseInt(expiresAt) - Date.now();
        if (refreshTimeout) clearTimeout(refreshTimeout);
        const newTimeout = setTimeout(() => {
          refreshToken().then(reloadTokens);
        }, timeoutMs);
        setRefreshTimeout(newTimeout);
      }
    };
    checkSpotifyAccessToken().then(() => {
      reloadTokens();
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Header
          onLogoClick={() => {
            setResetTrigger((prev) => prev + 1);
          }}
          small={showSmallHeader}
          loggedIn={!!accessToken}
        />
        {!isLoading && !accessToken ? <SpotifyLogin /> : null}
        {accessToken && isSpotifySDKReady ? (
          <Main
            accessToken={accessToken}
            resetTrigger={resetTrigger}
            isActive={(active) => {
              setShowSmallHeader(active);
            }}
          />
        ) : null}
      </div>
    </>
  );
}

export default App;
