import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/projects")
      .then(res => setProjects(res.data))
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  const getMediaItems = (project) => {
    const items = [];

    // multiple images
    if (project.image_urls?.length) {
      project.image_urls.forEach(url =>
        items.push({ original: url, thumbnail: url })
      );
    } else if (project.image_url) {
      items.push({ original: project.image_url, thumbnail: project.image_url });
    }

    // optional video
    if (project.video_url) {
      const embed = project.video_url.replace("watch?v=", "embed/");
      items.push({
        original: embed,
        thumbnail: project.image_url || "",
        renderItem: () => (
          <iframe
            src={embed}
            width="100%"
            height="300"
            frameBorder="0"
            allowFullScreen
            title="Video"
          />
        )
      });
    }

    return items;
  };

  if (loading) return <p className="p-4">Loading projects…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded shadow p-6 flex flex-col">
            <ImageGallery
              items={getMediaItems(project)}
              showPlayButton={false}
              showFullscreenButton={false}
            />
            <h2 className="text-2xl font-semibold mt-4">{project.title}</h2>
            <p className="text-gray-700 mt-2 mb-4 flex-1">{project.description}</p>
            <button
              onClick={() => navigate(`/project/${project.id}`)}
              className="mt-auto text-red-600 underline"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
