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
        const { username, password, email, first_name, last_name } = req.body;
        const errorMessages = [];

        if (!username) errorMessages.push("Username is required.");
        if (!password) errorMessages.push("Password is required.");
        if (!email) errorMessages.push("Email is required.");
        if (!first_name) errorMessages.push("First name is required.");
        if (!last_name) errorMessages.push("Last name is required.");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errorMessages.push("Invalid email format.");
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (password && !passwordRegex.test(password)) {
            errorMessages.push("Password must be at least 8 characters long and contain at least one number.");
        }

        if (errorMessages.length > 0) {
            return res.status(400).json({ errors: errorMessages });
        }

        try {
            const existingUser = await AuthRepository.findUser(username, email);
            if (existingUser) {
                return res.status(400).json({ error: "User with the same username or email already exists." })
            }

            const bcrypt = await import('bcrypt');
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await AuthRepository.registerUser({
                username,
                password: hashedPassword,
                email,
                first_name,
                last_name,
            });

            res.status(201).json({ message: "User registered successfully", userId: result.insertId });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "An internal server error occurred." });
        }
    },
};

export default AuthController;