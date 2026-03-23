import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Already logged in → go to dashboard
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://login-signup-yyxk.onrender.com/api/login",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        const token = res.data.user.token;

        // ✅ Save token and user to localStorage
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/dashboard", { replace: true }); // ✅ replace so back button won't return to login
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0f0f13",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-card {
          background: #16161f;
          border: 1px solid #22222e;
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 400px;
        }

        .login-input {
          width: 100%;
          padding: 13px 16px;
          background: #0f0f13;
          border: 1px solid #22222e;
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 14px;
        }
        .login-input::placeholder { color: #444; }
        .login-input:focus { border-color: #4a4a7a; }

        .login-btn {
          width: 100%;
          padding: 13px;
          background: #fff;
          color: #0f0f13;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          margin-top: 4px;
          letter-spacing: 0.02em;
        }
        .login-btn:hover { opacity: 0.9; }
        .login-btn:active { transform: scale(0.99); }
        .login-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .error-box {
          background: #1f1215;
          border: 1px solid #3a1a22;
          color: #f87171;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid #555;
          border-top-color: #111;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-card">

        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: 26,
            fontWeight: 800, color: "#fff", letterSpacing: "-0.03em"
          }}>
            Admin<span style={{ color: "#4f4f7a" }}>Panel</span>
          </div>
          <p style={{ color: "#444", fontSize: 13, marginTop: 8 }}>
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && <div className="error-box">⚠ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Email or Phone"
            value={formData.identifier}
            onChange={handleChange}
            className="login-input"
            required
            autoComplete="username"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
            autoComplete="current-password"
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}