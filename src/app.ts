import express from 'express';
import fetchRoutes from './routes/fetchRoutes';
import cors from 'cors';
import * as dotenv from 'dotenv';
import https from 'https';
import * as fs from 'fs';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 9300;
const isDev = process.env.IS_DEV === 'true';

app.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/, 'https://washizaki.pro'],
  })
);

app.use(express.json());
app.use('/api', fetchRoutes);

if (isDev === true) {
  // Start Dev Server
  app.listen(PORT, () => {
    console.log('Dev App running on port 9300');
  });
} else {
  // Start HTTPS server
  const options = {
    key: fs.readFileSync('keys/privkey.pem'),
    cert: fs.readFileSync('keys/fullchain.pem'),
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log('HTTPS server running on port 9300');
  });
}
