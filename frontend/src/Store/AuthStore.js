import {create} from 'zustand'
import { axiosInstance } from '../lib/Axios'
import toast from 'react-hot-toast'

export const AuthStore = create((set,get)=>({

    user:null,
    loading:false,

    fetchUser: async ()=>{
                    set({loading:true})
                try {
                    const res = await axiosInstance.post('/user/getuser')
                    set({user:res.data})
                } catch (error) {
                    console.log(error)
                }finally{
                    set({loading:false})
                }
    },


    logout: async ()=>{
                try {
                    await axiosInstance.post('/user/logout')
                    set({user:null})
                } catch (error) {
                    console.log(error)
                    toast.error(error)
                }
    }

}))