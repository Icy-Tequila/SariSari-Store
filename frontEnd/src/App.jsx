import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/api/auth/${mode}`;

    try {
      const res = await axios.post(url, formData);
      setMessage(res.data.message || `${mode} successful!`);
      if (mode === "login" && res.status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signup" ? "login" : "signup"));
    setMessage("");
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4">
      <div className="bg-white backdrop-blur-md bg-opacity-80 shadow-2xl rounded-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600 text-sm">Username</label>
            <input
              type="text"
              name="username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your username"
              onChange={handleChange}
              value={formData.username}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 text-sm">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your password"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            {mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {mode === "signup" ? "Login here" : "Sign up here"}
          </button>
        </p>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
