import axios from 'axios';
import { apiFunc } from '../utils/apiClient.js';
// Set API base URL
const API_URL = 'http://localhost:7000/api/v1/user';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      withCredentials: true,
    });
    // console.log("Register res: ",response)
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'Registration failed';
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'Login failed';
  }
};

export const logOutUser=async(userData)=>{
  try {
    const response=await axios.post(`${API_URL}/logout`,userData,{
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'Log Out failed';
  }
}
export const otpSend=async(userData) =>{
  try {
    const response= await axios.post(`${API_URL}/send-otp`,userData,{
      withCredentials:true,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'something went wrong';
  }
}

export const resendOtp = async (data) =>{
  try {
    const response= axios.post('${API_URL)/resend-otp', data,{
      withCredentials:true,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'something went wrong';
  }  
}

export const addFriend=async(userData)=>{
  try {
    const response=await apiFunc().post(`${API_URL}/add-friend`,userData,{
      withCredentials:true,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'something went wrong';
  }
}
export const removeFriend=async(leetcodeId)=>{
  try {
    const response=await apiFunc().delete(`${API_URL}/remove-friend`,{
      params: { leetcodeId },
      withCredentials:true,
    });
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || 'something went wrong';
    }
  }

export const getFriendsList=async(page,limit)=>{
  try {
    const response=await apiFunc().get(`${API_URL}/get-friend-list`,{
      params: { page, limit },
      withCredentials:true,
    });
      // console.log(response)
      return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'unable to fetch friend';
  }
}

export const fetchAllFriends=async()=>{
    try {
      const response=await apiFunc().get(`${API_URL}/fetch-all-friends`,{
        withCredentials:true,
      })
      // console.log(response.data)
      return response.data
    } catch (error) {
      throw error
    }
}

export const addUserDetail=async(userData)=>{
  try {
    const response =await apiFunc().post(`${API_URL}/add-user-details`,userData,{
      withCredentials:true,
    })
    return response.data
  } catch (error) {
    throw error || '404';
  }
}

export const getUserDetails=async()=>{
  try {
    const response=await apiFunc().get(`${API_URL}/current-user`,{
      withCredentials:true,
    })
    return response.data
  } catch (error) {
    throw error || 'unable to fetch current user';
  }
}

export const deleteUser= async()=>{
  try {
    const response=await apiFunc().delete(`${API_URL}/delete-account`,{
      withCredentials:true,
    })
    return response.data
  } catch (error) {
    throw error;
  }
}

export const updatePassword=async()=>{
  try {
    const response=await apiFunc().patch(`${API_URL}/change-password`,{
      withCredentials:true,
    })
    return response.data
  } catch (error) {
    
  }
}

export const updateFriend=async({beforeleetcodeid,leetcodeId,friendName})=>{
  try {
    const response=await apiFunc().patch(`${API_URL}/update-friend-profile`,{
      beforeleetcodeid,
      leetcodeId,
      friendName,
    },{
      withCredentials:true,
    })
    return response.data
  } catch (error) {
    throw error;
  }
}