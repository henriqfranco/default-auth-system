import { Router } from "express";
import AuthController from "../controllers/authController.js";
import Middlewares from "../middlewares/middlewares.js";

const routes = Router();

routes.get('/', (req, res) => {
    res.status(200).json({message: "Default auth system."})
});

routes.get('/users', Middlewares.verifyToken, AuthController.getAllUsers);
routes.get('/user', Middlewares.verifyToken, AuthController.getCurrentUser);

routes.post('/register', Middlewares.validateRegister, AuthController.registerUser);
routes.post('/login', Middlewares.validateLogin, AuthController.login);
routes.post('/deactivate', Middlewares.verifyToken, AuthController.deactivateAccount);
routes.post('/reactivate', AuthController.reactivateAccount);

routes.delete('/account', Middlewares.verifyToken, AuthController.deleteAccount);

routes.patch('/username', Middlewares.verifyToken, AuthController.updateUsername);
routes.patch('/email', Middlewares.verifyToken, AuthController.updateEmail);
routes.patch('/fullname', Middlewares.verifyToken, AuthController.updateFullName);
routes.patch('/password', Middlewares.verifyToken, AuthController.updatePassword);

export default routes;