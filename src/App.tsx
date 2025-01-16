import { useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { Header } from './components/Header';
import { ScanButton } from './components/ScanButton';
import { ErrorView } from './components/ErrorView';
import { PlayingView } from './components/PlayingView';
import {LoginButton} from "./components/LoginButton.tsx";
import { SPOTIFY_CLIENT_ID } from "./data/config"

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const queryParameters = new URLSearchParams(window.location.search)
  const code = queryParameters.get("code")
  const isLoggedIn = code !== null;

  const redirectSpotifyLogin = (): string => {
    const authQueryParameters = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: "streaming user-read-email user-read-private",
      redirect_uri: "http://localhost:5173/",
      state: generateRandomString(16)
    })
    return 'https://accounts.spotify.com/authorize/?' + authQueryParameters.toString()
  }

  const handleScan = (result: string) => {
    if (result?.startsWith('https://open.spotify.com/')) {
      console.log('Scanned Spotify URL:', result);
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
              facingMode: 'environment',
            }}
          />
        </div>
      ) : (
        isLoggedIn
            ? <ScanButton onClick={() => setIsScanning(true)} />
            : <LoginButton href={redirectSpotifyLogin()} />
      )}
    </div>
  );
}

export default App;