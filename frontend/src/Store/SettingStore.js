import { create } from 'zustand';
import { axiosInstance } from '../lib/Axios';
import {toast} from 'react-hot-toast'

export const SettingStore = create((set,get) => ({

    user : null ,
    loading : false,
    fetchuserdata : async () =>{
        set({ loading: true });
        try {
            const res = await axiosInstance.get('/user/getuser/settings',{
                withCredentials: true
              })
            set({ user: res.data });
        } catch (error) {
            console.log(error)
            toast.error('Error fetching user, please try again later')
        }finally{
        set({ loading: false });
        }

    },
    handleRegenerate : async (projectId) => {

        set({ loading: true });
        try {
            const res = await axiosInstance.post('/project/regenerateApiKey',{id:projectId},{
                withCredentials: true
              })
            if(res.data.success){
            get().fetchuserdata()    
            toast.success(`New API Key generated for project ${projectId}`);
            }
        } catch (error) {
            console.log(error)
            toast.error('Error fetching user, please try again later')
        }finally{
        set({ loading: false });
        }    
      },
      updateUser: async (updatedFields) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post('/user/updateuser', updatedFields,{
                withCredentials: true
              });
    
            if (res.data.success) {
                toast.success('User updated successfully');
            get().fetchuserdata()             
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        } finally {
            set({ loading: false });
        }
    },

    ResetModal : false,
    SetResetModal : ()=> set({ResetModal:!get().ResetModal}),
    resetProject : async (projectid) =>{
        set({ loading: true });
        try {
            const res = await axiosInstance.post('/user/reset',{projectid},{
                withCredentials: true
              });
    
            if (res.data.success) {
                toast.success('Project Reset successfully');
                console.log(res.data)
                get().SetResetModal()
                get().fetchuserdata()
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        } finally {
            set({ loading: false });
        }

    }
    

}));
