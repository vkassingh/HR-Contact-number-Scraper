const { getJobPostLinks, findContactInPost } = require('./services/scraper');

// Track already processed links to avoid duplicates
const processedLinks = new Set();
const foundContacts = new Set();

async function runScraperCycle() {
    console.log('\n=== Starting new scraping cycle ===');
    console.log('Searching for Node.js developer jobs...');

    try {
        // Glassdoor - Node.js jobs in Noida
        const glassdoorLinks = await getJobPostLinks(
            'https://www.glassdoor.co.in/Job/noida-nodejs-developer-jobs-SRCH_IL.0,5_IC4477468_KO6,22.htm',
            'a[data-test="job-link"]',
            'Glassdoor'
        );

        // Indeed - Node.js jobs in Noida
        
        const indeedLinks = await getJobPostLinks(
            'https://in.indeed.com/q-node-js-developer-l-noida,-uttar-pradesh-jobs.html',
            'a.tapItem',
            'Indeed'
        );


        // LinkedIn - Node.js jobs in Noida
        const linkedinLinks = await getJobPostLinks(
            'https://www.linkedin.com/jobs/search/?keywords=nodejs%20developer&location=Noida%2C%20Uttar%20Pradesh%2C%20India',
            'a.base-card__full-link',
            'LinkedIn'
        );

        // Combine all links
        const allLinks = [
            ...(glassdoorLinks || []),
            ...(indeedLinks || []),
            ...(linkedinLinks || [])
        ].filter(link => link && !processedLinks.has(link));

        console.log(`Found ${allLinks.length} new links to process.`);

        // Process each new link
        for (const link of allLinks) {
            if (processedLinks.has(link)) continue;
            
            processedLinks.add(link);
            console.log(`Processing: ${link}`);
            
            const jobDetails = await findContactInPost(link);
            
            if (jobDetails && !foundContacts.has(jobDetails.contact)) {
                foundContacts.add(jobDetails.contact);
                console.log('\n🎉 FOUND CONTACT NUMBER! 🎉');
                console.log('=== JOB DETAILS ===');
                console.log(`Title: ${jobDetails.title}`);
                console.log(`Company: ${jobDetails.company}`);
                console.log(`Contact: ${jobDetails.contact}`);
                console.log(`Link: ${jobDetails.link}`);
                console.log(`Found at: ${jobDetails.timestamp}`);
                console.log('===================\n');
                
                // You could add email/sms notification here
            }
        }

        console.log(`Cycle completed. Total links processed: ${processedLinks.size}`);
        console.log(`Total contacts found: ${foundContacts.size}`);

    } catch (error) {
        console.error('Error during scraping cycle:', error);
    }
}

async function runContinuousScraper() {
    console.log('Starting continuous job scraper...');
    console.log('Target: Node.js developer jobs with contact numbers');
    console.log('Platforms: Glassdoor, LinkedIn');
    console.log('============================================');

    // Initial run
    await runScraperCycle();

    // Run every 30 minutes continuously
    const interval = 30 * 60 * 1000; // 30 minutes
    
    setInterval(async () => {
        await runScraperCycle();
    }, interval);

    console.log(`Scraper will run every ${interval/60000} minutes`);
}

module.exports = { runContinuousScraper, runScraperCycle };