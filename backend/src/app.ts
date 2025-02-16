import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import imageRoutes from './routes/imageRoutes';

dotenv.config();

const app = express();
app.use(morgan('dev'));
const PORT = process.env.PORT || 3000;

app.use(cors());

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/images', imageRoutes);

app.use((err: Error | any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
  
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message
    });
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
