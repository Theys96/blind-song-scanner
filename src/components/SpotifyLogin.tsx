import React, { useState } from "react";
import {
  base64encode,
  generateRandomString,
  sha256,
} from "../util/functions.ts";
import { REDIRECT_URL, SPOTIFY_CLIENT_ID } from "../data/config.ts";
import { LoginButton } from "./LoginButton.tsx";

export const SpotifyLogin: React.FC = () => {
  const [authorizeUrl, setAuthorizeUrl] = useState<string>("#");

  const redirectSpotifyLogin = async (): Promise<string> => {
    let codeVerifier = window.localStorage.getItem("spotifyCodeVerifier");

    if (codeVerifier === null || codeVerifier.length === 0) {
      codeVerifier = generateRandomString(64);
      window.localStorage.setItem("spotifyCodeVerifier", codeVerifier);
    }
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const authQueryParameters = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: "streaming web-playback",
      redirect_uri: REDIRECT_URL,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });
    return (
      "https://accounts.spotify.com/authorize/?" +
      authQueryParameters.toString()
    );
  };

  redirectSpotifyLogin().then(setAuthorizeUrl);

  return <LoginButton href={authorizeUrl} />;
};
