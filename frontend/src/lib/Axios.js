import axios from 'axios'

export const axiosInstance = axios.create({

    baseURL:'https://viewcount-backend.onrender.com/api',
    withCredentials:true
})

