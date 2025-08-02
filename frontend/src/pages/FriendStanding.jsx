import { useEffect, useMemo, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import {
  fetchContestMetadata,
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
  const [contestMetadata, setContestMetadata] = useState(null);
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

        if (userLeetcodeId) {
          friendsList = [
            ...friendsList,
            { leetcodeId: userLeetcodeId, friendName: userName },
          ];
        }

        const lcResults = [];
        const lccnResults = [];
        const batchSize = 3;

        for (let i = 0; i < friendsList.length; i += batchSize) {
          const batch = friendsList.slice(i, i + batchSize);
          const ids = batch.map((f) => f.leetcodeId);
          const [lcRes, lccnRes] = await Promise.all([
            fetchFriendsPerformance(contestName, ids),
            fetchFriendsLCCNPerformance(contestName, ids),
          ]);
          lcResults.push(...lcRes);
          console.log("LC Results:", lcRes);
          lccnResults.push(...lccnRes);
          console.log("LCCN Results:", lccnRes);
        }
        const metadata = await fetchContestMetadata(contestName);
        setContestMetadata(metadata);
        const merged = [];

        for (const friend of friendsList) {
          const lc = lcResults.find((l) => l.username === friend.leetcodeId);
          const lccn = lccnResults.find(
            (l) => l.username === friend.leetcodeId
          );
          if (lc || lccn) {
            merged.push({
              username: friend.leetcodeId,
              friendName: friend.friendName,
              leetcode: lc || {},
              lccn: lccn || {},
            });
          }
        }

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

  const questionIdToLabelMap = useMemo(() => {
    if (!contestMetadata?.questions) return {};
    const map = {};
    for (const q of contestMetadata.questions) {
      map[q.questionId] = q.label;
    }
    return map;
  }, [contestMetadata]);

  const labelToMeta = useMemo(() => {
    if (!contestMetadata?.questions) return {};
    const map = {};
    for (const q of contestMetadata.questions) {
      map[q.label] = {
        titleSlug: q.titleSlug,
        credit: q.credit,
      };
    }
    return map;
  }, [contestMetadata]);

  const processedStandings = useMemo(() => {
    //console.log("standings:", standings);
    return standings
      .filter(({ leetcode, lccn }) => leetcode?.score || lccn?.score) 
      .map(({ username, friendName, leetcode, lccn }) => ({
        username,
        friendName,
        rank: leetcode?.rank || lccn?.rank || 0,
        score: leetcode?.score || lccn?.score || 0,
        finishTime: leetcode?.finishTime,
        submissions: (leetcode?.submissions || []).reduce((acc, sub) => {
          const label = questionIdToLabelMap[sub?.questionId];
          if (label) {
            acc[label] = {
              ...sub,
              failCount: sub?.failCount ?? 0, // make sure it's included
            };
          }
          //console.log("Submission:", sub);
          return acc;
        }, {}),
        old_rating: lccn?.old_rating ?? "-",
        new_rating: lccn?.new_rating ?? "-",
        delta_rating: lccn?.delta_rating ?? "-",
        previousRank: lccn?.rank ?? leetcode?.rank ?? "-",
        rankPage: Math.floor((leetcode?.rank || lccn?.rank) / 25) + 1,
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
  const getContestStartUnix = () => {
    if (!contestName) return null;
    const parts = contestName.split("-");
    const type = parts[0];
    const id = parseInt(parts[parts.length - 1]);
    
    const baseTime = {
      weekly: { id: 445, unix: 1744511400 },
      biweekly: { id: 154, unix: 1744468200 },
    };

    const reference = baseTime[type];
    if (!reference) return null;

    const diff = id - reference.id;
    const secondsInWeek = 7 * 24 * 3600;
    const interval = type === "weekly" ? secondsInWeek : secondsInWeek * 2;

    return reference.unix + diff * interval;
  };

  const submissionTime = (submissionUnix, lang) => {
    const contestStartUnix = getContestStartUnix();
    if (!contestStartUnix) return `${lang} - N/A`;

    const diffSeconds = submissionUnix - contestStartUnix;
    if (diffSeconds < 0) return `${lang} - Before Start`;

    const totalMinutes = Math.floor(diffSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${lang} - ${hours}:${minutes.toString().padStart(2, "0")} hrs`;
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-6">
      <h1 className="text-4xl font-bold text-[#ffa116] text-center mb-6">
        {contestName.replace(/-/g, " ").toUpperCase()} - Friends Standings
      </h1>
      <div className="text-center text-sm text-gray-100 mb-2">
        {/* {processedStandings.length} Friend Participated || */}
        Total Participants : {contestMetadata?.totalParticipants}
      </div>

      <div className="max-w-6xl mx-auto overflow-x-auto">
        <table className="w-full border-collapse bg-[#1e1e1e] text-gray-300 rounded-xl overflow-hidden shadow-lg">
          <thead>
            <tr className="text-black bg-[#ffa116] rounded-t-xl">
              <th className="p-3">Current Rank</th>
              <th className="p-3">Previous Rank</th>
              <th className="p-3">Username</th>
              <th className="p-3">LeetCode ID</th>
              <th className="p-3">Score</th>
              {["A", "B", "C", "D"].map((label) => {
                const meta = labelToMeta[label];
                return (
                  <th className="p-3" key={label}>
                    {meta ? (
                      <Link
                        to={`https://leetcode.com/problems/${meta.titleSlug}/description/`}
                        target="_blank"
                        className="text-black hover:underline"
                        title={`Click to view problem description for question ${label}`}
                      >
                        {label} ({meta.credit})
                      </Link>
                    ) : (
                      `${label}`
                    )}
                  </th>
                );
              })}
              <th className="p-3">Old Rating</th>
              <th className="p-3">New Rating</th>
              <th className="p-3">Delta</th>
            </tr>
          </thead>
          <tbody>
            {processedStandings.map((friend, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-700 text-center hover:bg-[#252525] ${
                  idx % 2 === 0 ? "bg-[#181818]" : "bg-[#1e1e1e]"
                }`}
              >
                <td className="p-3">
                  <Link
                    to={`https://leetcode.com/contest/${contestName}/ranking/${friend.rankPage}/?region=global_v2`}
                    className="text-[#ffa116] hover:underline"
                    target="_blank"
                    title={`Click to view ${friend.username}'s rank page`}
                  >
                    {friend.rank}
                  </Link>
                </td>
                <td className="p-3">{friend.previousRank}</td>
                <td className="p-3">
                  <Link
                    to={`https://leetcode.com/${friend.username}`}
                    className="text-[#ffa116] hover:underline"
                    target="_blank"
                  >
                    {friend.friendName}
                  </Link>
                </td>
                <td className="p-3">
                  <Link
                    to={`https://leetcode.com/${friend.username}`}
                    className="text-[#ffa116] hover:underline"
                    title={`Click to view ${friend.username}'s profile`}
                    target="_blank"
                  >
                    {friend.username}
                  </Link>
                </td>
                <td className="p-3 font-bold">{friend.score}</td>
                {["A", "B", "C", "D"].map((label, qIdx) => {
                  const sub = friend.submissions?.[label];
                  return (
                    <td
                      key={qIdx}
                      className="p-3 relative text-center align-middle"
                    >
                      {sub ? (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center space-x-1 text-sm text-[#ffa116]">
                            <Link
                              to={`https://leetcode.com/submissions/detail/${sub.submissionId}`}
                              target="_blank"
                              className="hover:underline"
                              title="Click to view the code"
                            >
                              {sub.lang || "N/A"}
                            </Link>
                          </div>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {submissionTime(sub.date, sub.lang).split(" - ")[1]}
                          </span>
                          {sub.failCount > 0 && (
                            <span className="text-[12px] text-red-500 font-medium">
                              {sub.failCount} WA
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-full text-gray-500">
                          <FaMinus className="text-sm opacity-30" />
                        </div>
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
