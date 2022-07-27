import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { encrypt } from "../helpers/handleBcrypt.js";
import { autoMail } from "../helpers/sendEmails.js";
const { ULR_DEPLOYED_FRONTEND, JWT_SECRET } = process.env;
const url = ULR_DEPLOYED_FRONTEND || "localhost:5000";



export const veriEmail = async (req, res) => {
    // #swagger.tags = ['VERIFY']
    try {
      const {email} = req.body;
      let busqueda = await User.findOne({
          where:{email:email}
        })
        if (!busqueda) {return res.status(400).json({error: "the email is not registered"})}
        if (busqueda.verification) {return res.status(400).json({error: "the email not required verification"})}
        if (!(busqueda.verification)) {

           //let token = tokenSing(user);
            let token = jwt.sign(
                {
                    id: busqueda.id,
                },
                JWT_SECRET,
                {
                    expiresIn: 900,
                }
                ); 

                //let url2 ="adoptame.vercel.app"
                let button ={text: "confirmacion de correo", link: `${url}/email-confirmed/api/v1.0/verify/tk/${token}`}
                let info = "Te has registrado exitosamente en adoptaMe, por favor confirma tu correo abajo"
                let from = "Verification email";
                let to = email;
                let titulo = "verificacion de correo electronico"

                autoMail(from, to, from,titulo, info, button)
                
                
                return res.status(200).json({msg: "send email"})
        }


} catch (error) {
    console.log(error)
}
}

export const logVerify = async (req, res) => {
    // #swagger.tags = ['VERIFY']
    try {
        const {tok} =req.params;
        let info = jwt.decode(tok);
        console.log(info)
        let busqueda = await User.findOne({
            where:{id:info.id}
          })
        
          if (!busqueda) {return res.json({error: "verification fail"})}

          await User.update({verification: true}, {where: {id: info.id}})

          return res.json({msg: "verified email"})
         
    } catch (error) {
        console.log(error)
        return res.json({error: "verification fail"})
    }
}
export const petiPass = async (req, res) => {
    // #swagger.tags = ['VERIFY']
    try {
        const {email} = req.body;
      let busqueda = await User.findOne({
          where:{email:email}
        })
        if (!busqueda) {return res.status(400).json({error: "the email is not registered"})}
        
        // let token = tokenSing(busqueda)
        let token = jwt.sign(
            {
                id: busqueda.id,
            },
            JWT_SECRET,
            {
                expiresIn: 900,
            }
            );
            //let button ={text: "recuperar contraseña", link: `http://${url}/api/v1.0/verify/modpass/${token}`}
            let url2= "adoptame.vercel.app/reset/confirm"
            let button ={text: "recuperar contraseña", link: `http://${url2}/api/v1.0/verify/modpass/${token}`}
            let info = "has solicitado una recuperacion de contraseña, si no lo hiciste ignora este mensaje"
            let from = "password recovery";
            let to = email;
            let titulo = "recuperacion de contraseña"

            autoMail(from, to, from,titulo, info, button)

            return res.json({msg: "send email"})
        
    } catch (error) {
        console.log(error)
        return res.json({error: "verification fail"})
    }
}
export const recuperated = async (req, res) => {
    // #swagger.tags = ['VERIFY']
    try {
        const {tak} = req.params;
        const {password1, password2} = req.body;
        let info = jwt.decode(tak)
        let busqueda = await User.findOne({
            where:{id:info.id}
          })
        if (!busqueda) {return res.status(400).json({error: "verification fail"})}
        if (password1!==password2) {return res.status(400).json({error: "the password does not match"})}
        let passwordHash = await encrypt(password1);
        await User.update({password: passwordHash}, {where: {id: info.id}})
        return res.status(200).json({msg: "updated password"})
        
        
    } catch (error) {
        console.log(error)
        return res.json({error: "verification fail"})
    }
}
