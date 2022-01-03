import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors'; // Won't have to use next function for error handling
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@kjticketsproject/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); //ingress-nginx is the proxy
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
