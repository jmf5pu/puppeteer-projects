import * as fs from 'fs'; 

export async function sleep(ms: number) {
  console.log(`\t* sleeping for ${ms} ms`)
  return new Promise(resolve => setTimeout(resolve, ms));
} 
  
export function read_file(file_name: string): string[]{
  /*
  reads the specified file and returns a list of lines
  */
  var file_text = fs.readFileSync(file_name,'utf8');
  var lines = file_text.replace(/\r/gi,"").split("\n")
  return lines
}

export function write_file(file_name: string, array_of_strings: string[]): void{
  var file = fs.createWriteStream(file_name);
  array_of_strings.forEach(function(v) { file.write(v + '\n'); });
  file.end();
}

export async function type_and_wait(page: any, target_selector: string, input_text: string, wait_ms: number, press_enter: boolean=false): Promise<void>{
  /*
  types into a selector on the screen and then waits
  */
  await page.type(target_selector, input_text, {delay: 50});
  if(press_enter){
      await page.keyboard.press('Enter');
  }
  await sleep(wait_ms);
}
  
export async function click_and_wait(page: any, target_selector: string, wait_ms: number, click_count: number=1): Promise<void>{
  /*
  clicks a selector on the screen and and then waits
  if_present: check if selector is present before clicking
  */
  await page.click(target_selector,{clickCount:click_count});
  await sleep(wait_ms);
}

export async function click_and_wait_if_present(page: any, target_selector: string, wait_ms: number, click_count: number=1): Promise<void>{
  /*
  clicks the selector if present, will NOT fail loudly if not present
  */
  try{
    await click_and_wait(page, target_selector, wait_ms, click_count);
  }
  catch{}
}
  
export async function upload_video_from_studio_home(page: any, file_path: string, video_title: string, video_description: string): Promise<void>{
  /*
  start and ends on youtube studio dashboard scene 
  */
  await click_and_wait(page,'[id="upload-icon"]',3000)
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('[id="select-files-button"]'),
  ]);
  await fileChooser.accept([file_path]);
  await sleep(3000)

  //enter title and description
  await type_and_wait(
    page,
    "#title-textarea",
    video_title,
    1000,
    false
  )
  await click_and_wait(page,"#description-textarea",1000,2)
  await type_and_wait(
    page,
    "#description-textarea",
    video_description,
    1000,
    false
  )
  
  //click not for kids
  await click_and_wait(page,"#audience > ytkc-made-for-kids-select > div.made-for-kids-rating-container.style-scope.ytkc-made-for-kids-select > tp-yt-paper-radio-group > tp-yt-paper-radio-button:nth-child(2)",2000)
  await click_and_wait(page,"#next-button",2000)
  
  //go to checks screen
  await click_and_wait(page,"#next-button",2000)

  //go past checks screen
  await click_and_wait(page,"#next-button",2000)

  //click public visibility 
  await click_and_wait(page,'#privacy-radios > tp-yt-paper-radio-button:nth-child(19)',2000)

  //save, wait for upload to complete
  await click_and_wait(page,"#done-button",2000)
  await sleep(40000)

  //remove the popup
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

  //ensure video upload completed
  await sleep(10000)

}