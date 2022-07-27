import { Router } from "express";
import { prop, starts } from "../controllers/startController.js";
import { authMiddleware } from "../middlewares/session.js";
const router = Router();
router.post('/',authMiddleware, prop)
router.get('/:id', starts)
export default router;