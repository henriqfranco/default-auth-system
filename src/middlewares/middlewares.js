import AuthRepository from "../repositories/authRepository.js";

const Middlewares = {
    validateRegister: async (req, res, next) => {
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

        const existingUsername = await AuthRepository.findUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ error: "User with the same username already exists." })
        }

        const existingEmail = await AuthRepository.findUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: "User with the same email already exists." })
        }

        next();
    }
}

export default Middlewares;