import { Router } from "express";
import { register, login, profile, getOnlinePeople, logout } from "../controllers/authControllers.js";
import requireUserToken from "../middlewares/requireUserToken.js";

const router = Router();

router.get("/profile", requireUserToken, profile);
router.get("/people", requireUserToken, getOnlinePeople)
router.post("/login", login);
router.post("/logout", logout)
router.post("/register", register);

export default router;
