import { SPOTIFY_CLIENT_ID, REDIRECT_URL } from "../data/config.ts";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export async function checkSpotifyAccessToken(): Promise<void> {
  const spotifyCode = window.localStorage.getItem("spotifyCode");
  const spotifyCodeVerifier = window.localStorage.getItem(
    "spotifyCodeVerifier",
  );
  const spotifyAccessToken = window.localStorage.getItem("spotifyAccessToken");
  if (spotifyAccessToken || !spotifyCode || !spotifyCodeVerifier) {
    return;
  }

  // Build the body of the request
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: spotifyCode,
    redirect_uri: REDIRECT_URL,
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: spotifyCodeVerifier,
  });

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      console.error(
        "Failed to retrieve access token",
        response.status,
        response.statusText,
      );
    }

    const data = await response.json();

    if (response.ok && data.access_token && data.expires_in) {
      window.localStorage.setItem("spotifyAccessToken", data.access_token);
      window.localStorage.setItem(
        "spotifyAccessTokenExpiresAt",
        String(parseInt(data.expires_in) * 1000 + Date.now()),
      );
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
  }
}
