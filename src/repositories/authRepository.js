import connection from "../database/mysqldb.js";

const AuthRepository = {
    async getAllUsers() {
        const sql = 'SELECT user_id, username, email, first_name, last_name, date_created, last_login, user_role, user_status FROM users_tb;';
        try {
            const [rows] = await connection.promise().execute(sql);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Database query failed: ${error.message}`);
        }
    },
    async findUserByUsername(username) {
        const sql = 'SELECT username FROM users_tb WHERE username = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [username]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Failed to check for existing user: ${error.message}`);
        }
    },
    async findUserByEmail(email) {
        const sql = `SELECT user_id, email, password, user_status FROM users_tb WHERE email = ?;`;
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
            const [rows] = await connection.promise().execute(sql, [
                user.username,
                user.password,
                user.email,
                user.first_name,
                user.last_name,
            ]);
            return { success: true, insertId: rows.insertId };
        } catch (error) {
            throw new Error(`Failed to register user: ${error.message}`);
        }
    },
    async deleteUserByID(id) {
        const sql = 'DELETE FROM users_tb WHERE user_id = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`)
        }
    },
    async updateUsernameByID(id, newUsername) {
        const sql = 'UPDATE users_tb SET username = ? WHERE user_id = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [newUsername, id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error updating username: ${error.message}`);
        }
    },
    async updateEmailByID(id, newEmail) {
        const sql = 'UPDATE users_tb SET email = ? WHERE user_id = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [newEmail, id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error updating username: ${error.message}`);
        }
    },
    async updateLastLogin(id) {
        const sql = 'UPDATE users_tb SET last_login = NOW() WHERE user_id = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error updating last login date: ${error.message}`);
        }
    },
    async updateFullName(id, firstName = null, lastName = null) {
        let sql = 'UPDATE users_tb SET ';
        const params = [];

        if (firstName !== null) {
            sql += 'first_name = ?';
            params.push(firstName);
        }

        if (lastName !== null) {
            if (params.length > 0) sql += ', ';
            sql += 'last_name = ?';
            params.push(lastName);
        }

        sql += ' WHERE user_id = ?;';
        params.push(id);

        try {
            const [rows] = await connection.promise().execute(sql, params);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error updating full name: ${error.message}`);
        }
    },
    async updatePasswordByID(id, newPassword) {
        const sql = 'UPDATE users_tb SET password = ? WHERE user_id = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [newPassword, id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error updating password: ${error.message}`);
        }
    },
    async deactivateUserById(id) {
        const sql = 'UPDATE users_tb SET user_status = 0 WHERE user_id = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error deactivating account: ${error.message}`);
        }
    },
    async reactivateUserByEmail(email) {
        const sql = 'UPDATE users_tb SET user_status = 1 WHERE email = ?;';
        try {
            const [rows] = await connection.promise().execute(sql, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error(`Error reactivating account: ${error.message}`);
        }
    },
    async isAccountActivated(id){
        const sql = 'SELECT user_status FROM users_tb WHERE user_id = ?;';
        try{
            const [rows] = await connection.promise().execute(sql, [id]);
            return rows.length > 0 ? rows[0].user_status : null;
        } catch (error) {
            throw new Error(`Error checking user status: ${error.message}`);
        }
    },
}

export default AuthRepository;