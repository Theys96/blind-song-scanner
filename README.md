# Blind Song Scanner

> **Demo:** [play.blindsongscanner.com](https://play.blindsongscanner.com/)

QR code scanner web application for playing Spotify songs blindly:
- Log in with a Spotify Premium account.
- Scan a QR code with a Spotify song URL (i.e. [https://open.spotify.com/track/...](https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8?si=8c83c6d0e3f5404e)).
- The app immediately starts playing the song without revealing any details about it.

This app was designed to enable a range of musical party games. 
For example, physical tiles may be printed with a song's name, artist and/or publication year on the other side. 

-------

> If you happen to know more about whether the design of this app complies with or violates the [Spotify Design & Branding Guidelines](https://developer.spotify.com/documentation/design), please let me know!

## Development

This application was built with npm/11.0.0 and vite/5.4.8. 
The project's code is in a work-in-progress state, it has several glitches and many opportunities for refactoring.

To install and start this React app locally, clone the repository and run:

```
npm install
npm run start
```

To get the Spotify log-in to work, create a client in the [Spotify for Developers dashboard](https://developer.spotify.com)
and fill in the Client ID in `app/data/config.ts`.

Make sure to apply linting after making changes:

```
npm run lint:fix
```

## Screenshots

<img align="left" src="screenshots/log_in_screen.jpeg" height="700px" alt="Log in screen" />
<img align="left" src="screenshots/scanning.jpeg" height="700px" alt="Scanning" />
<img align="left" src="screenshots/start_screen.jpeg" height="700px" alt="Start screen" />
<img align="left" src="screenshots/playing_track.jpeg" height="700px" alt="Playing a track" />
<img align="left" src="screenshots/invalid_code.jpeg" height="700px" alt="Invalid QR code" />
