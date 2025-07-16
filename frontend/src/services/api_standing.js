// import axios from 'axios';

// export const fetchFriendsPerformance = async (contestName, friendName) => {
//     try {
//         const response = await axios.get(
//             `http://localhost:7000/api/friends-performance?contestName=${contestName}&friendName=${friendName}`
//         );
//         return response.data && response.data.length > 0 ? response.data[0] : null; 
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         throw error || "API Needs to be updated";
//     }
// };
import axios from 'axios';

const BASE_URL = 'http://localhost:7000/api/v1/lcstandings';

// LeetCode Friends Performance
export const fetchFriendsPerformance = async (contestName, friends) => {
  try {
    const response = await axios.get(`${BASE_URL}/friends-contest-lc-details`, {
      params: {
        contestName,
        friends,
      },
      withCredentials: true,
    });
    return response.data?.data || null;
  } catch (error) {
    console.error("LC Standing Fetch Error:", error);
    return null;
  }
};

// LCCN Friends Performance
export const fetchFriendsLCCNPerformance = async (contestName, friends) => {
  try {
    const response = await axios.get(`${BASE_URL}/friends-contest-lccn-details`, {
      params: {
        contestName,
        friends,
      },
      withCredentials: true,
    });
    return response.data?.data || null;
  } catch (error) {
    console.error("LCCN Standing Fetch Error:", error);
    return null;
  }
};
