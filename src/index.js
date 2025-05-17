import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes/authRoutes.js';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(routes)

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
    console.log(`Server running at: http://${host}:${port}`);
});