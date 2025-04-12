import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/UsersModel.js'

dotenv.config()

export const protect = async (req,res,next)=>{

    try {
        
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorised - token not provided" })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

        if(!decoded){
            return res.status(401).json({ success: false, message: "Unauthorised - Invalid token" })
        }

        const user = await UserModel.findById(decoded.id).select("-password")

        if(!user){
            return res.status(401).json({ success: false, message: "Unauthorised - User not found" })
        }

        req.user = user

        next()

    } catch (error) {
        return res.status(501).json({ success: false, message: "Server Error while authenticating",error:error.message })
    }


}