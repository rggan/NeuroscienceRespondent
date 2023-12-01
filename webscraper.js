// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cors = require('cors');

import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5001;

// Endpoint to scrape articles
app.get('/articles', async (req, res) => {
    try {
        // Fetch the content of the website
        const response = await axios.get('https://neurosciencenews.com/neuroscience-topics/neuroscience/');
        // Load the website content into cheerio
        const $ = cheerio.load(response.data);
        // Initialize an array to collect articles
        const articles = [];

        // Select each article and extract details
        $('.block article').each((index, element) => {
            const title = $(element).find('h3.title a').text().trim();
            const link = $(element).find('h3.title a').attr('href');
            const summary = $(element).find('.excerpt').text().trim();
            const image = $(element).find('.mask-img img').attr('src');
            const date = $(element).find('.byline-part.date time').attr('datetime');
            const readTime = $(element).find('.byline-part.read-time').text().trim();
            const categories = $(element).find('.byline-part.cats a').map((i, el) => $(el).text().trim()).get();
          
            const articleData = {
              title,
              link,
              summary,
              image,
              date,
              readTime,
              categories
            };
          
            articles.push(articleData);
          });
        // Send the articles as a response
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while scraping articles', error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});