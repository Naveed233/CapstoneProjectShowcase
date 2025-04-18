// File: src/api/axios.js

import axios from "axios";

// Use .env value if defined, otherwise fall back to live backend
const BASE_URL = import.meta.env.VITE_API_URL || "https://capstoneprojectshowcase.onrender.com";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
