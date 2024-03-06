const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a Redis client
const redisClient = redis.createClient({
  url: 'redis://red-cnk33j8l6cac73a23oqg:6379'
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route to handle counter updates
app.post('/counter', (req, res) => {
  const { value } = req.body;

  // Store the new counter value in Redis
  redisClient.set('counter', value, (err, reply) => {
    if (err) {
      console.error('Error setting counter in Redis:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    // If the counter is zero, set it to the last entry in Redis
    if (value == 0) {
      redisClient.get('lastEntry', (err, lastEntry) => {
        if (err) {
          console.error('Error getting last entry from Redis:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Set counter to the last entry
        redisClient.set('counter', lastEntry, (err, reply) => {
          if (err) {
            console.error('Error setting counter to last entry in Redis:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          return res.status(200).json({ message: 'Counter updated successfully' });
        });
      });
    } else {
      // Store the new value as the last entry
      redisClient.set('lastEntry', value, (err, reply) => {
        if (err) {
          console.error('Error setting last entry in Redis:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'Counter updated successfully' });
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
