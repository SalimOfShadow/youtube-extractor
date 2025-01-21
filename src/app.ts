import express from 'express';
import fetchRoutes from './routes/fetchRoutes';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 9300;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(express.json());
app.use('/api', fetchRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
