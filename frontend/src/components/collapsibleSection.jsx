import { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const CollapsibleSection = ({ title, contentList, postedBy }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      {contentList.map((content, idx) => (
        <div key={idx} className="border border-gray-700 rounded-md mb-2 bg-[#1a1a1a]">
          <div
            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#2a2a2a]"
            onClick={() => toggle(idx)}
          >
            <div className="flex items-center space-x-2">
              {activeIndex === idx ? (
                <FaChevronDown className="text-sm text-gray-300" />
              ) : (
                <FaChevronRight className="text-sm text-gray-300" />
              )}
              <span className="font-medium text-blue-400">{`${title} ${idx + 1}`}</span>
            </div>
          </div>

          {activeIndex === idx && (
            <div className="px-5 py-3 bg-[#e5f0ff] text-black rounded-b-md">
              <p className="mb-2 whitespace-pre-line">{content}</p>
              <p className="text-sm text-right text-gray-600 italic">Posted by: {postedBy}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollapsibleSection;
