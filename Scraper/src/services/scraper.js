import puppeteer from 'puppeteer';

async function getJobPostLinks(url, selector){
    let browser;

    try{
    console.log('Launching browser to scrape data ')
    browser = await pupeeteer.launch({headless: 'new'})
    const page = await browser.newPage()
    await page.goto(url)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url)

    console.log('Extracting job links...')
    const links = await page.$$eval(selector, elements => elements.map( ele => ele.href))
    console.log(`found ${links.length} links.`)
    return links; 

    }catch(err){
       console.error(err)
    }finally{
        if(browser) {
            await browser.close()
        }
    }
}

async function findContactInPost(url){
const browser = await puppeteer.launch({headless: 'new'})
const page= await browser.newPage()
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

try{
await page.goto(url)
const content = await page.content()
const phoneRegex = /\b[6-9]\d{9}\b/g;
const contact = content.match(phoneRegex)?.[0]
if( contact ){
    const title = await page.title()
    const company = await page.$eval('h1, .company_name' , el => el.innerText.trim()).catch( ()=> {
        'Uknown company'
    }) 
    return { title, company, contact, link: url }
}
return null; 

}catch(error){
    console.error(error)
}finally{
    await browser.close()
 }
}

module.exports = {
    getJobPostLinks ,findContactInPost
}
