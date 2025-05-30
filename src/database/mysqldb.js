import { createConnection } from "mysql2";
import { config } from "../config/config.js";

const connection = createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
});

export default connection;