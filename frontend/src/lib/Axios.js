import axios from 'axios'

export const axiosInstance = axios.create({

    baseURL:'https://viewcount-backend.onrender.com/api',
    withCredentials:true
})

// 
// http://localhost:5000/api