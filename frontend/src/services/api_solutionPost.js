import axios from "axios";

const API_URL = `http://localhost:7000/api/v1/contest-solution`;

export const getSolutionPosts = async ({
  contestName,
  questionNo,
  page,
  limit,
}) => {
  try {
    const response = await axios.get(`${API_URL}/get-solution-posts`, {
      params: {
        contestName,
        questionNo,
        page,
        limit,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

      export const post_Solution = async ({
        contestName,
        question,
        hint,
        approach,
        implementation,
        anyLink,
        title
      }) => {
        try {
          const response = await axios.post(`${API_URL}/post-solution`
            ,{
            contestName,
            question,
            hint,
            approach,
            implementation,
            anyLink,
            title
          }, {
            
            withCredentials: true,
          });
          return response.data;
        } catch (error) {
          console.log(error);
          throw error;
        }
      };
