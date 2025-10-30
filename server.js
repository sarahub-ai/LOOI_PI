// Шаардлагатай програмуудыг дуудах
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // .env файлаас API key-г унших

const app = express();
const port = 3000; // Сервер 3000-р порт дээр ажиллана

// Шаардлагатай тохиргоог хийх
app.use(cors()); // Вэб хуудас (index.html)-аас ирсэн хүсэлтийг зөвшөөрөх
app.use(express.json()); // JSON хэлбэрээр мэдээлэл хүлээж авах

// OpenAI API key-г .env файлаас авах
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('АЛДАА: OPENAI_API_KEY олдсонгүй. .env файл үүсгэсэн эсэхээ шалгана уу.');
}

// '/chat' хаягаар хүсэлт ирэхэд юу хийхийг тодорхойлох
app.post('/chat', async (req, res) => {
    try {
        const userMessages = req.body.messages; // index.html-аас ирсэн мессежүүд

        if (!userMessages) {
            return res.status(400).json({ error: 'Мессеж олдсонгүй' });
        }

        // ChatGPT API руу хүсэлт явуулах
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: userMessages,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        // ChatGPT-н хариултыг авах
        const botResponse = response.data.choices[0].message.content;

        // Хариултыг index.html руу буцаах
        res.json({ response: botResponse });

    } catch (error) {
        console.error('API-н алдаа:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'ChatGPT API-тай холбогдоход алдаа гарлаа.' });
    }
});

// Серверийг ажиллуулах
app.listen(port, () => {
    console.log(`LOOI сервер http://localhost:${port} хаяг дээр ажиллаж эхэллээ.`);
});

