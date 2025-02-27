import { useEffect, useState } from "react";
import { ScanButton } from "./ScanButton.tsx";
import { PlayingView } from "./PlayingView.tsx";
import { ErrorView } from "./ErrorView.tsx";
import { QrScanner } from "@yudiel/react-qr-scanner";

interface MainProps {
  accessToken: string;
  expired: boolean;
}

function Main({ accessToken, expired }: MainProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null,
  );

  window.onSpotifyWebPlaybackSDKReady = () => {
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
  };

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

  return isScanning ? (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-2xl shadow-[#1DB954]/20">
      {expired ? (
        <p className="text-[#1DB954] font-bold hover:text-[#1ed760] text-center mt-16">
          Your session with Spotify has expired. Please refresh to log in again.
        </p>
      ) : (
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
      )}
    </div>
  ) : deviceId !== null ? (
    <ScanButton onClick={() => setIsScanning(true)} />
  ) : (
    <>
      <a
        className="text-[#1DB954] font-bold hover:text-[#1ed760] text-center mt-16"
        href="https://www.blindsongscanner.com"
      >
        About
      </a>
    </>
  );
}

export default Main;
