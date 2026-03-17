import express from 'express';
import database from './config/database.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());

import authRouter from './routers/auth.js';
import profileRouter from './routers/profile.js';
import requestRouter from './routers/request.js';
import userRouter from './routers/user.js';

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

database()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });


