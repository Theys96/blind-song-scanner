import React from "react";
import { Equalizer } from "./Equalizer";

interface PlayingViewProps {
  onReset: () => void;
  onScanAgain: () => void;
}

export const PlayingView: React.FC<PlayingViewProps> = ({
  onReset,
  onScanAgain,
}) => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
    <div className="flex flex-col items-center relative">
      <img
        src="/src/assets/img/Spotify_Full_Logo_RGB_Green.png"
        alt="Spotify Logo"
        className="w-32 mb-4 cursor-pointer hover:scale-105 transition-transform"
        onClick={onReset}
      />
      <Equalizer />
      <div className="absolute inset-0 bg-gradient-radial-t from-transparent via-black/50 to-black pointer-events-none" />
    </div>
    <button
      onClick={onScanAgain}
      className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full hover:bg-[#1ed760] transition-colors transform hover:scale-105 active:scale-95"
    >
      Scan again
    </button>
  </div>
);
