import { Match } from "../models/Match.js";
import { findAllPets } from "../models/Views/pets.views.js";

export const matchPet = async (req, res) => {
  // #swagger.tags = ['MATCH']
  const { userId } = req.params;
  const {
    age,
    coat,
    genre,
    haTenidoMascota,
    size,
    type
  } = req.body
  try {
    const verifMatch = await Match.findOne({ where: { userId: userId } })
    if (verifMatch) {
      return res.status(400).json({
        error: "Ya tienes un match",
      });
    } else {
      await Match.create({
        age,
        coat,
        genre,
        haTenidoMascota,
        size,
        type,
        userId: userId
      })
      return res.json({
        message: "Match Created Successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: error })
  }
}
export const PutMachUser = async (req, res) => {
  // #swagger.tags = ['MATCH']
  const { id } = req.params;
  const {
    age,
    coat,
    genre,
    haTenidoMascota,
    size,
    type,
  } = req.body
  try {
    await Match.update({
      age,
      coat,
      genre,
      haTenidoMascota,
      size,
      type,
    },
      {
        where: {
          userId: id
        }
      })
    return res.status(201).json({ message: "Match updated!" });
  } catch (error) {
    console.log(error)
  }
}
//DELETE DE MATCH PARA PRUEBA EN EL FRONT 
export const DeleteMatch = async (req, res) => {
  // #swagger.tags = ['MATCH']
  const { id } = req.params
  try {
    if (id) {
      const match = await Match.findOne({ where: { id: id } })
      if (!match) {
        return res.json({ message: "no se encotro el id de este match en la base de datos" })

      } else {
        await Match.destroy({
          where: {
            id: id
          }
        })
        return res.json({ message: "Match eliminado" })
      }
    }
  } catch (error) {
    return res.json({ message: error })
  }

}

export const getPetsMatch = async (req,res)=>{
  // #swagger.tags = ['MATCH']
  const {userId}=req.params;
  try {

    const match= await Match.findOne({where:{
      userId:userId
    }})
    if(match){
    const pets= await findAllPets();
    const filterPets=  pets.filter(p=> p.age===match.age && p.coat===match.coat && p.type===match.type
                                    || p.age===match.age && p.gender===match.genre && p.type===match.type
                                    || p.age===match.age && p.size===match.size && p.type===match.type
                                    || p.age===match.age && p.type===match.type
                                    || p.coat===match.coat && p.gender===match.genre && p.type===match.type
                                    || p.coat===match.coat && p.size===match.size  && p.type===match.type
                                    || p.coat===match.coat && p.type===match.type
                                    || p.size===match.size && p.gender===match.genre && p.type===match.type
                                    || p.size===match.size && p.type===match.type
                                    || p.gender===match.genre && p.type===match.type)
    res.send(filterPets)
    }else{
       res.status(404).json({error:"no se consigue matchs con tus preferencias"})
    }  
  } catch (error) {
    res.json({error:error})
    console.log(error)
  }
}
