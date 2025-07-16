// import React, { useEffect, useMemo, useState } from "react";
// import { FaMinusCircle } from "react-icons/fa";
// import { Link, useParams } from "react-router-dom";
// import Spinner from "../components/Spinner.jsx";
// import { fetchFriendsPerformance } from "../services/api_standing.js";
// import { fetchAllFriends, getUserDetails } from "../services/api_user.js";

// const FriendStanding = () => {
//   const { "contest-name": contestName } = useParams();
//   const [friends, setFriends] = useState([]);
//   const [standings, setStandings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userLeetcodeId, setUserLeetcodeId] = useState(null);
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         const user = await getUserDetails();
//         setUserLeetcodeId(user.data.leetcodeId);
//         setUserName(user.data.name);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//         setError("Failed to fetch user details.");
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!userLeetcodeId) return;
//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const friendsData = await fetchAllFriends();
//         let friendsList = friendsData?.data?.friends || [];
//         if (userLeetcodeId) {
//           friendsList = [
//             ...friendsList,
//             { leetcodeId: userLeetcodeId, friendName: userName },
//           ];
//         }
//         setFriends(friendsList);

//         const standingsData = await Promise.allSettled(
//           friendsList.map((friend) =>
//             fetchFriendsPerformance(contestName, friend.leetcodeId)
//           )
//         );

//         const validStandings = standingsData
//           .filter((res) => res.status === "fulfilled" && res.value !== null)
//           .map((res) => res.value);

//         const mergedStandings = validStandings.map((stand) => {
//           const friend = friendsList.find(
//             (f) => f.leetcodeId === stand.username
//           );
//           return { ...stand, friendName: friend ? friend.friendName : "N/A" };
//         });

//         setStandings(mergedStandings);
//       } catch (err) {
//         console.error("Error loading data:", err);
//         setError("Failed to load standings. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [contestName, userLeetcodeId]);

//   const processedStandings = useMemo(() => {
//     return standings
//       .map((friendData) => ({
//         ...friendData,
//         rankPage: Math.floor(friendData.rank / 25) + 1,
//         deltaSign:
//           friendData.delta_rating > 0
//             ? `+${friendData.delta_rating}`
//             : friendData.delta_rating,
//       }))
//       .sort((a, b) => a.rank - b.rank);
//   }, [standings]);

