# Akizuki

<p align="center">
    <img src="https://raw.githubusercontent.com/rl404/akizuki/master/public/images/edit-form-3.jpg"><br>
    <a href='https://github.com/rl404/akizuki/blob/master/gallery.md'><i>see more pictures</i></a>
</p>

_Akizuki_ is a website where you can view and edit your [MyAnimeList](https://myanimelist.net/)'s anime and manga list in a more modern design with custom tags editor.

## Features

- Login with Oauth2
- View your profile
- View & add your anime & manga list
  - Search
  - Grid/list layout
  - Quick edit score
  - Quick edit episode/chapter/volume
  - NSFW toggle
  - Edit form
    - Watching/reading status
    - Score
    - Episode/chapter/volume
    - Start and end date
    - Tags
    - Comment
    - Convert genres to tags
    - Move tags to comment
    - Preview anime/manga info
      - Rank
      - Score
      - Popularity
      - Airing/publishing status
      - Synopsis
      - Genres
    - Delete
- Tags editor for custom scoring formula
  - Test the formula
  - Tags preview

_More will be coming soon..._

## Requirement

- [NodeJS](https://nodejs.org/)
- [MyAnimeList client id and secret](https://myanimelist.net/apiconfig)
- [Firebase realtime database](https://firebase.google.com/products/realtime-database) (optional)

## Installation

1. Clone the repo.

```sh
git clone https://github.com/rl404/akizuki
```

2. Rename `.env.sample` to `.env` and modify the value according to your setup.

| Env                             | Required | Description                                                                            |
| ------------------------------- | :------: | -------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_GA_ID`             |    no    | Google analytic id.                                                                    |
| `NEXT_PUBLIC_MAL_CLIENT_ID`     |   yes    | MyAnimeList client id.                                                                 |
| `NEXT_PUBLIC_MAL_CLIENT_SECRET` |   yes    | MyAnimeList client secret.                                                             |
| `NEXT_PUBLIC_MAL_REDIRECT_URI`  |   yes    | MyAnimeList oauth2 redirect uri. Must be the same as when you register to MyAnimeList. |
| `FIREBASE_DATABASE_URL`         |    no    | Firebase realtime database URL.                                                        |
| `FIREBASE_SERVICE_ACCOUNT`      |    no    | Firebase service account credential.                                                   |

3. Install depedencies.

```sh
npm ci
```

4. Start.

```sh
npm run dev
```

5. [http://localhost:3000](http://localhost:3000) is ready.

## Trivia

[Akizuki](<https://en.wikipedia.org/wiki/Akizuki-class_destroyer_(1942)>)'s name is taken from japanese destroyer primarily for the role of anti-aircraft screening for carrier battle groups. Also, [exists](https://en.kancollewiki.net/Akizuki) in Kantai Collection games and anime.

## Disclaimer

_Akizuki_ is meant for educational purpose and personal usage only. Please use it responsibly according to MyAnimeList's [Terms Of Service](https://myanimelist.net/about/terms_of_use).

All data belong to their respective copyrights owners, _akizuki_ does not have any affiliation with content providers.

## License

MIT License

Copyright (c) 2022 Axel
