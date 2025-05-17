import { Router } from "express";
import AuthController from "../controllers/authController.js";

const routes = Router();

routes.get('/', (req, res) => {
    res.status(200).json({message: "Default auth system."})
});

routes.get('/users', AuthController.getAllUsers);
routes.post('/register', AuthController.registerUser);

export default routes;