import dotenv from 'dotenv';

dotenv.config();

export const config = {
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRATION,
    },
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
    },
};

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}