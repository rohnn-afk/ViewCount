import express from 'express'
import { checkAuth, getUser, getuserAlldetails, login, logout, registerUser, updateUserDetails } from '../controller/UserController.js'
import { protect } from '../middleware/AuthMiddleware.js'

export const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',login)
userRouter.post('/logout',logout)
userRouter.post('/check',checkAuth)
userRouter.post('/getuser',protect,getUser)
userRouter.get('/getuser/settings',protect,getuserAlldetails)
userRouter.post('/updateuser',protect,updateUserDetails)
