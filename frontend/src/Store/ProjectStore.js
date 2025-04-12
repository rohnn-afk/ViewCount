import { create } from 'zustand';
import { axiosInstance } from '../lib/Axios';
import {toast} from 'react-hot-toast'

export const ProjectStore = create((set,get) => ({
  projects: [],
  loading: false,
  loadingproject:false,
  projectData:null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/project/fetch`,{
        withCredentials: true
      });
      set({ projects: res.data.projectsWithEventCounts });

    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      set({ loading: false });
    }
  },

  deleteProject: async (projectid,projectname) =>{

    set({ loading: true });
    try {
      const res = await axiosInstance.delete(`/project/delete/${projectid}`,{
        withCredentials: true
      });
      if(res.data.success){
        toast.success(`Project : ${projectname} , deleted Successfully.`)
        get().fetchProjects()
      }
    } catch (err) {
      toast.error('Unable to delete right now.')
      console.error("Failed to delete projects", err.response.data);
    } finally {
      set({ loading: false });
    }
  

  },

  fetchprojectbyID : async (id)=>{

    set({ loadingproject: true });
    try {
      const res = await axiosInstance.post(`/project/fetch/${id}`,{
        withCredentials: true
      });
      set({ projectData: res.data });

    } catch (err) {
      console.error("Failed to fetch particular project", err.response.data);
    } finally {
      set({ loadingproject: false });
    }

  }
}));
