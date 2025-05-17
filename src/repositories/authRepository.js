import connection from "../database/mysqldb.js";

const AuthRepository = {
    async getAllUsers() {
        const sql = 'SELECT * FROM users_tb;';
        try {
            const [rows] = await connection.promise().execute(sql);
            return rows;
        } catch (error) {
            throw new Error(`Database query failed: ${error.message}`);
        }
    },
    async findUser(username, email){
        const sql = 'SELECT * FROM users_tb WHERE username = ? or email = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [username, email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Failed to check for existing user: ${error.message}`);
        }
    },
    async registerUser(user) {
        const sql = `
        INSERT INTO users_tb (username, password, email, first_name, last_name, date_created)
        VALUES (?, ?, ?, ?, ?, NOW());
    `;
        try {
            const [result] = await connection.promise().execute(sql, [
                user.username,
                user.password,
                user.email,
                user.first_name,
                user.last_name,
            ]);
            return { success: true, insertId: result.insertId };
        } catch (error) {
            throw new Error(`Failed to register user: ${error.message}`);
        }
    },
};

export default AuthRepository;