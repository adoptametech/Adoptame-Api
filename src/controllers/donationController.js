import { Donations } from '../models/Donations.js';
import { autoEmail } from '../helpers/sendEmails.js';
import { getPaymentByIdService, getPaymentsService } from '../services/PaymentService.js';
import { findDonationByUserId, findAllDonations } from '../models/Views/donations.views.js';

const updateStateAndSendEmail = async () => {
  try {
    const paymentsMercadoPago = await getPaymentsService();

    paymentsMercadoPago.forEach(pay => {
      console.log(pay.id);
    });

    const foundationDonations = await Donations.findAll({
      attributes: ["idPaymentMercadoPago", "status", "id"]
    })

    const updateStatusDonations = foundationDonations.map((donation) => {

      const paymentMercadoPago = paymentsMercadoPago.find(payment => payment.id == donation.idPaymentMercadoPago)

      console.log('paymentMercadoPago: ', paymentMercadoPago);

      const {
        id, // idPaymentMercadoPago
        metadata,
        status,
        status_detail,
        fee_details,
        transaction_details,
        currency_id,
      } = paymentMercadoPago;

      const { from_user, to_user } = metadata;

      if (donation.status !== status) {

        const newDonation = {
          approved: async () => {
            let mailDetail = {
              header: `Adoptame`,
              toMail: to_user.email,
              subject: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
              titulo: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
              mensaje: `Para la fundación: ${to_user.name}`,
            }
            autoEmail(mailDetail)
            return Donations.update({
              status,
              status_detail,
              comision_amount: fee_details[0]?.amount ?? 0,
              acredit_amount: transaction_details.net_received_amount,
              total_amount: transaction_details.total_paid_amount,
              currency: currency_id
            }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
            })
          },
          in_process: async () => {
            return Donations.update({ status }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
            })
          },
          rejected: async () => {
            return Donations.update({ status }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
            })
          },
          default: () => {
            return Donations.update({ status }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
            })
          }
        }
        return newDonation[status]() || newDonation.default();
      }
    });
    await Promise.all(updateStatusDonations);
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

export const createDonation = async (req, res) => {
  // #swagger.tags = ['DONATION']
  try {
    const { data } = req.body;
    const payment = await getPaymentByIdService(data.id);
    if (payment) {
      const {
        id, // idPaymentMercadoPago
        metadata,
        status,
        status_detail,
        fee_details,
        transaction_details,
        currency_id,
      } = payment;

      const { from_user, to_user, } = metadata;

      const infoPayment = {
        idPaymentMercadoPago: id.toString(),
        fromUserId: from_user.id,
        toUserId: to_user.id,
        status,
        status_detail,
        comision_amount: fee_details[0]?.amount ?? 0,
        acredit_amount: transaction_details.net_received_amount,
        total_amount: transaction_details.total_paid_amount,
        currency: currency_id
      }

      let mailDetail = {
        header: `Adoptame`,
        toMail: to_user.email,
        subject: `${from_user.name} te ha donado ${infoPayment.acredit_amount} ${currency_id}`,
        titulo: `${from_user.name} te ha donado ${infoPayment.acredit_amount} ${currency_id} `,
        mensaje: `Para la fundación: ${to_user.name}`,
      }

      const newDonation = {
        approved: () => {
          autoEmail(mailDetail)
          return res.status(201).json({ message: "successfully donated" })
        },
        in_process: () => res.status(201).json({ message: "pending donation" }),
        rejected: () => res.status(201).json({ message: "donation rejected" }),
        default: () => res.status(201).json({ error: "error" })
      }
      await Donations.create(infoPayment)
      return newDonation[status]() || newDonation.default
    }
    return res.status(400).json({ data: req.body });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

export const getDonationsByUserId = async (req, res) => {
  // #swagger.tags = ['DONATION']
  try {
    const { userId } = req.params;

    await updateStateAndSendEmail();

    const donationsByUser = await findDonationByUserId(userId);

    return res.status(200).json(donationsByUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

export const getAllDonations = async (req, res) => {
  // #swagger.tags = ['DONATION']
  try {
    await updateStateAndSendEmail();

    const allDonations = await findAllDonations();

    return res.status(200).json(allDonations);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}
