import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReply,
  FaEdit,
  FaTrash,
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";
import PropTypes from "prop-types";

const Comment = ({
  comment,
  addReply,
  updateComment,
  deleteComment,
  currentUserId,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment_text);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return; // 🔥 منع الرد الفاضي
    addReply(replyText, comment.comment_id);
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!editText.trim()) return; // 🔥 منع التعديل الفاضي
    updateComment(comment.comment_id, editText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteComment(comment.comment_id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-l-2 border-[#04333a] pl-4 mb-6 transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center mb-3">
        <img
          src={
            comment.profile_image
              ? `https://midlink-of4r.onrender.com/${comment.profile_image}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-[#04333a] transition-transform duration-300 hover:scale-110 object-cover"
        />
        <p className="font-semibold ml-3 text-[#04333a]">{comment.username}</p>
      </div>
      {isEditing ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmitEdit}
          className="mt-3"
        >
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 border-2 border-[#e6f0f5] rounded-lg focus:ring-2 focus:ring-[#04333a] focus:border-transparent transition-all duration-300 bg-white text-[#04333a]"
            rows="3"
          />
          <div className="flex mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-[#04333a] text-white rounded-full hover:bg-opacity-90 transition-colors duration-300 flex items-center"
            >
              <FaEdit className="mr-2" /> Save Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="ml-3 px-4 py-2 bg-[#e6f0f5] text-[#04333a] rounded-full hover:bg-opacity-90 transition-colors duration-300 flex items-center"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <p className="text-[#04333a] bg-[#e6f0f5] p-3 rounded-lg">
          {comment.comment_text}
        </p>
      )}
      <div className="mt-3 flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-[#04333a] hover:text-opacity-80 transition-colors duration-300 mr-3 flex items-center"
        >
          <FaReply className="mr-1" /> Reply
        </motion.button>
        {currentUserId === comment.patient_id && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="text-[#04333a] hover:text-opacity-80 transition-colors duration-300 mr-3 flex items-center"
            >
              <FaEdit className="mr-1" /> Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center"
            >
              <FaTrash className="mr-1" /> Delete
            </motion.button>
          </>
        )}
      </div>
      <AnimatePresence>
        {showReplyForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitReply}
            className="mt-3"
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-3 border-2 border-[#e6f0f5] rounded-lg focus:ring-2 focus:ring-[#04333a] focus:border-transparent transition-all duration-300 bg-white text-[#04333a]"
              rows="3"
              placeholder="Write your reply here..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-2 px-4 py-2 bg-[#04333a] text-white rounded-full hover:bg-opacity-90 transition-colors duration-300 flex items-center"
            >
              <FaPaperPlane className="mr-2" /> Submit Reply
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#04333a] hover:text-opacity-80 transition-colors duration-300 flex items-center"
          >
            <FaComments className="mr-2" />
            {isExpanded
              ? "Hide Replies"
              : `Show ${comment.replies.length} Replies`}
          </motion.button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pl-4 border-l-2 border-[#e6f0f5]"
              >
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.comment_id}
                    comment={reply}
                    addReply={addReply}
                    updateComment={updateComment}
                    deleteComment={deleteComment}
                    currentUserId={currentUserId}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    comment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    comment_text: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profile_image: PropTypes.string,
    patient_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    replies: PropTypes.array,
  }).isRequired,
  addReply: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

const CommentSection = ({
  comments,
  addComment,
  updateComment,
  deleteComment,
  currentUserId,
}) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // 🔥 منع التعليق الفاضي
    addComment(commentText);
    setCommentText("");
  };

  const renderComments = (commentsArray) => {
    const topLevelComments = commentsArray.filter(
      (comment) => !comment.parent_comment_id,
    );
    topLevelComments.forEach((comment) => {
      comment.replies = commentsArray.filter(
        (reply) => reply.parent_comment_id === comment.comment_id,
      );
    });
    return topLevelComments.map((comment) => (
      <Comment
        key={comment.comment_id}
        comment={comment}
        addReply={addComment}
        updateComment={updateComment}
        deleteComment={deleteComment}
        currentUserId={currentUserId}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-white rounded-lg shadow-xl p-6 border border-[#e6f0f5]"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#04333a] flex items-center">
        <FaComments className="mr-3" /> Patient Feedback
      </h2>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmitComment}
        className="mb-8"
      >
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-4 border-2 border-[#e6f0f5] rounded-lg focus:ring-2 focus:ring-[#04333a] focus:border-transparent transition-all duration-300 bg-white text-[#04333a]"
          rows="4"
          placeholder="Share your thoughts or experiences..."
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-3 px-6 py-3 bg-[#04333a] text-white rounded-full hover:bg-opacity-90 transition-colors duration-300 flex items-center"
        >
          <FaPaperPlane className="mr-2" /> Submit Comment
        </motion.button>
      </motion.form>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-6"
      >
        {renderComments(comments)}
      </motion.div>
    </motion.div>
  );
};

CommentSection.propTypes = {
  comments: PropTypes.array.isRequired,
  addComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default CommentSection;
