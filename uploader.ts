import {read_file, type_and_wait, upload_video_from_studio_home } from "./utils";
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

// constants
const chromium_path = <string>process.env.CHROMIUM_PATH;
const google_email = <string>process.env.GOOGLE_EMAIL;
const google_pw = <string>process.env.GOOGLE_PW;
const titles_path = "./titles.txt";
const descriptions_path = "./descriptions.txt";
const paths_path = "./paths.txt";

// main script
(async () => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless:false,
    executablePath: chromium_path,
    args: ['--disable-dev-shm-usage'],
  });
  const page = (await browser.pages())[0];

  console.log(`logging in to youtube studio`)
  await page.goto('https://studio.youtube.com');
  await type_and_wait(page, '[type=email]', google_email, 5000, true);
  await type_and_wait(page, '[type=password]', google_pw, 10000, true);

  var [paths,titles,descriptions] = [read_file(paths_path),read_file(titles_path),read_file(descriptions_path)];

  if(paths.length != titles.length || titles.length != descriptions.length) throw new Error("Found a different number of videos, titles, or descriptions");

  for(var i = 0; i < paths.length; i++){
    console.log(`uploading video at ${paths[i]}`);
    await upload_video_from_studio_home(page, paths[i], titles[i], descriptions[i]);
  }

  console.log(`all videos uploaded successfully, exiting`)
  await browser.close();
})();