import { useEffect, useState } from "react";
import axios from "../api/axios";

function CommentSection({ projectId }) {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    content: "",
    author: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`/projects/${projectId}/feedback`)
      .then(res => setComments(res.data))
      .catch(() => setError("Failed to load comments"));
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`/projects/${projectId}/feedback`, formData);
      setComments(prev => [...prev, res.data]);
      setFormData({ content: "", author: "" });
    } catch (err) {
      setError("Failed to submit comment.");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">Comments</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your comment..."
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 bg-gray-100 text-black rounded shadow">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-600 text-right">— {comment.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
