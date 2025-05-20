import { check, validationResult } from "express-validator";
import AuthRepository from "../repositories/authRepository.js";

const Middlewares = {
    validateRegister: [
        check("username").notEmpty().withMessage("Username is required."),
        check("password")
            .notEmpty().withMessage("Password is required.")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
            .matches(/\d/).withMessage("Password must contain at least one number."),
        check("email")
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("Invalid email format."),
        check("first_name").notEmpty().withMessage("First name is required."),
        check("last_name").notEmpty().withMessage("Last name is required."),

        check("username").custom(async (username) => {
            const existingUsername = await AuthRepository.findUserByUsername(username);
            if (existingUsername) {
                throw new Error("User with the same username already exists.");
            }
        }),
        check("email").custom(async (email) => {
            const existingEmail = await AuthRepository.findUserByEmail(email);
            if (existingEmail) {
                throw new Error("User with the same email already exists.");
            }
        }),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array().map(err => ({ field: err.param, message: err.msg })) });
            }
            next();
        }
    ],

    validateLogin: [
        check("email")
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("Invalid email format."),
        check("password").notEmpty().withMessage("Password is required."),

        check("email").custom(async (email) => {
            const existingEmail = await AuthRepository.findUserByEmail(email);
            if (!existingEmail) {
                throw new Error("Invalid email or password.");
            }
        }),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array().map(err => ({ field: err.param, message: err.msg })) });
            }
            next();
        }
    ]
};

export default Middlewares;