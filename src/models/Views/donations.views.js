import { Donations } from '../../models/Donations.js';

export const findAllDonations = async () => {
  const allDonations = await Donations.findAll({
    attributes: { exclude: ['idPaymentMercadoPago', 'status_detail'] },
    raw: true
  })

  let nameStatus = {
    approved: "aprobado",
    in_process: "pendiente",
    rejected: "rechazado"
  }

  return allDonations.map(donation => {
    donation.status = nameStatus[donation.status]
    return donation
  })
}

export const findDonationByUserId = async (userId) => {
  const allDonations = await findAllDonations();
  return allDonations.filter(donation => donation.toUserId == userId)
}
