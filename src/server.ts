import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import thoughtRoutes from './routes/thoughtRoutes';

dotenv.config();

const app = express();
app.use(express.json()); // Middleware for parsing JSON

const PORT = process.env.PORT || 3000;

// MongoDB connection
const mongoUri = process.env.MONGOD_URI;
if (!mongoUri) {
  throw new Error('MONGOD_URI is not defined in the environment variables');
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error(error));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);