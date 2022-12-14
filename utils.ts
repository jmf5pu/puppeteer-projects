import * as fs from 'fs'; 

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 
  
export function read_file(file_name: string){
  var file_text = fs.readFileSync(file_name,'utf8');
  var lines = file_text.replace(/\r/gi,"").split("\n")
  return lines
}

export async function type_and_wait(page: any, target_selector: string, input_text: string, wait_ms: number, press_enter: boolean=false){
  await page.type(target_selector, input_text, {delay: 50});
  if(press_enter){
      await page.keyboard.press('Enter');
  }
  await sleep(wait_ms);
}
  
export async function click_and_wait(page: any, target_selector: string, wait_ms: number, click_count: number=1){
  await page.click(target_selector,{clickCount:click_count});
  await sleep(wait_ms);
}
  
export async function upload_video_from_studio_home(page: any, file_path: string, video_title: string, video_description: string){
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

  //title and description
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
  
  //kid radio button
  await click_and_wait(page,"#audience > ytkc-made-for-kids-select > div.made-for-kids-rating-container.style-scope.ytkc-made-for-kids-select > tp-yt-paper-radio-group > tp-yt-paper-radio-button:nth-child(2)",2000)
  await click_and_wait(page,"#next-button",2000)
  
  //video elements
  await click_and_wait(page,"#next-button",2000)

  //checks
  await click_and_wait(page,"#next-button",2000)

  //visibility
  await click_and_wait(page,'[name="PUBLIC"]',2000)

  //save
  await click_and_wait(page,"#done-button",2000)
  
  await sleep(40000)
  //remove the popup
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });


  await sleep(10000)

}