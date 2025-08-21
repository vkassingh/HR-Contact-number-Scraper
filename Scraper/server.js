const express = require('express');
const dotenv = require('dotenv');
const { runScraperTask } = require('./src/scheduler.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Job scraper running");
});

app.listen(PORT, () => {
    console.log("server runs");
});

runScraperTask();