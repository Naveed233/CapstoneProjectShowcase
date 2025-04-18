import { useEffect, useState } from "react";
import axios from "../api/axios";

function Vote() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    axios.get("/projects")
      .then(res => setProjects(res.data))
      .catch(() => setError("Failed to load projects."));
  }, []);

  const handleVote = async (projectId) => {
    try {
      await axios.post(`/projects/${projectId}/vote`, { user_id: userId });
      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, votes: p.votes + 1 } : p
      ));
    } catch (e) {
      alert("You’ve already voted or reached your vote limit.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-500 text-lime-300 font-bold font-[Comic_Sans_MS] text-center px-4 py-10">
      <h1 className="text-4xl mb-10">Vote for Your Favorite Project!</h1>
      {error && <p className="text-red-300">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map(project => (
          <div key={project.id} className="bg-white text-black p-6 rounded shadow-lg max-w-sm mx-auto">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <img src={project.image_url} className="my-3 rounded w-full h-[200px] object-cover" />
            <p>{project.description}</p>
            <p className="text-sm text-gray-600 my-2">Votes: {project.votes}</p>
            <p className="text-sm italic mb-2">Team: {project.team?.name || "N/A"}</p>
            <p className="text-xs text-gray-700 mb-2">Members: {project.members}</p>
            <button onClick={() => handleVote(project.id)} className="bg-green-500 text-white px-4 py-2 rounded">
              Vote!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vote;
