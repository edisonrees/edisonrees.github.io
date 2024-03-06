
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/money_counter';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Counter = mongoose.model('Counter', { value: Number });

app.use(express.json());

app.get('/counter', async (req, res) => {
  try {
    const counter = await Counter.findOne();
    res.json(counter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/counter', async (req, res) => {
  try {
    let counter = await Counter.findOne();
    if (!counter) {
      counter = new Counter({ value: req.body.value });
    } else {
      counter.value = req.body.value;
    }
    await counter.save();
    res.status(201).json(counter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
