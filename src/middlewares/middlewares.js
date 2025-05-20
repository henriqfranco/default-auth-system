import AuthRepository from "../repositories/authRepository.js";
import { check, validationResult } from "express-validator";

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
    },
    validateLogin: [
        check('email')
            .isEmail()
            .withMessage('Invalid email format')
            .notEmpty()
            .withMessage('Email is required'),

        check('password')
            .notEmpty()
            .withMessage('Password is required'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    errors: errors.array().map(err => ({
                        field: err.param,
                        message: err.msg
                    }))
                });
            }
            next();
        }
    ]
}

export default Middlewares;