//   if (loading) return <Spinner />;
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-[#0e0e10]">
//         <p className="text-red-500 text-lg">{error}</p>
//         <button
//           className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded"
//           onClick={() => window.location.reload()}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0e0e10] text-white p-6">
//       <h1 className="text-4xl font-bold text-[#ffa116] text-center mb-6">
//         {contestName.replace(/-/g, " ").toUpperCase()} - Friends' Standings
//       </h1>

//       <div className="max-w-4xl mx-auto overflow-x-auto">
//         <table className="w-full border-collapse bg-[#1e1e1e] text-gray-300">
//           <thead>
//             <tr className="text-black bg-[#ffa116]">
//               <th className="p-3">Rank</th>
//               <th className="p-3">Username</th>
//               <th className="p-3">LeetCode ID</th>
//               <th className="p-3">Q1</th>
//               <th className="p-3">Q2</th>
//               <th className="p-3">Q3</th>
//               <th className="p-3">Q4</th>
//               <th className="p-3">Old Rating</th>
//               <th className="p-3">New Rating</th>
//               <th className="p-3">Delta</th>
//             </tr>
//           </thead>
//           <tbody>
//             {processedStandings.map((friendData, idx) => (
//               <tr
//                 key={idx}
//                 className="border-b border-gray-700 text-center hover:bg-[#252525]"
//               >
//                 <td className="p-3">
//                   <Link
//                     to={`https://leetcode.com/contest/${contestName}/ranking/${friendData.rankPage}/?region=global_v2`}
//                     className="text-[#ffa116] hover:underline"
//                   >
//                     {friendData.rank}
//                   </Link>
//                 </td>
//                 <td className="p-3">
//                   <Link
//                     to={`https://leetcode.com/${friendData.username}`}
//                     className="text-[#ffa116] hover:underline"
//                   >
//                     {friendData.friendName}
//                   </Link>
//                 </td>
//                 <td className="p-3">
//                   <Link
//                     to={`https://leetcode.com/${friendData.username}`}
//                     className="text-[#ffa116] hover:underline"
//                     target="_blank"
//                   >
//                     {friendData.username}
//                   </Link>
//                 </td>
//                 {["Q1", "Q2", "Q3", "Q4"].map((q) => (
//                   <td key={q} className="p-3">
//                     <FaMinusCircle />
//                   </td>
//                 ))}
//                 <td className="p-3">{Math.round(friendData.old_rating)}</td>
//                 <td className="p-3">{Math.round(friendData.new_rating)}</td>
//                 <td
//                   className={`p-3 font-bold ${
//                     friendData.delta_rating > 0
//                       ? "text-green-400"
//                       : "text-red-400"
//                   }`}
//                 >
//                   {Math.round(friendData.deltaSign * 100) / 100}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FriendStanding;
import { useEffect, useMemo, useState } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import {
  fetchFriendsLCCNPerformance,
  fetchFriendsPerformance,
} from "../services/api_standing.js";
import { fetchAllFriends, getUserDetails } from "../services/api_user.js";

const FriendStanding = () => {
  const { "contest-name": contestName } = useParams();
  const [friends, setFriends] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLeetcodeId, setUserLeetcodeId] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const user = await getUserDetails();
        setUserLeetcodeId(user.data.leetcodeId);
        setUserName(user.data.name);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!userLeetcodeId) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const friendsData = await fetchAllFriends();
        let friendsList = friendsData?.data?.friends || [];

        // Add current user
        if (userLeetcodeId) {
          friendsList = [
            ...friendsList,
            { leetcodeId: userLeetcodeId, friendName: userName },
          ];
        }

        const leetcodeIds = friendsList.map((f) => f.leetcodeId);
        const nameMap = Object.fromEntries(
          friendsList.map((f) => [f.leetcodeId, f.friendName])
        );

        const [lcResults, lccnResults] = await Promise.all([
          fetchFriendsPerformance(contestName, leetcodeIds),
          fetchFriendsLCCNPerformance(contestName, leetcodeIds),
        ]);

        // Merge both results by username
        const merged = lcResults.map((lc) => {
          const lccn = lccnResults.find((item) => item.username === lc.username);
          return {
            username: lc.username,
            friendName: nameMap[lc.username] || "N/A",
            leetcode: lc,
            lccn: lccn || {},
          };
        });

        setFriends(friendsList);
        setStandings(merged);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load standings. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [contestName, userLeetcodeId]);

  const processedStandings = useMemo(() => {
    return standings
      .map(({ username, friendName, leetcode, lccn }) => ({
        username,
        friendName,
        rank: leetcode.rank,
        score: leetcode.score,
        finishTime: leetcode.finishTime,
        submissions: leetcode.submissions || [],
        old_rating: lccn?.old_rating ?? "-",
        new_rating: lccn?.new_rating ?? "-",
        delta_rating: lccn?.delta_rating ?? "-",
        previousRank: lccn?.rank ?? "-",
        rankPage: Math.floor(leetcode.rank / 25) + 1,
      }))
      .sort((a, b) => a.rank - b.rank);
  }, [standings]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0e0e10]">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h1 className="text-4xl font-bold text-[#ffa116] text-center mb-6">
        {contestName.replace(/-/g, " ").toUpperCase()} - Friends' Standings
      </h1>

      <div className="max-w-6xl mx-auto overflow-x-auto">
        <table className="w-full border-collapse bg-[#1e1e1e] text-gray-300">
          <thead>
            <tr className="text-black bg-[#ffa116]">
              <th className="p-3">Current Rank</th>
              <th className="p-3">Previous Rank</th>
              <th className="p-3">Username</th>
              <th className="p-3">LeetCode ID</th>
              <th className="p-3">Score</th>
              <th className="p-3">Q1</th>
              <th className="p-3">Q2</th>
              <th className="p-3">Q3</th>
              <th className="p-3">Q4</th>
              <th className="p-3">Old Rating</th>
              <th className="p-3">New Rating</th>
              <th className="p-3">Delta</th>
            </tr>
          </thead>
          <tbody>
            {processedStandings.map((friend, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-700 text-center hover:bg-[#252525]"
              >
                <td className="p-3">
                  <Link
                    to={`https://leetcode.com/contest/${contestName}/ranking/${friend.rankPage}/?region=global_v2`}
                    className="text-[#ffa116] hover:underline"
                    target="_blank"
                  >
                    {friend.rank}
                  </Link>
                </td>
                <td className="p-3">{friend.previousRank}</td>
                <td className="p-3">
                  <Link
                    to={`https://leetcode.com/${friend.username}`}
                    className="text-[#ffa116] hover:underline"
                  >
                    {friend.friendName}
                  </Link>
                </td>
                <td className="p-3">
                  <Link
                    to={`https://leetcode.com/${friend.username}`}
                    className="text-[#ffa116] hover:underline"
                    target="_blank"
                  >
                    {friend.username}
                  </Link>
                </td>
                <td className="p-3 font-bold">{friend.score}</td>
                {[0, 1, 2, 3].map((qIdx) => {
                  const sub = friend.submissions[qIdx];
                  return (
                    <td key={qIdx} className="p-3 relative">
                      {sub ? (
                        <>
                          <Link
                            to={`https://leetcode.com/submissions/detail/${sub.submissionId}`}
                            className="text-[#ffa116] hover:underline block"
                            target="_blank"
                          >
                            {sub.lang} - {Math.floor(sub.date / 60)} min
                          </Link>
                          {sub.failCount >= 2 && (
                            <span className="absolute top-1 right-2 text-red-500 font-bold">
                              {sub.failCount}
                            </span>
                          )}
                        </>
                      ) : (
                        <FaMinusCircle />
                      )}
                    </td>
                  );
                })}
                <td className="p-3">{Math.round(friend.old_rating)}</td>
                <td className="p-3">{Math.round(friend.new_rating)}</td>
                <td
                  className={`p-3 font-bold ${
                    friend.delta_rating > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {Math.round(friend.delta_rating * 100) / 100}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FriendStanding;
