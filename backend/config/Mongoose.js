import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

export const mongooseConnect = () =>{

    mongoose.connect(process.env.MONGOOSE_URL)
    .then(()=>{console.log("database connected")})
    .catch((err)=>{console.log(err)})

}