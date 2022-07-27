import { User } from "../models/User.js";
//import jwt from "jsonwebtoken";
import { Coments } from "../models/comentsUser.js";

const understand = async (funId) => {
  const fundacion = await User.findByPk(funId);
  const comentsId = fundacion.comentario;
  const userName = async (id) => {
    
    let user = await User.findByPk(id)
     return `${user.dataValues.name} ${user.dataValues.lastName}`
  }
  const comen = async (id) => {
    let comentario = await Coments.findByPk(id);
    return comentario
  }
  const comentarios = await Promise.all(
      comentsId.map(async (coments) => {
        let DBcoment = await comen(coments);
        return {
          id : DBcoment.userId,
          name : await userName(DBcoment.userId),
          img : "linkImagenPerfilDelUsuario",
          coment : DBcoment.comentario,
          start: DBcoment.starts
        }
      })
      )
  return comentarios;
}

export const prop = async (req, res) => {
   /*
   #swagger.tags = ['COMENTS']
   #swagger.parameters['body'] = {
    in: 'body',
    schema: {
      msg:{coment: "comentario", point: "0-5"},
      id: "fundacionId",
      usId: "usuarioId"
    }
   }
   */
    const { id, userId  } = req.body
    const {msg} = req.body;

    const fund = await User.findOne({
        where: {
          id,
        },
      });
      //let tok = jwt.decode(token)
      //console.log(tok)
      try { 
      // if(!tok.id) {return res.status(400).json({error : "error de token"})}
        let coments = await understand(id);
        let comb = (usId) => {for (let i = 0; i < coments.length; i++) {
          const coment = coments[i];
          console.log(coment)
          if (coment.id == usId) {return true}
        }
        return false}
        console.log(coments)
        console.log(comb(userId))
        console.log(userId)
        console.log(1)
        console.log("1")
        if(comb(userId)) {return res.status(400).json({error : "esta cuenta ya ha comentado"})}
        const userComentId = await User.findByPk(userId);
        const createComent = await Coments.create(
            {
              comentario: msg.coment,
              starts: msg.point
            }
          );
        await createComent.setUser(userComentId);
        await User.update({
            comentario: [...fund.comentario, createComent.id]
        },
        {
            where: {id: id}
        }
        )
        await User.update(
            {
              starts: [...fund.starts, msg.point]
            },
            {
              where: {
                id,
              },
            }
          );


          return res.status(201).json({ msg: "comentario exitosa" });        
      } catch (error) {
        console.log(error)
        return res.status(400).json({error: "error de comentario"})
      }
}


export const starts = async (req, res) => {
  /* 
  #swagger.tags = ['COMENTS']
  */

    const { id } = req.params;
    const user = await User.findOne({
        where: {
          id,
        },
      });
    try {
       let commit = await understand(id);
        let point = user.starts;
        if (!point.length) {return res.status(400).json({error: "el usuario no ha sido calificado"})}
        let all = 0;
        for (let i = 0; i < point.length; i++) {
            all += point[i]
        }
        let prom = all / point.length;

        if (!Number.isInteger(prom)) {return res.status(201).json({ puntuacion: prom.toFixed(1), comentarios: commit})}

        return res.status(200).json({puntuacion: prom, comentarios: commit});
    } catch (error) {
        console.log(error)
        return res.status(400).json({erro: "error de promedio"})
    }
}