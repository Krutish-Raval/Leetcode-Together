import axios from "axios";

const API_BASE_URL = "http://localhost:7000/api/v1/contest"; // Change for production

export const fetchContests = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-all-contest`,{
            params:{page,limit},
            withCredentials:true,
        });
        // console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        console.error("Error fetching contests:", error);
        return { contests: [], totalPages: 0 };
    }
};
