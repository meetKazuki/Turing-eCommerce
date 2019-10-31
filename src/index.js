import '@babel/polyfill';
import { config } from 'dotenv';
import cors from 'cors';
import express from 'express';
import log from 'fancy-log';
import morgan from 'morgan';
import router from './routes';

config();

const app = express();
const corsOptions = {
  credentials: true,
  origin: [],
  optionsSuccessStatus: 200, // legacy browsers (IE11, various SmartTVs) choke on 204
};

if (
  process.env.NODE_ENV === 'development'
  || process.env.NODE_ENV === 'production'
) app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(router);

const port = process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(
    port, () => log(`Server is running on http://localhost:${port}`)
  );
}

export default app;
