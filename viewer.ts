import { read_file, type_and_wait, click_and_wait, click_and_wait_if_present, upload_video_from_studio_home, sleep, write_file } from "./utils";
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

const chromium_path = <string>process.env.CHROMIUM_PATH;
const proxies = read_file("./proxies.txt")

function _get_random_view_time(min_ms: number, max_ms: number): number {
  /*
  For randomizing view time, generates a random number between the specified max and min
  */
  return min_ms + Math.floor(Math.random() * (max_ms - min_ms));
}

async function main(){
  puppeteer.use(StealthPlugin());
  var working_proxies: string[] = [];
  var search_strings = read_file("./search_strings.txt");
  console.log(`\t* ${search_strings.length} proxies were found`);
  var [count, successes] = [0,0];
  for (var proxy of proxies) {
    // setup
    count += 1;
    proxy = proxy.replace("\t",":");
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: chromium_path,
      args: [
        '--disable-dev-shm-usage',
        `--proxy-server=${proxy}`,
      ],
    });

    try {
      var view_time_ms = _get_random_view_time(120000, 240000); //2 to 4 minutes
      const page = (await browser.pages())[0];
      await page.goto('https://www.youtube.com/results?search_query=' + search_strings[count%search_strings.length]);
      await sleep(6000);

      // click accept on cookies popup if present
      await click_and_wait_if_present(
        page, 
        '[aria-label="Accept the use of cookies and other data for the purposes described"]', 
        5000,
      );

      // click first result
      await click_and_wait(
        page, 
        "#contents > ytd-video-renderer:nth-child(1)", 
        2000,
      );
      
      // view video
      await sleep(view_time_ms);

      // cleanup
      await browser.close();
      console.log(`(${count}): ${proxy} succeeded`);
      working_proxies.push(proxy);
      successes += 1;
    }
    catch {
      console.log(`(${count}): ${proxy} failed`);
      await browser.close();

    }
  }
  // save the proxies that worked
  write_file("./proxies.txt",working_proxies);
  console.log(`working proxies were saved. SUCCEEDED: ${successes}`);
}

main()