import { encrypt, compare } from "../helpers/handleBcrypt.js";
import { City } from "../models/City.js";
import { Country } from "../models/Country.js";
import { User } from "../models/User.js";
import { findAllUsers, findUserById } from "../models/Views/users.views.js";
import { deleteFile } from "../middlewares/cloudinary.js";
import { Solicitudes } from "../models/Solicitudes.js";
import { findCity } from "./petsController.js";

/// POST USER
export const createUser = async (req, res) => {
  // #swagger.tags = ['USER']
  const documentfile = req?.file ? req.file : {}
  const idfiles = req?.file ? req.file.filename.slice(req.file.filename.lastIndexOf("/") + 1) : {};
  const { data } = req.body;
  const infoUser = typeof data === "string" ? JSON.parse(req.body?.data) : req.body;
  try {
    const {
      name,
      lastName,
      password,
      email,
      active,
      verification,
      donaciones,
      countryId,
      cityId,
      address,
      phone,
      role,
      document,
      auth0,
      photo,
    } = infoUser;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user === null) {
      if (auth0) {
        const cityName = await findCity(cityId);
        const country = await Country.findByPk(countryId);
        const city = await City.findByPk(cityName[0].id);
        const passwordHash = await encrypt(password);
        const user = await User.create({
          name,
          lastName,
          password: passwordHash,
          email,
          active,
        });
        //password set in undefined for security
        user.set("password", undefined, { strict: false });
        user.setCountry(country);
        user.setCity(city);
        return res.json({
          message: "User Created Successfully!",
        });
      }
      const country = await Country.findByPk(countryId);
      const city = await City.findByPk(cityId);
      if (country && city) {
        //Hash of password.
        const passwordHash = await encrypt(password);
        switch (role) {
          case "fundation":
            const userFundation = await User.create({
              name,
              lastName,
              password: passwordHash,
              email,
              role,
              active: false,
              document: documentfile.path,
            });
            console.log(documentfile)
            //password set in undefined for security
            userFundation.set("password", undefined, { strict: false });
            userFundation.setCountry(country);
            userFundation.setCity(city);
            Solicitudes.create({
              userId: userFundation.id,
              solicitud: "Verificacion de documento"
            });
            return res.json({
              message:
                "User Created Successfully!, If you solicited a verification of fundation the state is pending",
            });

          case "admin":
            const userAdmin = await User.create({
              name,
              lastName,
              password: passwordHash,
              email,
              role,
            });
            //password set in undefined for security
            userAdmin.set("password", undefined, { strict: false });
            userAdmin.setCountry(country);
            userAdmin.setCity(city);
            return res.json({
              message: "Admin Created Successfully!",
            });
          default:
            const user = await User.create({
              name,
              lastName,
              password: passwordHash,
              email,
              active,
            });
            //password set in undefined for security
            user.set("password", undefined, { strict: false });
            user.setCountry(country);
            user.setCity(city);
            return res.json({
              message: "User Created Successfully!",
            });
        }
      }
      return res.status(404).json({ error: "City and Country is required " });
    } else {
      deleteFile(idfiles);
      return res.status(400).send(user);
    }
    // const data = {
    //   token: await tokenSing(userFundationCountry),
    //   user: userFundationCountry,
    // };
    // return res.send(data);
  } catch (error) {
    console.log(error);
    deleteFile(idfiles);
    return res.status(500).json({ error: error.message });
  }
};

/// GET USERS
export const getUser = async (req, res) => {
  // #swagger.tags = ['USER']
  /* #swagger.security = [{
    "apiKeyAuth": []
}] */
  try {
    const users = await findAllUsers();
    return res.send(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/// GET DETAILS USER
export const getDetailUser = async (req, res) => {
  // #swagger.tags = ['USER']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  try {
    const dataUser = await findUserById(id);
    return res.send(dataUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  // #swagger.tags = ['USER']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  const { password, newPassword, cityId, countryId } = req.body;
  const us = await User.findOne({
    where: {
      id,
    },
  });

  try {
    if (password && newPassword) {
      const checkPassword = await compare(password, us.password);
      if (checkPassword) {
        //Hash of password.
        const passwordHash = await encrypt(newPassword);
        await User.update(
          {
            password: passwordHash,
          },
          {
            where: {
              id,
            },
          }
        );

        return res.send({ Ok: "Password Updated Successfully!!" });
      } else {
        return res.status(401).json({
          error: "Password Incorrect, Please insert your actual password",
        });
      }
    }

    await User.update(req.body, {
      where: {
        id,
      },
    });

    const user = await findUserById(id);
    const dataUser = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      country: user.country,
      city: user.city,
      address: user.address,
      phone: user.phone,
      active: user.active,
    };

    return res.send(dataUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//PUT USER from admin
export const adminUpdateUser = async (req, res) => {
  // #swagger.tags = ['USER']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  const { name, lastName, role, address, phone, active } = req.body;
  console.log(req.body);
  try {
    await User.update(
      {
        name,
        lastName,
        role,
        address,
        phone,
        active,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(201).json({ message: "Updated!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//PUT solicitud from admin

export const updatesolicitud = async (req, res) => {
  // #swagger.tags = ['SOLICITUD']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  const { estado, fechafinaliza } = req.body;
  try {
    if (id) {
      await Solicitudes.update(
        {
          estado,
          fechafinaliza,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(201).json({ message: "State Updated!" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
