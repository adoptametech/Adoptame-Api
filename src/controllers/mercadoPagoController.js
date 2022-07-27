import { Country } from '../models/Country.js';
import {
  newPreferentialPaymentService,
  getPaymentByIdService,
  getPaymentsService,
} from "../services/PaymentService.js";

export const createPreferentialPayment = async (req, res) => {
  // #swagger.tags = ['MERCADOPAGO']
  try {
    const {
      items,
      payer,
      metadata
    } = req.body;

    // const currency = await Country.findByPk(metadata.fromUser.country);
    const country = await Country.findOne({
      where: {
        name: metadata.fromUser.country
      }
    })
    const body = {
      items: items.map(item => {
        return {
          ...item,
          currency_id: country?.currency ?? "ARS" // Por defecto
        }
      }),
      payer,
      metadata
    };
    console.log('data Preferential: ', body);
    const urlPreferentialPayment = await newPreferentialPaymentService(body);
    return res.status(201).json({
      urlPreferentialPayment,
      message: "preferential payment url generated successfully"
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, msg: "Failed to create payment" });
  }
}

export const getAllPayments = async (req, res) => {
  // #swagger.tags = ['MERCADOPAGO']
  try {
    const payments = await getPaymentsService();
    return res.json(payments);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, msg: "Failed to get payments" });
  }
}

export const getPaymentById = async (req, res) => {
  // #swagger.tags = ['MERCADOPAGO']
  try {
    const { idPayment } = req.params;
    const payments = await getPaymentByIdService(idPayment);
    return res.json(payments);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, msg: "Failed to get payment" });
  }
}