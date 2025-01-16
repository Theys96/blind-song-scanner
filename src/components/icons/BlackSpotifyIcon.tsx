import React from 'react';

interface IconProps {
  className?: string;
}

export const BlackSpotifyIcon: React.FC<IconProps> = ({ className }) => (
    <img src="/src/assets/img/Spotify_Primary_Logo_RGB_Black.png" className={className}  alt="Spotify" />
);