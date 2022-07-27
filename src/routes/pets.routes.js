import { Router } from "express";
import { upload } from "../middlewares/cloudinary.js";
import { authMiddleware } from "../middlewares/session.js";
import favouritePet from "./favouritePet.routes.js";
import petsDataFake from "./petsDataFake.routes.js";

import {
  getAllPets,
  getPetsById,
  getPetsByIdUser,
  getPetsFoundation,
  createPets,
  updatePets,
  changeStatusPets,
} from "../controllers/petsController.js";

const router = Router();

router.use('/favourite', favouritePet)
router.use('/addPets', petsDataFake);

router.get("/", getAllPets);
router.get("/foundation", getPetsFoundation);
router.get("/user/:userId", getPetsByIdUser);
router.get("/:petId", getPetsById);

router.post("/", authMiddleware, upload.array("photos"), createPets);
router.put("/:petId", authMiddleware, upload.array("photos"), updatePets);
router.patch("/:petId", authMiddleware, changeStatusPets);

export default router;
