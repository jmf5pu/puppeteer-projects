# puppeteer-projects
This repo contains my projects involving puppeteer

## uploader.ts
* This script leverages puppeteer to automate youtube's video uploading process
* Specify video file paths, titles, and descriptions by listing them (newline deliminated) in paths.txt, titles.txt, and descriptions.txt respectively (must be in this project's directory)
* Specify the chromium path as well as google username and password in a .env file
* Requires: puppeteer-extra, puppeteer-extra-plugin-stealth, dotenv