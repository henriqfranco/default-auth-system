import express from 'express';
import cors from 'cors';
import routes from './routes/authRoutes.js';
import { config } from './config/config.js';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(routes)

app.listen(config.server.host, config.server.port, () => {
    console.log(`Server running at: http://${config.server.host}:${config.server.port}`);
});