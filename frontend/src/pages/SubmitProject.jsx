// File: frontend/src/pages/SubmitProject.jsx

import { useEffect, useState } from "react";
import axios from "../api/axios";

function SubmitProject() {
  const [form, setForm] = useState({
    team_id: "",
    title: "",
    description: "",
    image_url: "",
    video_url: "",
    github_url: "",
    live_demo_url: "",
    members: "",
    building: ""
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamMode, setTeamMode] = useState("existing"); // 'existing' or 'new'
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    axios.get("/teams")
      .then((res) => setTeams(res.data))
      .catch((err) => console.error("Failed to load teams:", err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let selectedTeamId = form.team_id;

      // If creating a new team
      if (teamMode === "new" && newTeamName.trim()) {
        const res = await axios.post("/teams", { name: newTeamName });
        selectedTeamId = res.data.id;
      }

      const payload = { ...form, team_id: selectedTeamId };
      await axios.post("/projects", payload);
      alert("✅ Project submitted!");

      // Clear form
      setForm({
        team_id: "",
        Project_Title: "",
        Project_Description: "",
        Image_url: "",
        Video_url: "",
        Github_url: "",
        Live_demo_url: "",
        Members: "",
        building: ""
      });
      setNewTeamName("");
      setTeamMode("existing");

      // Reload teams
      const refreshed = await axios.get("/teams");
      setTeams(refreshed.data);

    } catch (err) {
      alert("❌ Submission failed");
      console.error("Submission error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pink-500 min-h-screen text-lime-300 px-10 py-12 font-[Comic_Sans_MS]">
      <h2 className="text-3xl mb-6 font-bold text-center">Submit Your Project</h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 max-w-2xl mx-auto text-left text-black bg-white p-6 rounded shadow"
      >
        {/* --- Team Selection Mode --- */}
        <div className="flex gap-4">
          <button type="button" onClick={() => setTeamMode("existing")}
            className={`px-3 py-1 rounded ${teamMode === "existing" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Existing Team</button>
          <button type="button" onClick={() => setTeamMode("new")}
            className={`px-3 py-1 rounded ${teamMode === "new" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>New Team</button>
        </div>

        {/* --- Team Select or Input --- */}
        {teamMode === "new" ? (
          <input
            type="text"
            placeholder="Enter new team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="p-2 rounded border border-gray-300"
            required
          />
        ) : (
          <select
            name="team_id"
            value={form.team_id}
            onChange={handleChange}
            className="p-2 rounded"
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        )}

        {/* Input fields */}
        {["title", "description", "image_url", "video_url", "github_url", "live_demo_url", "members"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/_/g, " ")}
            value={form[field] || ""}
            onChange={handleChange}
            className="p-2 rounded border border-gray-300"
            required
          />
        ))}

        <select
          name="building"
          value={form.building}
          onChange={handleChange}
          className="p-2 rounded"
          required
        >
          <option value="">Select Building</option>
          <option value="Building 1">Building 1</option>
          <option value="Building 2">Building 2</option>
        </select>

        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="max-w-2xl mx-auto mt-10 text-left bg-white text-black p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-2">🧪 Live Preview</h3>
        <p><strong>Title:</strong> {form.title}</p>
        <p><strong>Description:</strong> {form.description}</p>
        <p><strong>Team:</strong> {teamMode === "new" ? newTeamName : teams.find(t => t.id === parseInt(form.team_id))?.name || "None"}</p>
        <p><strong>Members:</strong> {form.members}</p>
        <p><strong>Building:</strong> {form.building}</p>
        {form.Image_url && <img src={form.Image_url} alt="Preview" className="w-full my-4 rounded" />}
        {form.Video_url && (
          <iframe
            src={form.Video_url.replace("watch?v=", "embed/")}
            className="w-full h-64 mb-4 rounded"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <p><strong>GitHub:</strong> <a href={form.Github_url} className="text-blue-600 underline" target="_blank" rel="noreferrer">{form.Github_url}</a></p>
        <p><strong>Live Demo:</strong> <a href={form.Live_demo_url} className="text-blue-600 underline" target="_blank" rel="noreferrer">{form.Live_demo_url}</a></p>
      </div>
    </div>
  );
}

export default SubmitProject;
