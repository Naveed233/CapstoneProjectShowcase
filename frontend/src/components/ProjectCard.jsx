import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
const CURRENT_USER_ID = 1;

function ProjectCard({ project, onVote }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-black p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{project.title}</h2>
      <p className="text-sm mb-2">{project.description}</p>
      {project.image_url && (
        <img src={project.image_url} className="rounded mb-2" />
      )}
      {project.video_url && (
        <video controls className="w-full mb-2">
          <source src={project.video_url} />
        </video>
      )}
      <p className="text-sm text-gray-600 mb-2">Votes: {project.votes}</p>
      <div className="flex justify-between">
        <button
          onClick={() => navigate(`/project/${project.id}`)}
          className="text-blue-600 underline"
        >
          View Details
        </button>
        <button
          onClick={() => onVote(project.id)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Vote
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
