import { Router } from "express";
import {
  getAllDonations,
  createDonation,
  getDonationsByUserId
} from "../controllers/donationController.js";
import {
  createPreferentialPayment,
  getPaymentById,
  getAllPayments
} from "../controllers/mercadoPagoController.js";

const router = Router();

router.post("/urlPreferential", createPreferentialPayment);

router.get("/mercadopago", getAllPayments);
router.get("/mercadopago/:idPayment", getPaymentById);

router.post("/", createDonation);
router.get("/", getAllDonations);
router.get("/:userId", getDonationsByUserId);

export default router;
