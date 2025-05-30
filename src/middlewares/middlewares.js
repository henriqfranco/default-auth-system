import { check, validationResult } from "express-validator";
import AuthRepository from "../repositories/authRepository.js";
import jwt from "jsonwebtoken";

const Middlewares = {
    validateRegister: [
        check("username")
            .notEmpty().withMessage("Username is required.")
            .trim()
            .escape()
            .isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters"),
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
    ],
    verifyToken: (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: "Access denied. No token provided.",
                });
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: "Access denied. Token is missing.",
                });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(401).json({
                            status: 401,
                            ok: false,
                            message: "Token has expired.",
                        });
                    }
                    if (err.name === "JsonWebTokenError") {
                        return res.status(401).json({
                            status: 401,
                            ok: false,
                            message: "Invalid token.",
                        });
                    }
                    return res.status(401).json({
                        status: 401,
                        ok: false,
                        message: "Token verification failed.",
                    });
                }

                req.user = decoded;
                next();
            });
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(500).json({
                status: 500,
                ok: false,
                message: "An internal server error occurred.",
            });
        }
    },
};

export default Middlewares;