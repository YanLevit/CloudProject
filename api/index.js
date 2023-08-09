import express from 'express';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(8800, () => {
    console.log('Connected!');
});
