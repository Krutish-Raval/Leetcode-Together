import axios from 'axios';

// Set API base URL
const API_URL = 'http://localhost:7000/api/v1/user';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      withCredentials: true,
    });
    console.log("Register res: ",response)
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

export const resendOtp = async (data) => axios.post('${API_URL)/resend-otp', data);
