// File: frontend/src/pages/Home.jsx

import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const projectsRef = useRef(null);

  useEffect(() => {
    axios.get("/projects")
      .then(res => setProjects(res.data))
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMediaItems = (project) => {
    const items = [];

    // Handle multiple images if backend sends image_urls array,
    // or fall back to single image_url string
    if (project.image_urls && project.image_urls.length) {
      project.image_urls.forEach(url =>
        items.push({ original: url, thumbnail: url })
      );
    } else if (project.image_url) {
      items.push({ original: project.image_url, thumbnail: project.image_url });
    }

    // If there's a video URL, embed it as its own slide
    if (project.video_url) {
      const embedUrl = project.video_url.includes("youtube")
        ? project.video_url.replace("watch?v=", "embed/")
        : project.video_url;

      items.push({
        original: embedUrl,
        thumbnail: project.image_url || "",
        renderItem: () => (
          <div className="image-gallery-image">
            <iframe
              src={embedUrl}
              width="100%"
              height="300"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video"
            />
          </div>
        ),
      });
    }

    return items;
  };

  return (
    <div className="bg-gray-100 font-sans text-center">

      {/* — Hero Section — */}
      <section
        id="home"
        className="relative bg-gray-200 h-screen flex flex-col justify-center items-center px-4"
      >
        <h1 className="text-5xl font-extrabold mb-4">Welcome</h1>
        <p className="text-lg mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <button
          onClick={scrollToProjects}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg uppercase tracking-wider hover:bg-gray-800 transition"
        >
          View Projects
        </button>
      </section>

      {/* — Latest Projects — */}
      <section
        id="projects"
        ref={projectsRef}
        className="py-16 px-4"
      >
        <h2 className="text-3xl font-bold mb-10">Latest Projects</h2>

        {loading && <p className="text-lg font-medium">Loading...</p>}
        {error   && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && !error && projects.map(project => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col"
            >
              {/* slideshow */}
              <ImageGallery
                items={getMediaItems(project)}
                showPlayButton={false}
                showFullscreenButton={false}
              />

              <h3 className="text-xl font-bold mt-4">{project.title}</h3>
              <p className="text-gray-700 mt-2 mb-4">
                {project.description}
              </p>
              <button
                onClick={() => navigate(`/project/${project.id}`)}
                className="mt-auto text-red-600 underline"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* — About Section — */}
      <div className="px-4 py-16 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-center">About This Showcase</h1>
        <div className="max-w-3xl mx-auto text-lg text-gray-700 space-y-4">
          <p>
            The Capstone Project Showcase is a place for students to share their
            final projects, get peer feedback, and build a portfolio of their work.
          </p>
          <p>
            Browse through the latest submissions, learn from each other, and
            celebrate the innovative solutions built during our boot camp.
          </p>
          <p>
            If you have any questions or want to contribute, feel free to reach
            out to the team via the “My Team” page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
