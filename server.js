const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = 'counter.txt';

// Express middleware
app.use(express.json());

// Routes
app.get('/counter', async (req, res) => {
    try {
        const counterValue = await readCounterFromFile();
        res.json({ value: counterValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/increment', async (req, res) => {
    try {
        let counterValue = await readCounterFromFile();
        counterValue = parseInt(counterValue) + 212;
        await writeCounterToFile(counterValue);
        res.json({ value: counterValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/decrement', async (req, res) => {
    try {
        const { amount } = req.body;
        let counterValue = await readCounterFromFile();
        counterValue -= amount;
        await writeCounterToFile(counterValue);
        res.json({ value: counterValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Utility functions
async function readCounterFromFile() {
    try {
        const counterValue = await fs.readFile(FILE_PATH, 'utf-8');
        return counterValue.trim();
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(FILE_PATH, '0');
            return '0';
        }
        throw error;
    }
}

async function writeCounterToFile(counterValue) {
    await fs.writeFile(FILE_PATH, counterValue.toString());
}

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
