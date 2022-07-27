import { autoMail } from "../helpers/sendEmails.js";
export const autoMails = (req, res) => {
    // #swagger.tags = ['SEND EMAIL']
    try {
        const {from, to, subject,titulo, info, button = false} =req.body;
        autoMail(from, to, subject,titulo, info, button)
        return res.status(200).json({msg:"send email"})
        
    } catch (error) {
        console.log(error)
        return res.json({msg: "no send email"})
    }
}