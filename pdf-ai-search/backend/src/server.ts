import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoute from './routes/upload';
import askRoute from './routes/ask';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRoute);
app.use('/api/ask', askRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
