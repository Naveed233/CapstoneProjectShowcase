// File: frontend/src/pages/ProjectDetail.jsx

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

  const getEmbeddedVideo = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch")) {
      const embedUrl = url.replace("watch?v=", "embed/");
      return <iframe src={embedUrl} className="w-full h-64 mb-4 rounded" allowFullScreen />;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return <iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-64 mb-4 rounded" allowFullScreen />;
    }
    if (url.includes("drive.google.com")) {
      return <iframe src={url} className="w-full h-64 mb-4 rounded" allowFullScreen />;
    }
    return (
      <video controls className="w-full mb-4">
        <source src={url} />
      </video>
    );
  };

  if (!project) return <p className="text-center p-10">Loading project...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="mb-4">{project.description}</p>

      {project.image_url && (
        <img src={project.image_url} alt={project.title} className="mb-4 rounded" />
      )}

      {getEmbeddedVideo(project.video_url)}

      <p className="text-sm text-gray-600 mb-1">Votes: {project.votes}</p>
      <p className="text-sm text-gray-600 mb-1">Team: {project.team?.name || "Unknown"}</p>
      <p className="text-sm text-gray-600 mb-1">Members: {project.members || "N/A"}</p>
      <p className="text-sm text-gray-600 mb-4">Building: {project.building || "N/A"}</p>

      {/* ✅ Comment Section */}
      <CommentSection projectId={project.id} />
    </div>
  );
}

export default ProjectDetail;
