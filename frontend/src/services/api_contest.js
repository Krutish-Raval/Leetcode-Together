import axios from "axios";
import { apiFunc } from "../utils/apiClient.js";
const API_BASE_URL = "http://localhost:7000/api/v1/contest";

export const fetchContests = async () => {
    try {
        const response = await apiFunc().get(`contest/get-all-contest`,{
            withCredentials:true,
        });
        // console.log(response);
        return response.data;
    } catch (error) {
       // console.log(error);
        console.error("Error fetching contests:", error);
        return { contests: [], totalPages: 0 };
    }
};
