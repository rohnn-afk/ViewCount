import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
})

export const UserModel = mongoose.model('User',UserSchema)

