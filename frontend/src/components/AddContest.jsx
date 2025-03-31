import React, { useState } from 'react';
import { addContest } from '../services/api';
import { toast } from 'react-toastify';

const AddContest = ({ onContestAdded }) => {
  const [contestType, setContestType] = useState('');
  const [contestNo, setContestNo] = useState('');

  const handleAddContest = async () => {
    if (!contestType || !contestNo) {
      toast.error('Please enter both Contest Type and Contest Number!');
      return;
    }
    try {
      await addContest({ contestType, contestNo });
      toast.success('Contest added successfully!');
      setContestType('');
      setContestNo('');
      onContestAdded(); // Refresh contest list
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add contest.');
    }
  };

  return (
    <div className="max-w-md mx-auto mb-6">
      <h2 className="text-xl font-bold mb-4">Add a Contest</h2>
      <input
        type="text"
        placeholder="Contest Type (Weekly/Biweekly)"
        value={contestType}
        onChange={(e) => setContestType(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      />
      <input
        type="text"
        placeholder="Contest Number"
        value={contestNo}
        onChange={(e) => setContestNo(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />
      <button onClick={handleAddContest} className="bg-yellow-500 text-white p-2 rounded">
        Add Contest
      </button>
    </div>
  );
};

export default AddContest;
