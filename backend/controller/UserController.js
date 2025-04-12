import { UserModel } from "../models/UsersModel.js"
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { generateToken } from "../middleware/TokenMaker.js"

export const registerUser = async (req,res)=>{

    try {
        const {name,email,password} = req.body

        if(!name || !email || !password){
            return res.status(404).json({success:false,message:'enter complete fields'})
        }

        const alreadyExists = await UserModel.findOne({email})
        if(alreadyExists){
            return res.status(404).json({success:false, message: 'User exists' })
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:'email is invalid'})
        }
        
        if(password.length < 9){
            return res.status(400).json({success:false,message:'password too weak'})
        }


        const salt = await bcrypt.genSalt(12)
        const hashedPass = await bcrypt.hash(password,salt)

        const newUser = new UserModel({
            name,
            email,
            password:hashedPass
        })
         const user =  await newUser.save()

         generateToken(user._id,res)

        return res.status(202).json({success:true,message:'user created',user})

    } catch (error) {
        console.log(error)
        return res.status(404).json({success:false,message:'error while creating user',error})
    }
}


export const login = async (req,res)=>{
    try {
        const {email , password} = req.body

        if(!email || !password){
            return res.status(404).json({success:false,message:'enter complete fields'})
        }

        const oldUser = await UserModel.findOne({email})

        if(!oldUser){
            return res.status(404).json({success:false,message:'User dont exist'})
        }

        const comparedPass = await bcrypt.compare(password,oldUser.password)

        if(!comparedPass){
            return res.status(400).json({success:false,message:'Incorrect password'})
        }

        generateToken(oldUser._id,res)
    
        return res.status(202).json({success:true,message:'User Logged-in',user:oldUser})

    } catch (error) {
        return res.status(400).json({success:false,message:'Error while loging-in',error})
    }
}

export const logout = async (req,res)=>{

    try {
        res.clearCookie('jwt',{
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
        return res.status(202).json({success:true, message:"user loggedout successfully"})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while logging-out user", error });
    }
}


export const checkAuth = async (req,res) =>{
    try {
        return res.status(201).json({success:true,user:req.user})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error at checkauth ", error });
    }

}

export const getUser = async (req,res)=>{

    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error at getuser ", error });
        
    }
}


export const getuserAlldetails = async (req,res)=>{

    try {
        const userId = req.user._id;
    
        const user = await UserModel.findById(userId)
          .populate('projects') 
          .select('-password'); 
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.status(200).json(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}



export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, password } = req.body;

    const updates = {};

    if (name) {
      updates.name = name;
    }

    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }

      const emailExists = await UserModel.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId.toString()) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }

      updates.email = email;
    }

    if (password) {
      if (password.length < 9) {
        return res.status(400).json({ success: false, message: 'Password too weak' });
      }

      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(password, salt);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error while updating user', error });
  }
};
