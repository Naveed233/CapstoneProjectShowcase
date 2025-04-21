// File: frontend/src/pages/SubmitProject.jsx

import { useState, useEffect } from "react";
import axios from "../api/axios";
import ReactMarkdown from "react-markdown";

export default function SubmitProject() {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    building: "",
    tags: "",
    difficulty: "Beginner",
    repoUrl: "",
    branch: "main",
    demoUrl: "",
    videoUrl: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [assets, setAssets]         = useState([]);
  const [ciBadge, setCiBadge]       = useState(null);
  const [oneWord, setOneWord]       = useState("");
  const [bug, setBug]               = useState("");
  const [nextSkill, setNextSkill]   = useState("");
  const [newVersionDesc, setNewVersionDesc] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // TODO: fetch existing history for a project
    // axios.get("/projects/1/history").then(res => setHistory(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (setter) => (e) => {
    const files = e.target.files;
    if (setter === setAssets) {
      setter(Array.from(files));
    } else {
      setter(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (thumbnail) fd.append("thumbnail", thumbnail);
    assets.forEach((f) => fd.append("assets", f));
    if (ciBadge) fd.append("ciBadge", ciBadge);
    fd.append("oneWord", oneWord);
    fd.append("bug", bug);
    fd.append("nextSkill", nextSkill);
    fd.append("newVersionDesc", newVersionDesc);

    try {
      await axios.post("/projects", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Submitted!");
      // TODO: refresh history
    } catch {
      alert("❌ Submission failed");
    }
  };

  return (
    <div className="px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Submit Your Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Metadata */}
        <div className="space-y-2">
          <label>Title *</label>
          <input
            name="title" value={form.title} onChange={handleChange}
            required className="w-full p-2 border rounded"
          />

          <label>Brief Summary *</label>
          <input
            name="summary" value={form.summary} onChange={handleChange}
            required className="w-full p-2 border rounded"
          />

          <label>Detailed Description (Markdown)</label>
          <textarea
            name="description" rows={6} value={form.description}
            onChange={handleChange} className="w-full p-2 border rounded"
          />
          <div className="border p-2 rounded bg-gray-50">
            <h2 className="font-medium">Preview:</h2>
            <ReactMarkdown>{form.description}</ReactMarkdown>
          </div>

          <label>Category/Building</label>
          <select
            name="building" value={form.building}
            onChange={handleChange} className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option>Building 1</option>
            <option>Building 2</option>
          </select>

          <label>Tags (comma‑separated)</label>
          <input
            name="tags" value={form.tags} onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label>Difficulty Level</label>
          <select
            name="difficulty" value={form.difficulty}
            onChange={handleChange} className="w-full p-2 border rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* 2. Code & Demo Links */}
        <div className="space-y-2">
          <label>Repository URL</label>
          <input
            name="repoUrl" value={form.repoUrl} onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label>Branch</label>
          <input
            name="branch" value={form.branch} onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label>Live Demo URL</label>
          <input
            name="demoUrl" value={form.demoUrl} onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label>Video Preview URL</label>
          <input
            name="videoUrl" value={form.videoUrl} onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 3. File Uploads */}
        <div className="space-y-2">
          <label>Project Snapshot</label>
          <input type="file" accept="image/*" onChange={handleFile(setThumbnail)} />

          <label>Additional Assets</label>
          <input type="file" multiple onChange={handleFile(setAssets)} />

          <label>CI Badge (optional)</label>
          <input type="file" onChange={handleFile(setCiBadge)} />
        </div>

        {/* 4. Fun Prompts */}
        <div className="space-y-2">
          <label>“In one word, my project is…”</label>
          <input
            value={oneWord} onChange={(e) => setOneWord(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <label>“The trickiest bug I squashed was…”</label>
          <input
            value={bug} onChange={(e) => setBug(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <label>“Next Python skill I’m tackling is…”</label>
          <input
            value={nextSkill} onChange={(e) => setNextSkill(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 5. Versioning & Updates */}
        <div className="space-y-2">
          <label>Submit New Version (changelog)</label>
          <textarea
            rows={3} value={newVersionDesc}
            onChange={(e) => setNewVersionDesc(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit New Version
          </button>

          <h3 className="font-medium">Revision History</h3>
          <ul className="list-disc pl-5">
            {history.map((rev, i) => (
              <li key={i}>{rev.date}: {rev.changelog}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white font-bold rounded"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
}
