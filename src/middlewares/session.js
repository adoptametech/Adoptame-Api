import { token } from "morgan";
import { verifyToken } from "../helpers/handleJwt.js";
// import { checkJwt } from "./auth0.js";

//Middleware para cuando nos toque usar rutas protegidas para usuario normal y fundacion.
export const authMiddleware = async (req, res, next) => {
  const { authorization, auth0 } = req.headers;
  try {
    //Validations
    if(!authorization){
      return res.status(401).json({Error: "User not authenticate"})
    }
    const token = authorization.split(" ").pop();
    
    if (!auth0) {
   
      if (!authorization) {
        return res.status(401).send({ Error: "User not authenticate" });
      }

      const dataToken = await verifyToken(token);

      if (!dataToken) {
        return res.status(401).send({ Error: "TOKEN INVALID!!" });
      }
      return next();
    } else if (token.length >= 750) {
      return next();
    } else {
      return res.status(401).json({ error: "TOKEN AUTH0 INVALID" });
    }
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};
