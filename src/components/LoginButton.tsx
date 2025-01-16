import React from "react";
import { BlackSpotifyIcon } from "./icons/BlackSpotifyIcon.tsx";

interface LoginButtonProps {
  href: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ href }) => (
  <a
    href={href}
    className="bg-[#1DB954] text-black font-bold py-4 px-10 rounded-full hover:bg-[#1ed760] transition-all flex items-center gap-3 text-lg transform hover:scale-105 active:scale-95 shadow-lg"
  >
    <BlackSpotifyIcon className="w-6 h-6" />
    Log in
  </a>
);
