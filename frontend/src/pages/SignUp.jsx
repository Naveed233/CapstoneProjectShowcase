// File: frontend/src/pages/SignUp.jsx

import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword]= useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response || err);
      setError(
        err.response?.data?.detail ||
        "Sign up failed—please try again or check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 mt-20 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && (
        <p className="text-red-600 mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
