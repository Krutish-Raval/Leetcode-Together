import React, { use, useCallback, useEffect, useRef, useState } from "react";
import { FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const SolutionModal = ({
  userLeetcodeId,
  otherUserLeetcodeId,
  question,
  onClose,
  onUpload,
  onEdit,
  onDelete,
  existingSolution,
}) => {
  const [solution, setSolution] = useState(existingSolution || "");
  const [isEdit, setIsEdit] = useState(!existingSolution); // editable if no solution
  const modalRef = useRef(null);

  useEffect(() => {
    setSolution(existingSolution || "");
    setIsEdit(!existingSolution);
  }, [existingSolution]);

  const handleUploadClick = useCallback(() => {
    const cleaned = solution?.toString().trim();
    if (!cleaned) return;

    // console.log("Uploading solution:", cleaned);

    const isNew = !existingSolution;
    if (isNew) {
      onUpload(question, cleaned);
    } else {
      onEdit(question, cleaned);
    }

    onClose();  
  }, [question, solution, onUpload, onEdit, onClose, existingSolution]);

  const handleDeleteClick = useCallback(() => {
    // console.log("Deleting solution:", question);
    if (onDelete) {
      onDelete(question);
      onClose();
    }
  }, [question, onDelete, onClose]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        e.target.tagName !== "TEXTAREA"
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside]);

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div
        ref={modalRef}
        className="bg-[#1e1e1e] text-white p-6 rounded-lg w-7/10 md:w-1/2 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-[#ffa116]">
            {question} - {isEdit ? "Edit" : "View"} Solution
          </h2>
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <FaTimes size={20} />
          </button>
        </div>

        {isEdit && userLeetcodeId===otherUserLeetcodeId? (
          <textarea
            className="w-1/2 h-[600px] md:h-[600px] bg-[#252525] text-gray-300 p-2 rounded-md outline-none resize-none"
            placeholder="Paste your solution here..."
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
        ) : (
          <div className="bg-[#252525] text-gray-300 p-4 rounded-md border border-gray-600 overflow-x-auto whitespace-pre-wrap">
            <ReactMarkdown>{`\`\`\`\n${solution}\n\`\`\``}</ReactMarkdown>
          </div>
        )}
        {userLeetcodeId===otherUserLeetcodeId ? (
        <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {isEdit  ? "Cancel Edit" : "Edit"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleUploadClick}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-600 disabled:bg-gray-600"
              disabled={!solution.toString().trim()}
            >
              <FaUpload /> {existingSolution.trim() ? "Update" : "Upload"}
            </button>

            {existingSolution.trim() && (
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>
        </div>):null}
      </div>
    </div>
  );
};

export default SolutionModal;
