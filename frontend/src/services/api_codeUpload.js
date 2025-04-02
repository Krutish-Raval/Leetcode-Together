import axios from "axios";

const API_URL=`http://localhost:7000/api/v1/code-upload`

export const fetchUploadedCode=async(userData)=>{
    try {
        const response=await axios.get(`${API_URL}/get-solution`,userData,{
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        throw error
    }
}