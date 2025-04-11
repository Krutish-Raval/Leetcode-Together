import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ContestSolution = () => {
  const { contestName } = useParams();

  const [activeQuestion, setActiveQuestion] = useState('Q1');
  const [showForm, setShowForm] = useState(false);
  const [solutions, setSolutions] = useState(
    Array.from({ length: 28 }, (_, i) => ({
      id: i + 1,
      title: `${activeQuestion} - Sample Title ${i + 1}`,
      content: `This is the solution content for ${activeQuestion}, post #${i + 1}`,
      expanded: false,
    }))
  );

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 12;
  const totalPages = Math.ceil(solutions.length / POSTS_PER_PAGE);

  const paginatedSolutions = solutions.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePostSolution = () => {
    if (!newTitle || !newContent) return;
    const newPost = {
      id: solutions.length + 1,
      title: `${activeQuestion} - ${newTitle}`,
      content: newContent,
      expanded: false,
    };
    setSolutions([newPost, ...solutions]);
    setNewTitle('');
    setNewContent('');
    setShowForm(false);
    setCurrentPage(1);
  };

  const toggleExpand = (id) => {
    setSolutions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, expanded: !s.expanded } : s
      )
    );
  };

  const handleQuestionChange = (q) => {
    setActiveQuestion(q);
    setCurrentPage(1);
    setShowForm(false);
    setSolutions(
      Array.from({ length: 28 }, (_, i) => ({
        id: i + 1,
        title: `${q} - Sample Title ${i + 1}`,
        content: `This is the solution content for ${q}, post #${i + 1}`,
        expanded: false,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white font-sans">

      {/* Tabs */}
      <div className="flex justify-center gap-6">
        {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
          <button
            key={q}
            onClick={() => handleQuestionChange(q)}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeQuestion === q
                ? 'bg-[#FFA116] text-black'
                : 'bg-[#2A2A2E] hover:bg-[#3A3A3E]'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Post Your Solution Toggle */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full text-left px-5 py-3 bg-[#2A2A2E] hover:bg-[#3A3A3E] text-[#FFA116] font-semibold rounded-lg transition"
        >
          {showForm ? 'Cancel' : 'Post Your Solution for ' + activeQuestion}
        </button>

        {/* Collapsible form */}
        {showForm && (
          <div className="mt-4 bg-[#1E1E22] p-5 rounded-lg border border-gray-700">
            <input
              type="text"
              placeholder="Enter title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded-md bg-[#2A2A2E] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA116]"
            />
            <textarea
              rows="5"
              placeholder="Paste your solution..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#2A2A2E] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA116]"
            ></textarea>
            <button
              onClick={handlePostSolution}
              className="mt-4 px-6 py-2 bg-[#FFA116] text-black font-medium rounded-md hover:bg-[#e89c00]"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Solution Posts */}
      <div className="max-w-3xl mx-auto mt-10 px-4">
        {paginatedSolutions.map((post) => (
          <div
            key={post.id}
            className="mb-4 bg-[#2A2A2E] border border-gray-700 rounded-lg overflow-hidden"
          >
            <div
              className="cursor-pointer px-5 py-4 font-semibold hover:bg-[#3A3A3E] transition"
              onClick={() => toggleExpand(post.id)}
            >
              {post.title}
            </div>
            {post.expanded && (
              <div className="px-5 py-4 border-t border-gray-700 text-sm text-gray-300 whitespace-pre-wrap">
                {post.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8 pb-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-[#2A2A2E] border border-gray-700 text-white rounded hover:bg-[#3A3A3E]"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? 'bg-[#FFA116] text-black'
                : 'bg-[#2A2A2E] border border-gray-700 hover:bg-[#3A3A3E]'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 bg-[#2A2A2E] border border-gray-700 text-white rounded hover:bg-[#3A3A3E]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContestSolution;
