import React, { useState, useEffect } from 'react';
import { getContests } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalContests, setTotalContests] = useState(0);

  const fetchContests = async () => {
    try {
      const { data } = await getContests(page, limit);
      setContests(data?.contests || []);
      setTotalContests(data?.totalContests || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch contests.');
    }
  };

  useEffect(() => {
    fetchContests();
  }, [page]);

  const totalPages = Math.ceil(totalContests / limit);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Contests</h2>
      {contests.length === 0 ? (
        <p>No contests available. Add one!</p>
      ) : (
        <ul className="space-y-4">
          {contests.map((contest) => (
            <li key={contest._id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
              <Link to={`/contest/${contest._id}`} className="text-yellow-400">
                {contest.contestType} Contest {contest.contestNo}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="bg-yellow-500 p-2 rounded"
          >
            Previous
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-yellow-500 p-2 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContestList;
