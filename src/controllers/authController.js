import AuthRepository from "../repositories/authRepository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";

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
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    getCurrentUser: async (req, res) => {
        try {
            const userID = req.user.id;

            const data = await AuthRepository.getCurrentUserInfo(userID);
            if (data && data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ error: "No users found." });
            }
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const getUser = await AuthRepository.findUserByEmail(email);

            if (!getUser) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Invalid email or password.",
                });
            }

            if (!getUser.user_status) {
                return res.status(403).json({
                    status: 403,
                    ok: false,
                    message: "Account is deactivated. Please reactivate your account.",
                });
            }

            const isPasswordValid = await bcrypt.compare(password, getUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: "Invalid email or password.",
                });
            }

            await AuthRepository.updateLastLogin(getUser.user_id);

            const token = jwt.sign(
                { id: getUser.user_id, username: getUser.username },
                config.jwt.secret,
                { expiresIn: config.jwt.expiration }
            );

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Authorized Access.",
                token: token,
                user: { id: getUser.user_id, username: getUser.username },
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    registerUser: async (req, res) => {
        try {
            const { username, email } = req.body;

            const checkUsername = await AuthRepository.findUserByUsername(username);
            if (checkUsername) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "User with the same username already exists.",
                });
            }

            const checkEmail = await AuthRepository.findUserByEmail(email);
            if (checkEmail) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "User with the same email already exists.",
                });
            }

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
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    deleteAccount: async (req, res) => {
        try {
            const { password } = req.body;
            const userID = req.user.id;

            const user = await AuthRepository.findUserByID(userID);
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: "User not found.",
                });
            }
            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: "Invalid password."
                });
            }

            await AuthRepository.deleteUserByID(userID);

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Account deleted successfully.",
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    deactivateAccount: async (req, res) => {
        try {
            const { password } = req.body;
            const userID = req.user.id;

            const user = await AuthRepository.findUserByID(userID);
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: "User not found.",
                });
            }

            if (!user.user_status) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Account is already deactivated.",
                });
            }

            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: "Invalid password."
                });
            }

            await AuthRepository.deactivateUserById(userID);

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Account deactivated successfully.",
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    reactivateAccount: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await AuthRepository.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: "Invalid email or password.",
                });
            }
            if (user.user_status === 1) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Account is already active.",
                });
            }
            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: "Invalid password."
                });
            }

            await AuthRepository.reactivateUserByEmail(email);

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Account reactivated successfully.",
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    updateUsername: async (req, res) => {
        try {
            const { newUsername } = req.body;
            const userID = req.user.id;

            const currentUser = await AuthRepository.findUserByID(userID);
            if (newUsername === currentUser.username) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted username is the same as the current one.",
                });
            }

            const existingUser = await AuthRepository.findUserByUsername(newUsername);
            if (existingUser) {
                return res.status(409).json({
                    status: 409,
                    ok: false,
                    message: "Username is already taken.",
                });
            }

            await AuthRepository.updateUsernameByID(userID, newUsername);

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Username updated successfully.",
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const { newPassword } = req.body;
            const userID = req.user.id;

            if (!newPassword || newPassword.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Password cannot be empty.",
                });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Password must be at least 8 characters long.",
                });
            }

            if (!/\d/.test(newPassword)) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Password must contain at least one number.",
                });
            }

            const currentUser = await AuthRepository.findUserByID(userID);
            if (!currentUser) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: "User not found.",
                });
            }

            const isSamePassword = await bcrypt.compare(newPassword, currentUser.password);
            if (isSamePassword) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "You cannot use the same password as your current one.",
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await AuthRepository.updatePasswordByID(userID, hashedPassword);

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Password updated successfully.",
                token: null,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    updateEmail: async (req, res) => {
        try {
            const { currentEmail, newEmail } = req.body;
            const userID = req.user.id;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(currentEmail)) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Invalid email format.",
                });
            }
            if (!emailRegex.test(newEmail)) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Invalid email format.",
                });
            }

            const oldEmail = await AuthRepository.findUserByEmail(currentEmail);
            if (!oldEmail) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Current email confirmation required.",
                });
            }

            const currentUser = await AuthRepository.findUserByID(userID);
            if (newEmail === currentUser.email) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted email is the same as the current one.",
                });
            }

            const existingUser = await AuthRepository.findUserByEmail(newEmail);
            if (existingUser) {
                return res.status(409).json({
                    status: 409,
                    ok: false,
                    message: "An account with this email is already registered.",
                });
            }

            await AuthRepository.updateEmailByID(userID, newEmail);

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Email updated successfully.",
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    updateFullName: async (req, res) => {
        try {
            const { newFirstName, newLastName } = req.body;
            const userID = req.user.id;

            if (!newFirstName && !newLastName) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "At least one of newFirstName or newLastName must be provided.",
                });
            }

            const currentUser = await AuthRepository.findUserByID(userID);

            if (!currentUser) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: "User not found.",
                });
            }

            if (newFirstName === currentUser.first_name) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted first name is the same as the current one.",
                });
            }

            if (newLastName === currentUser.last_name) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted last name is the same as the current one.",
                });
            }

            await AuthRepository.updateFullName(userID, newFirstName, newLastName);

            return res.status(200).json({
                status: 200,
                ok: true,
                message: "Name updated successfully.",
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
};

export default AuthController;