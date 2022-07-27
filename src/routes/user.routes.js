import { Router } from "express";
//Import controllers
import {
  adminUpdateUser,
  createUser,
  getDetailUser,
  getUser,
  updatesolicitud,
  updateUser,
} from "../controllers/useRuteController.js";
import { body } from "express-validator";
//Middleware errores Express Validator.
import { validatorResultExpress } from "../middlewares/validatorResultExpress.js";
import { authMiddleware } from "../middlewares/session.js";
import { upload } from "../middlewares/cloudinary.js";
import { checkRole } from "../middlewares/validarAdmin.js";

// import { checkJwt } from "../middlewares/auth0.js";
// import { checkJwt, jwtCheck } from "../middlewares/auth0.js";

const router = Router();

router.post(
  "/",
  upload.single('document'),
  createUser
);

router.get("/users",authMiddleware, getUser);
router.get("/:id", authMiddleware, getDetailUser);
router.patch("/:id", authMiddleware, updateUser);
router.put("/:id", authMiddleware, checkRole(['admin']), adminUpdateUser);
router.put("/soli/:id", authMiddleware, checkRole(['admin']), updatesolicitud)



export default router;
