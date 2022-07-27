import { Router } from "express";
import { enviosolicitud, getproces } from "../controllers/adoptionController.js";


const router = Router();

router.get('/:petId/:userId/',getproces)
router.get('/sendSoli/:petId/:userId',enviosolicitud)



export default router;

