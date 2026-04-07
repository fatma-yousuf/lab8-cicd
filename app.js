
cat > app.js << 'EOF'
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

  // Seed if empty
  const count = await db.collection('tasks').countDocuments();
  if (count === 0) {
    await db.collection('tasks').insertMany([
      { id: 1, name: 'Buy groceries', status: 'pending' },
      { id: 2, name: 'Walk the dog', status: 'done' },
      { id: 3, name: 'Read a book', status: 'pending' },
      { id: 4, name: 'Write report', status: 'done' },
      { id: 5, name: 'Clean house', status: 'pending' },
      { id: 6, name: 'Cook dinner', status: 'done' },
      { id: 7, name: 'Tea', status: 'pending' },
      { id: 7, name: 'Tea', status: 'pending' }
    ]);
    console.log('Database seeded');
  }
}

app.get('/tasks', async (req, res) => {
  const tasks = await db.collection('tasks').find({}, { projection: { _id: 0 } }).toArray();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = req.body;
  await db.collection('tasks').insertOne(task);
  res.status(201).json(task);
});

connectDB().then(() => {
  app.listen(3000, () => console.log('App running on port 3000'));
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
EOF
