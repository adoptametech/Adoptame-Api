import { User } from "../User.js";
import { getCity, getCountry } from "./users.views.js";

export const findAllFundations = async () => {
  const fundations = await User.findAll({
    where: {
      role: "fundation",
    },
  });
  const fundationsData = await Promise.all(
    fundations.map(async (fundation) => {
      return {
        id: fundation.id,
        name: fundation.name,
        lastName: fundation.lastName,
        email: fundation.email,
        role: fundation.role,
        active: fundation.active,
        verification: fundation.verification,
        donaciones: fundation.donaciones,
        address: fundation.address,
        phone: fundation.phone,
        document: fundation.document,
        photo: fundation.photo,
        stars: fundation.starts,
        country: await getCountry(fundation.countryId),
        city: await getCity(fundation.cityId),
      };
    })
  );
  return fundationsData;
};
