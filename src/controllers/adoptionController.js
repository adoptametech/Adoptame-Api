import { verifyToken } from "../helpers/handleJwt.js";
import { Pets } from "../models/Pets.js"
import { Solicitudes } from "../models/Solicitudes.js";
import { User } from "../models/User.js"
import { autoMail } from '../helpers/sendEmails.js';
import { Match } from "../models/Match.js";
export const getproces = async (req,res)=>{
  // #swagger.tags = ['ADOPTION']
    const{petId,userId}= req.params;
    const pet= await Pets.findByPk(petId)
    const UserData= await User.findByPk(userId);
    const match= await Match.findOne({where:{userId:UserData.id}})
    const array=[]
    try {
        if(match){
            const comparacion={
            pet:{
            age:pet.age,
            coat:pet.coat,
            genre:pet.gender,
            size:pet.size,
            type:pet.typeId
            },
            user:{
            age:match.age, 
            coat:match.coat,  
            genre:match.genre ,
            haTenidoMascota:match.haTenidoMascota, 
            size:match.size, 
            type:match.type
            }
        }
        const infouser= {
        name:UserData.name,
        email:UserData.email
      }
     array.push({
        petscompare: comparacion,
        userdata:infouser
    })
     return res.send(array)
     }else{
        const comparacion={
            pet:{
            age:pet.age,
            coat:pet.coat,
            genre:pet.gender,
            size:pet.size,
            type:pet.typeId

            }
        }
      const infouser= {
        name:UserData.name,
        email:UserData.email
      }
      array.push({
        petscompare: comparacion,
        userdata:infouser
    })
    return res.send(array)
     }
      
    } catch (error) {
        return res.json({error:error})
    }


}
export const enviosolicitud =async (req,res)=>{
  // #swagger.tags = ['ADOPTION']
    const{petId,userId}= req.params;
    const pet= await Pets.findByPk(petId)
    const UserData= await User.findByPk(userId);
    const UserOrfoundation= await User.findByPk(pet.userId)
try {
    Solicitudes.create({
        userId: UserData.id,
        solicitud:"Adopcion"
      });
       
       let url2 ="devtesting.vercel.app/pet-detail";
       let button ={text: `${pet.name}`, link: `http://${url2}/${petId}`};
       let header= `Adoptame`;
       let toMail= `${UserData.email}, ${UserOrfoundation.email}`;
       let subject= `Solicitud de adopcion `;
       let titulo= `${UserData.name} ha solicitado  el proceso de adopcion de ${pet.name} `;
       let mensaje= `Nombre: ${UserData.name}, Email: ${UserData.email}, Direccion: ${UserData.address}... Ha solicitado el proceso de adopcion de ${pet.name}`;

        autoMail(header,toMail,subject,titulo,mensaje,button);
        return res.json({message: "Se ha enviado su solicitud"})
} catch (error) {
    console.log(error)
    return res.json({ error:error })
}

}
