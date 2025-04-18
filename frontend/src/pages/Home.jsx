import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/projects")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects.");
        setLoading(false);
      });
  }, []);

  const filtered = filter === "All"
    ? projects
    : projects.filter((p) => {
        if (filter === "Building 1") return p.team?.name?.includes("1");
        if (filter === "Building 2") return p.team?.name?.includes("2");
      });

  const handleVote = async (projectId) => {
    try {
      await axios.post(`/projects/${projectId}/vote`, { user_id: 1 });
      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, votes: p.votes + 1 } : p
      ));
    } catch (e) {
      alert("You’ve already voted.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-[#C8102E] font-sans text-center px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-10">Capstone Projects</h1>

      <div className="flex justify-center gap-4 mb-10">
        {["All", "Building 1", "Building 2"].map((b) => (
          <button
            key={b}
            className={`px-6 py-2 rounded text-lg transition-all duration-200 ${
              filter === b
                ? "bg-[#C8102E] text-white"
                : "bg-white text-[#C8102E] border border-[#C8102E]"
            }`}
            onClick={() => setFilter(b)}
          >
            {b}
          </button>
        ))}
      </div>

      {loading && <p className="text-lg font-medium">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="bg-white text-black p-6 rounded shadow-lg max-w-sm mx-auto"
          >
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="mb-2">{project.description}</p>
            {project.image_url && (
              <img
                src={project.image_url}
                className="rounded mb-2 w-full h-[200px] object-cover"
                alt="project"
              />
            )}
            {project.video_url && (
              <video controls className="w-full mb-2">
                <source src={project.video_url} />
              </video>
            )}
            <p className="text-sm text-gray-600 mb-2">Votes: {project.votes}</p>
            <p className="text-sm italic mb-2">
              Team: {project.team?.name || "Unknown"}
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(`/project/${project.id}`)}
                className="text-blue-600 underline"
              >
                View Details
              </button>
              <button
                onClick={() => handleVote(project.id)}
                className="bg-[#C8102E] text-white px-3 py-1 rounded"
              >
                Vote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
