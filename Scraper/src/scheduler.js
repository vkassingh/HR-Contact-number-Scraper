const { getJobPostLinks ,findContactInPost } = require('./services/scraper')

async function runScraperTask() {

    console.log('Starting job search ')
    //scrape indeed
    const indeedLinks = await getJobPostLinks( 
            'https://www.indeed.com/jobs?q=nodejs+developer',
    'a.jcs-JobTitle'
    )

    //scrape glassdoor
    const glassDoorLinks = await getJobPostLinks(
         'https://www.glassdoor.com/Job/nodejs-developer-jobs-SRCH_KO0,16.htm',
    'a.jobLink'
    )

    //combine links
    const allLinks = [...indeedLinks, ...glassDoorLinks]
    console.log(`checking a total of ${allLinks.length} links`)

    //iterate through each link, pass each link to 2nd method that returns the contct nubmer
    for ( const link of allLinks ){
        const jobDetails = await findContactInPost( link)
        if( jobDetails){
            console.log('found the contact no.')
            console.log('contact details',  jobDetails)
            break;
        }
    }

}

module.exports = { runScraperTask }