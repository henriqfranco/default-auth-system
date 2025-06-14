import express from 'express';
import cors from 'cors';
import routes from './routes/authRoutes.js';
import { config } from './config/config.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(routes)

app.listen(config.server.port, config.server.host, () => {
    console.log(`Server running at: http://${config.server.host}:${config.server.port}`);
});