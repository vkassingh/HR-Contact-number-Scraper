import puppeteer from 'puppeteer';

export async function getJobPostLinks(url, selector) {
    let browser;

    try {
        console.log('Launching browser to scrape data');
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );
        await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });

        console.log('Extracting job links...');
        const links = await page.$$eval(selector, elements =>
            elements.map(ele => ele.href)
        );
        console.log(`Found ${links.length} links.`);
        return links;
    } catch (err) {
        console.error(`Error in getJobPostLinks for URL: ${url}`, err);
        return []; // Return an empty array on error to prevent breaking the next step
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export async function findContactInPost(url) {
    let browser; // Declare browser outside the try block
    
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );

        await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });
        const content = await page.content();
        const phoneRegex = /\b[6-9]\d{9}\b/g;
        const contact = content.match(phoneRegex)?.[0];

        if (contact) {
            const title = await page.title();
            let company = 'Unknown company';

            try {
                // Prioritize 'h1' for the company name, fallback to a more general class if needed
                company = await page.$eval('h1', el => el.innerText.trim());
            } catch (h1Err) {
                try {
                    // Fallback to a common company name selector
                    company = await page.$eval('.company_name, .company-name', el => el.innerText.trim());
                } catch (companyErr) {
                    console.log(`Company selector not found for ${url}. Using default value.`);
                }
            }

            return { title, company, contact, link: url };
        }

        return null;
    } catch (error) {
        console.error(`Error in findContactInPost for URL: ${url}`, error);
        return null; // Return null on any error
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}