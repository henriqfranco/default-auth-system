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
    async findUserByUsername(username) {
        const sql = 'SELECT * FROM users_tb WHERE username = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [username]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Failed to check for existing user: ${error.message}`);
        }
    },
    async findUserByEmail(email) {
        const sql = `SELECT * FROM users_tb WHERE email = ?;`;
        try {
            const [rows] = await connection.promise().execute(sql, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Failed to check for existing email: ${error.message}`);
        }
    },
    async findUserByID(user_id) {
        const sql = `SELECT * FROM users_tb WHERE user_id = ?;`;
        try {
            const [rows] = await connection.promise().execute(sql, [user_id]);
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
    async deleteUserByID(id) {
        const sql = 'DELETE FROM users_tb WHERE user_id = ?;';
        try {
            const [result] = await connection.promise().execute(sql, [id]);
            return result;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`)
        }
    },
    async updateUsernameByID(id, newUsername) {
        const sql = 'UPDATE users_tb SET username = ? WHERE user_id = ?;';
        try {
            const [result] = await connection.promise().execute(sql, [newUsername, id]);
            return result;
        } catch (error) {
            throw new Error(`Error updating username: ${error.message}`);
        }
    },
}

export default AuthRepository;