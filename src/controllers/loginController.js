import { User } from '../models/User.js';
export const loginUser = async (req, res) => {
try {
    const {email, password} = req.body;
    let busqueda = await User.findOne({
        where:{email:email}
    })
    if (!busqueda) {return res.status(400).json({msg: "the email is not registered"})}
    if (busqueda.password !== password) {return res.status(400).json({msg: "the password is incorrect"})}
    return res.json({msg: "successful login"})
} catch (error) {
    
}
}