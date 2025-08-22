# HR Contact Number Scraper 

## Overview
This project demonstrates my proficiency in **web scraping**, **automation**, and **Node.js development**. The HR Contact Number Scraper is designed to extract HR contact details from job-related websites, streamlining outreach efforts for recruitment, networking, or job applications.

Built using **Node.js** and **Puppeteer**, this scraper automates the process of navigating web pages, identifying relevant data, and exporting it in a structured format—saving hours of manual effort.

---

## 🔧 Technologies Used
- **Node.js** – Backend runtime environment
- **Puppeteer** – Headless browser automation
- **JavaScript** – Core scripting language
- **Git** – Version control

---


## 💼 Business Use Cases

This scraper isn't just a technical demo—it solves real problems across industries. Here’s how:

| Use Case                          | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| **Recruitment Automation**       | Reduces manual effort by auto-collecting HR contacts for outreach.          |
| **Lead Generation**              | Builds targeted contact lists for B2B sales and partnerships.               |
| **Talent Acquisition Platforms** | Connects job seekers directly with hiring managers via scraped data.        |
| **Market Research**              | Maps hiring trends by collecting HR contact data across industries.         |
| **CRM Enrichment**               | Populates CRM systems with verified HR contacts for better personalization. |

---

## 🚀 How It Works
1. Launches a headless browser session
2. Navigates to target job or company pages
3. Locates HR contact sections using DOM selectors
4. Extracts phone numbers, names, and emails (if available)
5. Outputs the data to the console or saves to a file

---


## 🧪 Setup & Run
```bash
# Clone the repo
git clone https://github.com/vkassingh/HR-Contact-number-Scraper.git

# Install dependencies
cd HR-Contact-number-Scraper
cd scraper
npm install

# Run the scraper
node scraper.js
