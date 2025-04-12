import {create} from 'zustand'
import { axiosInstance } from '../lib/Axios'
import toast from 'react-hot-toast'

export const AuthStore = create((set,get)=>({

    user:null,
    loading:false,

    fetchUser: async ()=>{
                    set({loading:true})
                try {
                    const res = await axiosInstance.post('/user/getuser',{
                        withCredentials: true
                      })
                    set({user:res.data})
                } catch (error) {
                    console.log(error)
                    toast.error(error.response.data.message)
                }finally{
                    set({loading:false})
                }
    },


    logout: async ()=>{
                try {
                    await axiosInstance.post('/user/logout',{
                        withCredentials: true
                      })
                    set({user:null})
                } catch (error) {
                    console.log(error)
                    toast.error(error)
                }
    }

}))