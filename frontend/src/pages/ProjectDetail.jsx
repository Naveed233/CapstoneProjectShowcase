import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import CommentSection from "../components/CommentSection";

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`/projects/${id}`).then((res) => {
      setProject(res.data);
    });
  }, [id]);

  if (!project) return <p className="text-center p-10">Loading project...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="mb-4">{project.description}</p>

      {project.image_url && (
        <img src={project.image_url} alt={project.title} className="mb-4 rounded" />
      )}

      {project.video_url && (
        <video controls className="w-full mb-4">
          <source src={project.video_url} />
        </video>
      )}

      <p className="text-sm text-gray-600 mb-4">Votes: {project.votes}</p>

      {/* ✅ Comment Section */}
      <CommentSection projectId={project.id} />
    </div>
  );
}

export default ProjectDetail;
