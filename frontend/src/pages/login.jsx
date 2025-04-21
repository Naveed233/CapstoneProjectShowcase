import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const res = await axios.post("/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      localStorage.setItem("accessToken", res.data.access_token);
      navigate("/");  // redirect home
    } catch (e) {
      setError("Login failed—check credentials.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 mt-20 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-red-600 text-white rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
