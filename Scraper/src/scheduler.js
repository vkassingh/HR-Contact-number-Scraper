const { getJobPostLinks, findContactInPost } = require('./services/scraper');

async function runScraperTask() {
    console.log('Starting job search for Node.js developers in Noida & Gurugram...');

    try {
        const indeedLinks = await getJobPostLinks( 
            'https://www.indeed.com/jobs?q=nodejs+developer',
    'a.jcs-JobTitle'
    )
     
        
        // Combine all arrays of links into a single, flat array
        const allLinks = [
            ...(indeedLinks || []), 
          
        ];

        console.log(`Checking a total of ${allLinks.length} links.`);
        console.log(allLinks)

        // Iterate through each individual link to find a contact number
        for (const link of allLinks) {
            const jobDetails = await findContactInPost(link);
            if (jobDetails) {
                console.log('Found a contact number!');
                console.log('Contact Details:', jobDetails);
                // Removed `break` to check all links, but you can add it back if you want to stop after the first find.
                // break; 
            }
        }
        
    } catch (error) {
        console.error('An error occurred during the scraping task:', error);
    }
}

module.exports = { runScraperTask };