import AuthRepository from "../repositories/authRepository.js";

const AuthController = {
    getAllUsers: async (req, res) => {
        try {
            const data = await AuthRepository.getAllUsers();
            if (data && data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ error: "No users found." });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "An internal server error occurred." });
        }
    },
    registerUser: async (req, res) => {
        try {
            const bcrypt = await import('bcrypt');
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const result = await AuthRepository.registerUser({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
            });

            res.status(201).json({ message: "User registered successfully", userId: result.insertId });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "An internal server error occurred." });
        }
    }
};

export default AuthController;