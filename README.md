# puppeteer-projects
This repo contains my projects involving puppeteer

## uploader.ts
* Automates youtube's video uploading process
* Specify video file paths, titles, and descriptions by listing them (newline deliminated) in `paths.txt`, `titles.txt`, and `descriptions.txt` respectively (must be in this project's directory)
* Specify the chromium path as well as google username and password in a .env file
* Requires: `puppeteer-extra`, `puppeteer-extra-plugin-stealth`, `dotenv`
* Run with: `tsc uploader.ts | node uploader.js`

## viewer.ts
* utilizes rotating proxies to add "from youtube search" views to public youtube videos
* list proxies in the format IP:PORT in `proxies.txt`
* will search for a video by rotating through the provided strings in `search_strings.txt` 
  * this string is what follows `https://www.youtube.com/results?search_query=` in the url for a youtube search where the video being targeted is the first result
  * this string may change over time
* the bot will view the target video for between 2-4 minutes
* proxies that errored out during connection will not be stored for future runs