import React from "react";
import { MusicIcon } from "./icons/MusicIcon";

interface ScanButtonProps {
  onClick: () => void;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#1DB954] text-black font-bold py-4 px-10 rounded-full hover:bg-[#1ed760] transition-all flex items-center gap-3 text-lg transform hover:scale-105 active:scale-95 shadow-lg"
  >
    <MusicIcon className="w-6 h-6" />
    Scan QR
  </button>
);
