import { read_file, type_and_wait, click_and_wait, click_and_wait_if_present, upload_video_from_studio_home, sleep, write_file } from "./utils";
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

const chromium_path = <string>process.env.CHROMIUM_PATH;
const proxies = read_file("./proxies.txt")
const args = process.argv.slice(2)
const min_view_s: number = parseInt(args[0])
const max_view_s: number = parseInt(args[1])
const show_logs: boolean = ["n","no","f","false"].includes(args[2].toLowerCase()) ? false : true
const filter_proxies: boolean = ["n","no","f","false"].includes(args[3].toLowerCase()) ? false : true

function _get_random_number(min: number, max: number): number {
  /*
  generates a random number between the specified max and min (inclusive))
  */
  return min + Math.floor(Math.random() * (max+1 - min));
}

function _conditional_logging(message: string): void{
  if(show_logs){
    console.log(message);
  }
}

async function main(){
  puppeteer.use(StealthPlugin());
  var working_proxies: string[] = [];
  var search_strings = read_file("./search_strings.txt");
  _conditional_logging(`\t* ${proxies.length} proxies were found`);
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
      var view_time_ms = _get_random_number(min_view_s*1000, max_view_s*1000); // get view duration in ms
      const page = (await browser.pages())[0];
      await page.goto('https://www.youtube.com/results?search_query=' + search_strings[_get_random_number(0, search_strings.length-1)]);
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
      _conditional_logging(`(${count}): ${proxy} succeeded`);
      working_proxies.push(proxy);
      successes += 1;
    }
    catch {
      _conditional_logging(`(${count}): ${proxy} failed`);
      await browser.close();

    }
  }
  // save the proxies that worked
  if (filter_proxies){
    write_file("./proxies.txt",working_proxies);
    _conditional_logging(`working proxies were saved.`);
  }
  _conditional_logging(`SUCCEEDED: ${successes}`);
}

main()