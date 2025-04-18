// File: frontend/src/pages/SubmitProject.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubmitProject = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    video_url: '',
    github_url: '',
    live_demo_url: '',
    members: '',
    building: '',
    team_id: ''
  });

  const [teams, setTeams] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('https://capstoneprojectshowcase.onrender.com/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error('Error fetching teams:', err));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.team_id) newErrors.team_id = 'Team selection is required';
    if (!form.building) newErrors.building = 'Building is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image_url' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(files[0]);
      setForm((prev) => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('https://capstoneprojectshowcase.onrender.com/projects', form);
      alert('✅ Project submitted successfully!');
      console.log(res.data);
    } catch (err) {
      console.error('❌ Submission failed:', err);
      alert('Error submitting project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-xl mx-auto bg-white shadow-lg rounded">
      <h2 className="text-xl font-bold text-center">Submit Your Project</h2>

      {Object.entries(form).map(([key, value]) => (
        key === 'team_id' ? (
          <div key={key}>
            <label className="block mb-1 font-medium">Select Team</label>
            <select
              name="team_id"
              value={form.team_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select a Team --</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            {errors.team_id && <p className="text-red-500 text-sm">{errors.team_id}</p>}
          </div>
        ) : key === 'image_url' ? (
          <div key={key}>
            <label className="block mb-1 font-medium">Upload Image</label>
            <input
              type="file"
              name="image_url"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 rounded h-32 object-contain" />}
          </div>
        ) : (
          <div key={key}>
            <label className="block mb-1 font-medium">{key.replace('_', ' ')}</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required={key !== 'video_url' && key !== 'live_demo_url' && key !== 'github_url'}
            />
            {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
          </div>
        )
      ))}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit Project
      </button>
    </form>
  );
};

export default SubmitProject;
