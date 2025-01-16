import { useEffect, useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Header } from "./components/Header";
import { ScanButton } from "./components/ScanButton";
import { ErrorView } from "./components/ErrorView";
import { PlayingView } from "./components/PlayingView";
import { LoginButton } from "./components/LoginButton.tsx";
import {
  base64encode,
  generateRandomString,
  sha256,
} from "./util/functions.ts";
import { SPOTIFY_CLIENT_ID, REDIRECT_URL } from "./data/config";
import { getSpotifyAccessToken } from "./util/getSpotifyAccessToken.ts";

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [authorizeUrl, setAuthorizeUrl] = useState<string>("#");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null,
  );
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");

  useEffect(() => {
    if (code) {
      window.history.replaceState({}, document.title, "/");
      getSpotifyAccessToken(code).then((newToken) => {
        if (newToken) {
          setAccessToken(newToken);
        }
      });
    }
  }, [code]);

  useEffect(() => {
    if (accessToken !== null) {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Blind Song Scanner",
        getOAuthToken: async (callback: (token: string) => void) => {
          callback(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error("Initialization error:", message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error("Authentication error:", message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error("Account error:", message);
      });

      spotifyPlayer.addListener("playback_error", ({ message }) => {
        console.error("Playback error:", message);
      });

      spotifyPlayer.connect().then(() => {
        console.log(spotifyPlayer);
      });
      setSpotifyPlayer(spotifyPlayer);
    }
  }, [accessToken]);

  useEffect(() => {
    console.log(spotifyPlayer);
    console.log(scannedUrl);
    console.log(deviceId);
    console.log(accessToken);
    if (spotifyPlayer && scannedUrl && deviceId && accessToken) {
      const spotifyUri = scannedUrl
        .replace("https://open.spotify.com/track/", "spotify:track:")
        .split("?")[0];

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [spotifyUri] }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  }, [spotifyPlayer, scannedUrl]);

  const redirectSpotifyLogin = async (): Promise<string> => {
    let codeVerifier = window.localStorage.getItem("spotifyCodeVerifier");

    if (codeVerifier === null || codeVerifier.length === 0) {
      codeVerifier = generateRandomString(64);
      window.localStorage.setItem("spotifyCodeVerifier", codeVerifier);
    }
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const authQueryParameters = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: "streaming user-read-email user-read-private",
      redirect_uri: REDIRECT_URL,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });
    return (
      "https://accounts.spotify.com/authorize/?" +
      authQueryParameters.toString()
    );
  };

  redirectSpotifyLogin().then(setAuthorizeUrl);

  const handleScan = (result: string) => {
    if (result?.startsWith("https://open.spotify.com/")) {
      console.log("Scanned Spotify URL:", result);
      setScannedUrl(result);
      setIsScanning(false);
    } else {
      setIsError(true);
      setIsScanning(false);
    }
  };

  const handleError = (error: Error) => {
    console.error(error);
    setIsError(true);
    setIsScanning(false);
  };

  const resetScanner = () => {
    setScannedUrl(null);
    setIsError(false);
    setIsScanning(true);
    if (spotifyPlayer) {
      spotifyPlayer.pause();
    }
  };

  const resetToStart = () => {
    setScannedUrl(null);
    setIsError(false);
    setIsScanning(false);
  };

  if (isError) {
    return <ErrorView onRetry={resetScanner} />;
  }

  if (scannedUrl) {
    return <PlayingView onReset={resetToStart} onScanAgain={resetScanner} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Header onLogoClick={resetToStart} />
      {isScanning ? (
        <div className="w-full max-w-md rounded-lg overflow-hidden shadow-2xl shadow-[#1DB954]/20">
          <QrScanner
            onDecode={handleScan}
            onError={handleError}
            scanDelay={500}
            hideCount
            audio={false}
            constraints={{
              facingMode: "environment",
            }}
          />
        </div>
      ) : deviceId !== null ? (
        <ScanButton onClick={() => setIsScanning(true)} />
      ) : (
        <LoginButton href={authorizeUrl} />
      )}
    </div>
  );
}

export default App;
