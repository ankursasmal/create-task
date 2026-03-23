import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://login-signup-yyxk.onrender.com/api/login",
        formData,
         { withCredentials: true }
      );

      if (res.data.success) {
        const token = res.data.user.token;
        console.log("Full login response:", res.data);


        // 🔥 STORE TOKEN
      localStorage.setItem("token", JSON.stringify(token));
localStorage.setItem("user", JSON.stringify(res.data.user));
        

        alert("Login successful");
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-96">

        <h2 className="text-3xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="identifier"
            placeholder="Email or Phone"
            value={formData.identifier}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />

          <button className="w-full bg-blue-500 text-white p-3 rounded">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}