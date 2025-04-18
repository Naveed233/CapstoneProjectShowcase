import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (userId.trim()) {
      localStorage.setItem("userId", userId);
      navigate("/");
    }
  };

  return (
    <div className="bg-pink-500 min-h-screen flex items-center justify-center font-[Comic_Sans_MS] text-lime-300">
      <div className="bg-white text-black p-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="p-2 mb-4 w-full rounded"
        />
        <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
