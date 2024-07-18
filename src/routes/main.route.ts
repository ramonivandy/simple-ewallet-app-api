import { Router } from "express";
import { createUser, dashboard, updateBalance } from "../controllers/users/userController"
import { login } from "../controllers/auth/authController"
import { authMiddleware } from "../middleware/authMiddleware";

const userRoute = Router();

userRoute.post('/api/createUser', createUser)
userRoute.post('/api/login', login)

userRoute.get('/api/dashboard', authMiddleware, dashboard)
userRoute.put('/api/update-balance', authMiddleware, updateBalance)

export default userRoute