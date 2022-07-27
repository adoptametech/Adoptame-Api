import { findAllFundations } from "../models/Views/fundations.views.js";

export const getFundations = async (req, res) => {
  // #swagger.tags = ['USER']
  try {
    const fundations = await findAllFundations();
    return res.send(fundations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
