import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res) => {
    const {message} = req.body;
    const {expertise} = req.body;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:[
            {role: "system", content: `${expertise}`},
            {role: "user", content: `${message}`}
        ]
    })
    res.json({
        response: completion.choices[0].message
    })
});

app.listen(port, () =>{
    console.log('listening at port %s', port)
});