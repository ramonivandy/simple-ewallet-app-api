import { Router } from "express";
import { createUser, dashboard } from "../controllers/users/userController"
import { login } from "../controllers/auth/authController"
import { authMiddleware } from "../middleware/authMiddleware";

const userRoute = Router();

userRoute.post('/createUser', createUser)
userRoute.post('/login', login)

userRoute.get('/dashboard', authMiddleware, dashboard)

export default userRoute