// File: frontend/src/pages/MyTeam.jsx

import { useState, useEffect } from "react";
import axios from "../api/axios";

const DAYS = [1, 2, 3, 4, 5];

export default function MyTeam() {
  const [allTeams, setAllTeams]       = useState([]);
  const [myTeams, setMyTeams]         = useState([]);
  const [view, setView]               = useState("choose"); // "choose" | "make" | "join" | "diary"
  const [selectedTeam, setSelectedTeam] = useState(null);

  // For “Make a Team”
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    logo_url: ""
  });

  // Shared diary state
  const [entries, setEntries] = useState({});
  const [loadingDiary, setLoadingDiary] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  // Fetch lists on mount
  useEffect(() => {
    fetchAllTeams();
    fetchMyTeams();
  }, []);

  async function fetchAllTeams() {
    const res = await axios.get("/teams");
    setAllTeams(res.data);
  }
  async function fetchMyTeams() {
    const res = await axios.get("/users/me/teams"); // you'll implement this
    setMyTeams(res.data);
  }

  // CREATE team
  const handleMakeTeam = async (e) => {
    e.preventDefault();
    const res = await axios.post("/teams", newTeam);
    // auto-join creator
    await axios.post(`/teams/${res.data.id}/add-member`, { user_id: /*current user id*/ 1 });
    await fetchAllTeams();
    await fetchMyTeams();
    setSelectedTeam(res.data);
    setView("diary");
  };

  // JOIN team
  const joinTeam = async (teamId) => {
    await axios.post(`/teams/${teamId}/add-member`, { user_id: /*current user id*/ 1 });
    await fetchMyTeams();
    const team = allTeams.find(t => t.id === teamId);
    setSelectedTeam(team);
    setView("diary");
  };

  // LEAVE team
  const leaveTeam = async (teamId) => {
    await axios.delete(`/teams/${teamId}/remove-member`, {
      data: { user_id: /*current user id*/ 1 }
    });
    await fetchMyTeams();
    setView("choose");
  };

  // DELETE team
  const deleteTeam = async (teamId) => {
    await axios.delete(`/teams/${teamId}`);
    await fetchAllTeams();
    await fetchMyTeams();
    setView("choose");
  };

  // FETCH diary for selected team
  useEffect(() => {
    if (view === "diary" && selectedTeam) {
      setLoadingDiary(true);
      axios.get(`/teams/${selectedTeam.id}/entries`)
        .then(res => setEntries(res.data))
        .finally(() => setLoadingDiary(false));
    }
  }, [view, selectedTeam]);

  const dayData = entries[currentDay] || {
    did: "",
    learned: "",
    blockers: "",
    tasks: [],
    newTask: "",
    feedback: "",
    link: "",
    screenshot: null,
  };

  const handleField = (field, value) =>
    setEntries({
      ...entries,
      [currentDay]: { ...dayData, [field]: value },
    });

  const addTask = () => {
    if (!dayData.newTask.trim()) return;
    handleField("tasks", [...dayData.tasks, { text: dayData.newTask, done: false }]);
    handleField("newTask", "");
  };

  const toggleTask = (idx) => {
    const updated = dayData.tasks.map((t, i) =>
      i === idx ? { ...t, done: !t.done } : t
    );
    handleField("tasks", updated);
  };

  const handleSave = () => {
    const payload = { day: currentDay, user_id: /*current user id*/1, ...entries[currentDay] };
    const fm = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === "screenshot" && v) fm.append(k, v);
      else if (k === "tasks") fm.append(k, JSON.stringify(v));
      else fm.append(k, v);
    });

    axios.post(`/teams/${selectedTeam.id}/entries`, fm, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => alert("Saved!"))
      .catch(() => alert("Save failed."));
  };

  // RENDER
  if (view === "choose") {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold">My Team</h2>
        <button
          onClick={() => setView("make")}
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Make a Team
        </button>
        <button
          onClick={() => setView("join")}
          className="w-full py-2 bg-green-600 text-white rounded"
        >
          Join a Team
        </button>
      </div>
    );
  }

  if (view === "make") {
    return (
      <div className="max-w-lg mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Team</h2>
        <form onSubmit={handleMakeTeam} className="space-y-4">
          <div>
            <label className="block">Team Name</label>
            <input
              name="name"
              value={newTeam.name}
              onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
              required className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Description</label>
            <textarea
              name="description"
              value={newTeam.description}
              onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
              rows={3} className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Logo URL</label>
            <input
              name="logo_url"
              value={newTeam.logo_url}
              onChange={e => setNewTeam({ ...newTeam, logo_url: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
            Create Team
          </button>
          <button type="button" onClick={() => setView("choose")} className="mt-2 text-sm text-gray-600">
            Cancel
          </button>
        </form>
      </div>
    );
  }

  if (view === "join") {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold">Available Teams</h2>
        {allTeams
          .filter(t => !myTeams.some(mt => mt.id === t.id))
          .map(team => (
            <div key={team.id} className="flex justify-between items-center p-4 border rounded">
              <span>{team.name}</span>
              <button
                onClick={() => joinTeam(team.id)}
                className="py-1 px-3 bg-green-600 text-white rounded"
              >
                Join
              </button>
            </div>
          ))
        }
        <button onClick={() => setView("choose")} className="mt-4 text-sm text-gray-600">
          Back
        </button>
      </div>
    );
  }

  // view === "diary"
  if (view === "diary" && selectedTeam) {
    if (loadingDiary) return <p className="p-4">Loading diary…</p>;
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-2">{selectedTeam.name} Daily Diary</h2>
        <p className="mb-4">{selectedTeam.description}</p>
        <div className="flex mb-6">
          <button
            onClick={() => leaveTeam(selectedTeam.id)}
            className="mr-2 px-4 py-1 bg-yellow-500 text-white rounded"
          >
            Leave Team
          </button>
          <button
            onClick={() => deleteTeam(selectedTeam.id)}
            className="px-4 py-1 bg-red-600 text-white rounded"
          >
            Delete Team
          </button>
        </div>

        {/* Diary Stepper */}
        <div className="flex justify-between mb-8">
          {DAYS.map(d => {
            const done = entries[d]?.tasks?.every(t => t.done);
            return (
              <button
                key={d}
                onClick={() => setCurrentDay(d)}
                className={`flex-1 py-2 mx-1 rounded ${
                  currentDay === d
                    ? "bg-red-600 text-white"
                    : done
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Day {d}
              </button>
            );
          })}
        </div>

        {/* Diary Form */}
        <div className="space-y-4">
          {/* ...reuse your existing diary fields here... */}
          {/* Example: */}
          <div>
            <label className="block font-medium">What did we do today?</label>
            <textarea
              rows={3}
              value={dayData.did}
              onChange={e => handleField("did", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* tasks, link, screenshot, feedback... */}
          <button
            onClick={handleSave}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
          >
            Save Day {currentDay}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
