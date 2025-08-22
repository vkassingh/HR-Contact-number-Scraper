import puppeteer from 'puppeteer';

export async function getJobPostLinks(url, selector, platform) {
    let browser;

    try {
        console.log(`Launching browser to scrape ${platform} jobs`);
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );
        
        // Set longer timeout for job sites
        await page.setDefaultNavigationTimeout(120000);
        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log(`Extracting job links from ${platform}...`);
        
        // Scroll to load more content (for infinite scroll pages)
        await autoScroll(page);

        const links = await page.$$eval(selector, elements =>
            elements.map(ele => ele.href).filter(href => href && href !== '#')
        );
        
        console.log(`Found ${links.length} links on ${platform}.`);
        return links;
    } catch (err) {
        console.error(`Error in getJobPostLinks for ${platform}:`, err);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Helper function to auto-scroll for infinite scroll pages
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

export async function findContactInPost(url) {
    let browser;
    
    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );
        
        await page.setDefaultNavigationTimeout(60000);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        // Get page content
        const content = await page.content();
        
        // Enhanced phone number regex patterns
        const phonePatterns = [
            /\b[6-9]\d{9}\b/g, // Standard Indian numbers
            /\b\+91[6-9]\d{9}\b/g, // +91 prefix
            /\b0[6-9]\d{9}\b/g, // 0 prefix
            /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // US format
            /\b\d{5}[-.\s]?\d{5}\b/g // Alternative format
        ];
        
        let contact = null;
        
        // Try all phone patterns
        for (const pattern of phonePatterns) {
            const matches = content.match(pattern);
            if (matches && matches.length > 0) {
                contact = matches[0];
                break;
            }
        }
        
        if (contact) {
            const title = await page.title();
            let company = 'Unknown company';

            try {
                // Multiple selectors for company name
                const companySelectors = [
                    'h1',
                    '.company-name',
                    '.company_name',
                    '[data-test="company-name"]',
                    '.employer-name',
                    '.org',
                    '.inline-block'
                ];
                
                for (const selector of companySelectors) {
                    try {
                        company = await page.$eval(selector, el => el.textContent.trim());
                        if (company && company !== '') break;
                    } catch (e) {
                        continue;
                    }
                }
            } catch (companyErr) {
                console.log(`Company name not found for ${url}`);
            }

            return { 
                title, 
                company: company || 'Unknown company', 
                contact, 
                link: url,
                timestamp: new Date().toISOString()
            };
        }

        return null;
    } catch (error) {
        console.error(`Error in findContactInPost for URL: ${url}`, error);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}