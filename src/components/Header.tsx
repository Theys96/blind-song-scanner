import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => (
  <div className="flex flex-col items-center mb-12">
    <h1
      className="text-[#1DB954] text-4xl font-bold text-center cursor-pointer hover:scale-105 transition-transform"
      onClick={onLogoClick}
    >
      Blind Song Scanner
    </h1>
    <h2
      className="text-[#1DB954] mt-2 text-2xl font-bold text-center"
      onClick={onLogoClick}
    >
      for
    </h2>
    <img 
      src="/src/assets/img/Spotify_Full_Logo_RGB_Green.png"
      alt="Spotify Logo"
      className="w-44 mb-4"
    />
    <p className="text-gray-400 mt-2 text-center">Scan Spotify song link QR codes instantly.</p>
  </div>
);