import { User } from "../User.js";
import { Solicitudes } from "../Solicitudes.js";
import { Country } from "../Country.js";
import { City } from "../City.js";
import { Pets } from "../Pets.js";
import { Match } from "../Match.js";

export const findUserById = async (id) => {
  const user = await User.findByPk(
    id,
    { include: Pets },
    { include: Solicitudes },
    { include: Match }
  );
  if (user) {
    const pets = await Pets.findAll({ where: { userId: id } });
    const city = await City.findByPk(user.cityId);
    const country = await Country.findByPk(user.countryId);
    const soli = await Solicitudes.findAll({ where: { userId: id } });
    const macth = await Match.findOne({ where: { userId: id } });
    const dataUser = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      donaciones: user.donaciones,
      country: country.name,
      city: city.name,
      address: user.address,
      phone: user.phone,
      active: user.active,
      verification: user.verification,
      document: user.document,
      pets: pets.map((e) => e),
      solicitudes: soli.map((e) => e),
      match: macth,
    };

    return dataUser;
  } else {
    return { error: "User Not Found" };
  }
};

export const getCountry = async (id) => {
  const country = await Country.findByPk(id);
  return country.name;
};

export const getCity = async (id) => {
  const cityName = await City.findByPk(id);
  return cityName;
};

export const findAllUsers = async () => {
  const users = await User.findAll();
  const dataUsers = await Promise.all(
    users.map(async (user) => {
    
  
      return {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        active: user.active,
        verification: user.verification,
        donaciones: user.donaciones,
        address: user.address,
        phone: user.phone,
        document: user.document,
        photo: user.photo,
        starts: user.starts,
        comentario: user.comentario,
        points: user.points,
        country: await getCountry(user.countryId),
        city:  await getCity(user.cityId),
      };
    })
  );
  return dataUsers;
};
