import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getSolutionPosts,
  postSolution,
} from '../services/api_solutionPost.js';

const ContestSolution = () => {
  const { contestName } = useParams();
  const [activeQuestion, setActiveQuestion] = useState('Q1');
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    hint: [''],
    approach: [''],
    implementation: [''],
    anyLink: ['']
  });
  const [showForm, setShowForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 12;
  const [totalPages, setTotalPages] = useState(1);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await getSolutionPosts({
        contestName,
        questionNo: activeQuestion,
        page: currentPage,
        limit: POSTS_PER_PAGE,
      });
      setSolutions(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching solutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [contestName, activeQuestion, currentPage]);

  const handleArrayChange = (field, index, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handlePostSolution = async () => {
    if (!form.title.trim()) return;

    try {
      // console.log(form.hint.filter(Boolean));
      await postSolution({
        contestName,
        question: activeQuestion,
        
        hint: form.hint.filter(Boolean),
        approach: form.approach.filter(Boolean),
        implementation: form.implementation.filter(Boolean),
        anyLink: form.anyLink.filter(Boolean),
        title:form.title,
      });
      setForm({
        title: '',
        hint: [''],
        approach: [''],
        implementation: [''],
        anyLink: ['']
      });
      setShowForm(false);
      setCurrentPage(1);
      fetchSolutions();
    } catch (err) {
      console.error('Error posting solution:', err);
    }
  };

  return (
    <div className="bg-[#1A1A1C] text-white min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#FFA116]">{contestName} Solutions</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
          <button
            key={q}
            className={`px-4 py-2 font-semibold rounded ${activeQuestion === q
              ? 'bg-[#FFA116] text-black'
              : 'bg-[#2A2A2E] hover:bg-[#333] text-white'}`}
            onClick={() => {
              setActiveQuestion(q);
              setCurrentPage(1);
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Post Button */}
      <button
        className="mb-6 bg-[#FFA116] text-black font-semibold px-4 py-2 rounded hover:opacity-90"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? 'Cancel' : 'Post Your Solution'}
      </button>

      {/* Solution Form */}
      {showForm && (
        <div className="bg-[#2A2A2E] p-6 rounded shadow-lg mb-6 space-y-4">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="w-full px-4 py-2 rounded bg-[#1A1A1C] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA116]"
          />

          {[
            { key: 'hint', label: 'Hint' },
            { key: 'approach', label: 'Approach' },
            { key: 'implementation', label: 'Implementation' },
            { key: 'anyLink', label: 'Any Link (optional)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <p className="text-sm font-semibold mb-1">{label}</p>
              {form[key].map((val, i) => (
                <textarea
                  key={i}
                  value={val}
                  onChange={(e) => handleArrayChange(key, i, e.target.value)}
                  className="w-full px-4 py-2 mb-2 rounded bg-[#1A1A1C] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA116]"
                />
              ))}
              <button
                type="button"
                className="text-xs text-[#FFA116] underline"
                onClick={() => addField(key)}
              >
                + Add another {label}
              </button>
            </div>
          ))}

          <button
            onClick={handlePostSolution}
            className="bg-[#FFA116] text-black px-6 py-2 rounded font-semibold mt-4 hover:opacity-90"
          >
            Post Solution
          </button>
        </div>
      )}

      {/* Display Solutions */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : solutions.length === 0 ? (
        <p className="text-center text-gray-500">No solutions posted yet.</p>
      ) : (
        solutions.map((post) => (
          <div key={post._id} className="mb-4 bg-[#2A2A2E] rounded">
            <div
              className="cursor-pointer px-5 py-4 font-semibold hover:bg-[#3A3A3E]"
              onClick={() =>
                setSolutions((prev) =>
                  prev.map((s) =>
                    s._id === post._id ? { ...s, expanded: !s.expanded } : s
                  )
                )
              }
            >
              {post.title} <span className="text-sm text-gray-400 ml-2">by {post.postedBy?.username || 'Anonymous'}</span>
            </div>
            {post.expanded && (
              <div className="px-5 py-4 border-t border-gray-700 text-sm text-gray-300 space-y-2 whitespace-pre-wrap">
                {post.hint?.length > 0 && (
                  <div>
                    <p className="font-bold text-[#FFA116]">Hint:</p>
                    <ul className="list-disc ml-5">{post.hint.map((h, i) => <li key={i}>{h}</li>)}</ul>
                  </div>
                )}
                {post.approach?.length > 0 && (
                  <div>
                    <p className="font-bold text-[#FFA116]">Approach:</p>
                    <ul className="list-disc ml-5">{post.approach.map((a, i) => <li key={i}>{a}</li>)}</ul>
                  </div>
                )}
                {post.implementation?.length > 0 && (
                  <div>
                    <p className="font-bold text-[#FFA116]">Implementation:</p>
                    <ul className="list-disc ml-5">{post.implementation.map((imp, i) => <li key={i}>{imp}</li>)}</ul>
                  </div>
                )}
                {post.anyLink?.length > 0 && (
                  <div>
                    <p className="font-bold text-[#FFA116]">Links:</p>
                    <ul className="list-disc ml-5">
                      {post.anyLink.map((l, i) => (
                        <li key={i}><a href={l} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{l}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full text-sm font-semibold ${currentPage === i + 1
                ? 'bg-[#FFA116] text-black'
                : 'bg-[#2A2A2E] text-white hover:bg-[#3A3A3E]'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestSolution;
