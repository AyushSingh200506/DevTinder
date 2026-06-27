import express from 'express';
import database from './config/database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

import authRouter from './routers/auth.js';
import profileRouter from './routers/profile.js';
import requestRouter from './routers/request.js';
import userRouter from './routers/user.js';

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

let isDatabaseConnected = false;

const connectDatabase = async () => {
  if (isDatabaseConnected) return;

  try {
    await database();
    isDatabaseConnected = true;
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

connectDatabase();

if (!process.env.VERCEL) {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

export default app;

