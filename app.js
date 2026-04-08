const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'tasksdb';

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log('Connected to MongoDB');
}

app.get('/tasks', async (req, res) => {
  const tasks = await db.collection('tasks').find({}, { projection: { _id: 0 } }).toArray();
  res.json(tasks);
});

connectDB()
  .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch(err => { console.error('Failed to connect to MongoDB:', err); process.exit(1); });
