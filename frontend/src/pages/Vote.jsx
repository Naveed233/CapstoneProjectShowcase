// File: frontend/src/pages/Vote.jsx

import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function Vote() {
  const [categories, setCategories] = useState([]);
  const [projects,   setProjects]   = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [newCat,      setNewCat]      = useState("");

  useEffect(() => {
    axios.get("/categories").then(r => setCategories(r.data));
    axios.get("/projects").then(r => setProjects(r.data));
  }, []);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    const res = await axios.post("/categories", { name: newCat });
    setCategories((c) => [...c, res.data]);
    setNewCat("");
  };

  const handleVote = async (projectId) => {
    if (!selectedCat) return alert("Pick a category first");
    try {
      await axios.post(`/vote`, {
        project_id: projectId,
        category: selectedCat,
      });
      setProjects((p) =>
        p.map((pr) =>
          pr.id === projectId ? { ...pr, votes: pr.votes + 1 } : pr
        )
      );
    } catch {
      alert("You’ve already voted in this category.");
    }
  };

  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Vote for Your Favorites</h1>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.name)}
            className={`px-4 py-2 rounded ${
              selectedCat === c.name
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {c.name}
          </button>
        ))}
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="+ Add category"
          className="px-3 py-2 border rounded"
        />
        <button onClick={addCategory} className="px-3 py-2 bg-blue-600 text-white rounded">
          Create
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div key={p.id} className="bg-white shadow rounded p-4 flex flex-col">
            <img
              src={p.thumbnail_url || p.image_url}
              alt={p.title}
              className="h-40 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="text-gray-700 flex-1">{p.summary}</p>
            <p className="mt-2 font-medium">
              Votes in “{selectedCat}”: {p.votes || 0}
            </p>
            <button
              onClick={() => handleVote(p.id)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
);
}
