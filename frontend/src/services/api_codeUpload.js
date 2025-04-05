import axios from "axios";

const API_URL = `http://localhost:7000/api/v1/code-upload`;

export const fetchSolution = async (userData) => {
  try {
    // console.log("userData",userData)
    const response = await axios.get(`${API_URL}/get-solution`, {
      params: userData,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadSolution = async (userData) => {
  try {
    // console.log("userData",userData)
    const response = await axios.post(`${API_URL}/upload-solution`, userData, {
      withCredentials: true,
    });
    // console.log("response",response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSolution = async (userData) => {
  try {
    console.log("userData", userData);
    const response = await axios.delete(
      `${API_URL}/delete-solution`,
      {
        data: userData,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editSolution = async (userData) => {
  try {
    const response = await axios.patch(`${API_URL}/edit-solution`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
