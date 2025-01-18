import express from 'express';
import fetchRoutes from './routes/fetchRoutes';
const app = express();
const PORT = process.env.PORT || 9300;

app.use(express.json());
app.use('/api', fetchRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
