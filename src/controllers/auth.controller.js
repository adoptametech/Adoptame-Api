import { User } from "../models/User.js";
import { compare } from "../helpers/handleBcrypt.js";
import { tokenSing } from "../helpers/handleJwt.js";

/**
 * Este controlador es para loguear a los usuarios.
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const login = async (req, res) => {
  /*
  #swagger.tags = ['LOGIN']
  #swagger.parameters['body'] = {
      in: 'body',
      description: 'Iniciar session para obtener token',
      schema: {
        email: "test_user_80178606@testuser.com",
        password: "Test18@@",
      }
  }
  */
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "lastName",
        "email",
        "role",
        "password",
        "verification",
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashPassword = user.password;
    const checkPassword = await compare(password, hashPassword);

    if (!checkPassword) {
      return res.status(401).send({ Error: "Password Incorrect" });
    }
    if (user.verification === false) {
      return res
        .status(401)
        .send({ Error: "Usuario no verificado, revise su email" });
    }

    user.set("password", undefined, { strict: false });

    const data = {
      token: await tokenSing(user),
      user,
    };
    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
