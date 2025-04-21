// File: frontend/src/pages/Profile.jsx

import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState(null);
  const [profile, setProfile] = useState({
    aboutMe: "",
    q1: "",
    q2: "",
    q3: "",
    photoUrl: "",
  });

  // fetch existing profile
  useEffect(() => {
    axios.get("/profile")
      .then((res) => setProfile(res.data))
      .catch(() => {})         // ignore if none yet
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("aboutMe", profile.aboutMe);
    formData.append("q1", profile.q1);
    formData.append("q2", profile.q2);
    formData.append("q3", profile.q3);
    if (photoFile) formData.append("photo", photoFile);

    try {
      await axios.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile saved!");
    } catch {
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo */}
        <div>
          <label className="block mb-1 font-medium">Photo</label>
          {profile.photoUrl && (
            <img
              src={profile.photoUrl}
              alt="Profile"
              className="w-32 h-32 object-cover rounded mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </div>

        {/* About Me */}
        <div>
          <label className="block mb-1 font-medium">About Me</label>
          <textarea
            name="aboutMe"
            value={profile.aboutMe}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Questions */}
        {[
          { name: "q1", label: "1. When did you start learning Python?" },
          { name: "q2", label: "2. What was the first thing you built with Python?" },
          { name: "q3", label: "3. What’s the next Python skill you want to learn?" },
        ].map((q) => (
          <div key={q.name}>
            <label className="block mb-1 font-medium">{q.label}</label>
            <input
              type="text"
              name={q.name}
              value={profile[q.name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {loading ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
