
import {Router} from "express"
import { loginUser, registerUser, userLogout } from "../controllers/user.controller.js"
import { verifyUser } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyUser,userLogout)


export default router