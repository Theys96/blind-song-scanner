import React from "react";
import spotifyLogo from "../assets/img/Spotify_Full_Logo_RGB_Green.png";

interface HeaderProps {
  onLogoClick: () => void;
  small: boolean;
  loggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLogoClick,
  small,
  loggedIn,
}) => (
  <div className="flex flex-col items-center mb-12">
    <h1
      className="text-[#1DB954] text-4xl font-bold text-center cursor-pointer hover:scale-105 transition-transform"
      onClick={onLogoClick}
    >
      Blind Song Scanner
    </h1>
    {small ? null : (
      <div className="flex flex-col items-center">
        <h2
          className="text-[#1DB954] mt-2 text-2xl font-bold text-center"
          onClick={onLogoClick}
        >
          for
        </h2>
        <img src={spotifyLogo} alt="Spotify Logo" className="w-44 mb-4" />
        <p className="text-gray-400 mt-2 text-center">
          Scan a Spotify song link QR code. Play the song without revealing it.
        </p>
        {!loggedIn && (
          <p className="text-orange-500 w-[500px] mt-2 text-center">
            Please note that this is a demo product which can only be used by
            registered demo Spotify users, or by hosting the application with
            your own Spotify developer client credentials.
          </p>
        )}
      </div>
    )}
  </div>
);
