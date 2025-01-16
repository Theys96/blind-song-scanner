import React from "react";
import logo from "../../assets/img/Spotify_Primary_Logo_RGB_Black.png";

interface IconProps {
  className?: string;
}

export const BlackSpotifyIcon: React.FC<IconProps> = ({ className }) => (
  <img src={logo} className={className} alt="Spotify" />
);
