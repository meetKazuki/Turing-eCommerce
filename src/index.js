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
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const { NODE_ENV, PORT } = process.env;
if (NODE_ENV === 'development' || NODE_ENV === 'production') {
  app.use(morgan('dev'));
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(router);

const port = NODE_ENV === 'test' ? 8378 : PORT || 3000;

if (NODE_ENV !== 'test') {
  app.listen(port, () => log(`Server is running on http://localhost:${port}`));
}

/* export const server = app.listen(port, () => {
  log(`Server is running on http://localhost:${port}`);
}); */

export default app;
