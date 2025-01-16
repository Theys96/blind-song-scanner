import {
  SPOTIFY_CLIENT_ID,
  REDIRECT_URL,
  SPOTIFY_AUTH_TOKEN,
} from "../data/config.ts";

export async function getSpotifyAccessToken(
  authorizationCode: string,
): Promise<string | null> {
  const tokenEndpoint = "https://accounts.spotify.com/api/token";

  // Build the body of the request
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: authorizationCode,
    redirect_uri: REDIRECT_URL,
    client_id: SPOTIFY_CLIENT_ID,
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + SPOTIFY_AUTH_TOKEN,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      console.error(
        "Failed to retrieve access token",
        response.status,
        response.statusText,
      );
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return null;
  }
}
