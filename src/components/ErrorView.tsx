import React from "react";
import { ErrorIcon } from "./icons/ErrorIcon";

interface ErrorViewProps {
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ onRetry }) => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 mb-6 rounded-full bg-red-500 flex items-center justify-center">
        <ErrorIcon className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-white text-2xl font-bold mb-4 text-center">
        Invalid QR Code
      </h2>
      <p className="text-gray-400 text-center mb-8 max-w-md">
        The scanned QR code is not a valid Spotify track link. Please try
        scanning a Spotify code.
      </p>
    </div>
    <button
      onClick={onRetry}
      className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full hover:bg-[#1ed760] transition-colors transform hover:scale-105 active:scale-95"
    >
      Try Again
    </button>
  </div>
);
