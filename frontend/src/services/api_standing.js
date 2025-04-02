import axios from 'axios';

export const fetchFriendsPerformance = async (contestName, friendName) => {
    try {
        const response = await axios.get(
            `http://localhost:7000/api/friends-performance?contestName=${contestName}&friendName=${friendName}`
        );
        return response.data && response.data.length > 0 ? response.data[0] : null; 
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error || "API Needs to be updated";
    }
};
