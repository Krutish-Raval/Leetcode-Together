import React, { useEffect, useMemo, useState } from "react";
import { FaRedo } from "react-icons/fa"; // Loading spinner & Retry icon
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import { fetchFriendsPerformance } from "../services/api_standing.js";
import { fetchAllFriends,getUserDetails } from "../services/api_user.js";
const FriendStanding = () => {
  const { "contest-name": contestName } = useParams();
  const [friends, setFriends] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MAX_RETRIES = 3;
  const [userLeetcodeId,setUserLeetcodeId]=useState("");
  const [userName,setUsername]=useState("")

  const fetchData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all friends
      const friendsData = await fetchAllFriends();
      //   console.log(friendsData)
      const friendsList = friendsData?.data?.friends || [];
      friendsList.push({leetcodeId:userLeetcodeId,friendName:userName})
      console.log(friendsList)
      setFriends(friendsList);
          
      if (friendsList.length > 0) {
        const standingsData = await Promise.allSettled(
          friendsList.map((friend) =>
            fetchFriendsPerformance(contestName, friend.leetcodeId)
          )
        );
        // console.log(standingsData);

        const validStandings = standingsData
          .filter((res) => res.status === "fulfilled" && res.value !== null)
          .map((res) => res.value);

        const mergedStandings = validStandings.map((stand) => {
          const friend = friendsList.find(
            (f) => f.leetcodeId === stand.username
          );
          return {
            ...stand,
            friendName: friend ? friend.friendName : "N/A",
          };
        });

        if (mergedStandings.length === 0 && retryCount < MAX_RETRIES) {
          console.warn(`Retrying API call... Attempt ${retryCount + 1}`);
          return fetchData(retryCount + 1);
        }

        setStandings(mergedStandings);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load standings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contestName]);

  const getCurrentUserLeetcodeId = async () => {
    const user = await getUserDetails();
    setUserLeetcodeId(user.data.leetcodeId);
    setUsername(user.data.name);
    // console.log(user.data.leetcodeId)
    return user.data.leetcodeId;
  };

  useEffect(() => {
    getCurrentUserLeetcodeId();
  }, []);

  const processedStandings = useMemo(() => {
    return standings.map((friendData, idx) => ({
      ...friendData,
      rankPage: Math.floor(friendData.rank / 25) + 1,
      deltaSign:
        friendData.delta_rating > 0
          ? `+${friendData.delta_rating}`
          : friendData.delta_rating,
    }));
  }, [standings]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0e0e10]">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded flex items-center gap-2"
          onClick={() => fetchData()}
        >
          <FaRedo /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h1 className="text-4xl font-bold text-[#ffa116] text-center mb-6">
        {contestName.replace(/-/g, " ").toUpperCase()} - Friends' Standings
      </h1>

      {processedStandings.length === 0 ? (
        <p className="text-center text-gray-400">
          No standings available for this contest.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse bg-[#1e1e1e] text-gray-300">
            <thead>
              <tr className=" text-black bg-[#ffa116]">
                <th className="p-3">Rank</th>
                <th className="p-3">Username</th>
                <th className="p-3">LeetCode ID</th>
                <th className="p-3">Old Rating</th>
                <th className="p-3">New Rating</th>
                <th className="p-3">Delta</th>
              </tr>
            </thead>
            <tbody>
              {processedStandings.map((friendData, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 text-center hover:bg-[#252525]"
                >
                  <td className="p-3">
                    <Link
                      to={`https://leetcode.com/contest/${contestName}/ranking/${friendData.rankPage}/?region=global_v2`}
                      className=" hover:underline"
                      target="_blank"
                    >
                      {friendData.rank}
                    </Link>
                  </td>
                  <td className="p-3 text-[#ffa116]">
                    {friendData.friendName}
                  </td>
                  <td className="p-3">
                    <Link
                      to={`https://leetcode.com/${friendData.username}`}
                      className="text-[#ffa116] hover:underline"
                      target="_blank"
                    >
                      {friendData.username}
                    </Link>
                  </td>
                  <td className="p-3">
                    {friendData.old_rating
                      ? Math.round(friendData.old_rating)
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    {friendData.new_rating
                      ? Math.round(friendData.new_rating)
                      : "N/A"}
                  </td>
                  <td
                    className={`p-3 font-bold ${
                      friendData.delta_rating > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {Math.round(friendData.deltaSign * 100) / 100 || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FriendStanding;
