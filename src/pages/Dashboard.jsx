import { useState } from "react";
import axios from "axios";

const BASE_URL = "https://login-signup-yyxk.onrender.com/api";

const getToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : parsed?.token || parsed?.accessToken || null;
  } catch {
    return raw;
  }
};

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [taskModal, setTaskModal] = useState(null);

  const getUsers = async () => {
    try {
      setLoading(true);
      setActive("users");
      const res = await axios.get(`${BASE_URL}/all-users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setData(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await axios.delete(`${BASE_URL}/delete-user/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    alert(res.data.message || "User deleted successfully");

    // Remove user from UI instantly
    setData((prev) => prev.filter((u) => u._id !== id));

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to delete user");
  }
};

  const getSpecificUser = async (id) => {
    try {
      setModalLoading(true);
      setModalUser({ loading: true });
      const res = await axios.get(`${BASE_URL}/specific-user/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setModalUser(res.data.data);
    } catch (err) {
      console.error(err);
      setModalUser(null);
    } finally {
      setModalLoading(false);
    }
  };

  const getTasks = async () => {
    try {
      setLoading(true);
      setActive("tasks");
      const res = await axios.get(`${BASE_URL}/all-Task`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setData(res.data.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModalUser(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "users", label: "Users", icon: "◎", action: getUsers },
    { id: "tasks", label: "Tasks", icon: "✦", action: getTasks },
  ];

  const initials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatDate = (d) => d ? new Date(d).toLocaleString() : "—";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#0b0b14" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #13131e; }
        ::-webkit-scrollbar-thumb { background: #2e2e50; border-radius: 2px; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: 10px;
          cursor: pointer; transition: all 0.2s;
          color: #555; font-size: 13.5px; font-weight: 500;
          border: 1px solid transparent;
        }
        .nav-item:hover { color: #c4b5fd; background: #16162a; }
        .nav-item.active { color: #c4b5fd; background: #16162a; border-color: #2e2e52; }
        .nav-item .icon { font-size: 15px; width: 20px; text-align: center; }

        .stat-card {
          background: #13131e; border: 1px solid #1e1e32;
          border-radius: 14px; padding: 22px 24px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover { border-color: #3a3a62; transform: translateY(-2px); }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th {
          text-align: left; padding: 12px 18px;
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em;
          text-transform: uppercase; color: #444;
          border-bottom: 1px solid #1a1a2e;
        }
        .data-table td {
          padding: 14px 18px; font-size: 13px; color: #999;
          border-bottom: 1px solid #13131e;
          transition: background 0.15s;
        }
        .data-table tr:hover td { background: #10101a; color: #ccc; }

        .badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 600;
        }
        .badge-admin { background: #1a1a36; color: #a78bfa; border: 1px solid #2d2d5a; }
        .badge-user  { background: #0d2424; color: #2dd4bf; border: 1px solid #1a3e3e; }
        .badge-count { background: #1a1a2e; color: #7070a0; border: 1px solid #28284a; }
        .badge-online { background: #0d2a1a; color: #22c55e; border: 1px solid #1a4a2e; }
        .badge-offline { background: #1a1a2e; color: #555570; border: 1px solid #28284a; }

        .view-btn {
          background: linear-gradient(135deg, #6d28d9, #0d9488);
          color: #fff; padding: 5px 14px; border-radius: 7px;
          border: none; cursor: pointer; font-size: 12px;
          font-weight: 500; transition: opacity 0.15s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .view-btn:hover { opacity: 0.88; transform: scale(1.03); }

        .loading-dot {
          display: inline-block; width: 7px; height: 7px;
          background: #4f46e5; border-radius: 50%; margin: 0 3px;
          animation: bounce 1.2s infinite;
        }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; background: #7c3aed; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; background: #0d9488; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-6px); opacity: 1; }
        }

        .empty-state {
          text-align: center; padding: 60px 20px;
          color: #2a2a42; font-size: 14px;
        }
        .empty-state .emoji { font-size: 32px; margin-bottom: 12px; display: block; }

        /* USER MODAL */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(5, 5, 15, 0.82);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
          padding: 16px;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-box {
          background: #12121e; border: 1px solid #2a2a44;
          border-radius: 18px; width: 100%; max-width: 520px;
          max-height: 88vh; overflow-y: auto;
          animation: slideUp 0.25s ease;
          box-shadow: 0 0 0 1px #1a1a30;
        }
        .modal-header {
          padding: 22px 26px 18px;
          border-bottom: 1px solid #1a1a2e;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px;
        }
        .modal-body { padding: 20px 26px 26px; }
        .modal-close {
          width: 30px; height: 30px; border-radius: 8px;
          background: #1e1e30; border: 1px solid #2a2a42;
          color: #666; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          font-size: 16px; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif; flex-shrink: 0;
        }
        .modal-close:hover { background: #2a2a42; color: #fff; }
        .modal-avatar {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          background: linear-gradient(135deg, #4f46e5, #0d9488);
          color: #fff; flex-shrink: 0;
        }
        .info-section {
          background: #0d0d1a; border: 1px solid #1a1a2c;
          border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;
        }
        .info-section-title {
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #3a3a60; margin-bottom: 12px;
        }
        .info-row {
          display: flex; justify-content: space-between;
          align-items: flex-start; padding: 7px 0;
          border-bottom: 1px solid #131320; gap: 12px;
          flex-wrap: wrap;
        }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .info-label { font-size: 12px; color: #44446a; font-weight: 500; flex-shrink: 0; }
        .info-value { font-size: 12.5px; color: #b0b0cc; text-align: right; word-break: break-all; }
        .info-value.highlight { color: #a78bfa; }
        .tag {
          display: inline-block; padding: 2px 9px;
          border-radius: 6px; font-size: 11px; font-weight: 600;
          background: #1e1e36; color: #a78bfa; border: 1px solid #2c2c52;
        }
        .tag-teal { background: #0d2222; color: #2dd4bf; border-color: #1a3838; }
        .q-item {
          display: flex; gap: 10px; padding: 9px 0;
          border-bottom: 1px solid #131320; align-items: flex-start;
        }
        .q-item:last-child { border-bottom: none; }
        .q-num {
          width: 20px; height: 20px; border-radius: 6px;
          background: #1e1e36; color: #6060a0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
        }
        .q-text { font-size: 12.5px; color: #9090b0; line-height: 1.5; }
        .q-time { font-size: 10.5px; color: #33334a; margin-top: 3px; }

        /* TASK MODAL */
        .task-modal-box {
          background: #12121e; border: 1px solid #2a2a44;
          border-radius: 18px; width: 100%; max-width: 560px;
          max-height: 90vh; overflow-y: auto;
          animation: slideUp 0.25s ease;
        }
        .task-modal-header {
          padding: 20px 22px 16px;
          border-bottom: 1px solid #1a1a2e;
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px;
        }
        .task-modal-body { padding: 18px 22px 24px; }
        .device-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-top: 4px;
        }
        .device-chip {
          background: #0d0d1a; border: 1px solid #1a1a2c;
          border-radius: 10px; padding: 10px 12px;
        }
        .device-chip-label { font-size: 10px; color: #3a3a60; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
        .device-chip-value { font-size: 12px; color: #9090b0; word-break: break-all; line-height: 1.4; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .sidebar { width: 60px !important; padding: 16px 8px !important; }
          .sidebar .nav-label { display: none; }
          .sidebar .nav-item { justify-content: center; padding: 12px; gap: 0; }
          .sidebar .brand-text { display: none; }
          .sidebar .brand-icon { font-size: 20px; color: #4f46e5; text-align: center; display: block; }
          .sidebar .footer-text { display: none; }
          .main-content { padding: 20px 16px !important; }
          .stat-grid { grid-template-columns: 1fr !important; }
          .data-table th, .data-table td { padding: 10px 10px !important; font-size: 12px !important; }
          .hide-mobile { display: none !important; }
          .task-modal-box { border-radius: 14px; }
          .device-grid { grid-template-columns: 1fr; }
          .modal-body { padding: 16px 16px 20px !important; }
          .task-modal-body { padding: 14px 16px 20px !important; }
          .modal-header { padding: 16px 16px 14px !important; }
          .task-modal-header { padding: 16px 16px 12px !important; }
        }
        @media (max-width: 480px) {
          .data-table { font-size: 11px; }
          .data-table th, .data-table td { padding: 8px 8px !important; }
        }
      `}</style>

      {/* USER DETAIL MODAL */}
      {modalUser && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="modal-avatar">
                  {modalUser.loading ? "…" : initials(modalUser.name)}
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#e0e0f0", letterSpacing: "-0.02em" }}>
                    {modalUser.loading ? "Loading..." : modalUser.name}
                  </div>
                  {!modalUser.loading && (
                    <div style={{ fontSize: 12, color: "#44446a", marginTop: 3 }}>{modalUser.email}</div>
                  )}
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {modalUser.loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0", gap: 4 }}>
                <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
              </div>
            ) : (
              <div className="modal-body">
                <div className="info-section">
                  <div className="info-section-title">Personal Info</div>
                  <div className="info-row"><span className="info-label">Full Name</span><span className="info-value highlight">{modalUser.name || "—"}</span></div>
                  <div className="info-row"><span className="info-label">Mobile</span><span className="info-value">{modalUser.mobile || "—"}</span></div>
                  <div className="info-row"><span className="info-label">Date of Birth</span><span className="info-value">{modalUser.dob || "—"}</span></div>
                  <div className="info-row">
                    <span className="info-label">Role</span>
                    <span className="info-value">
                      <span className={`tag ${modalUser.role === "ADMIN" ? "" : "tag-teal"}`}>{modalUser.role || "USER"}</span>
                    </span>
                  </div>
                </div>
                <div className="info-section">
                  <div className="info-section-title">Identity Documents</div>
                  <div className="info-row"><span className="info-label">Aadhaar</span><span className="info-value">{modalUser.aadhaar || "—"}</span></div>
                  <div className="info-row"><span className="info-label">PAN</span><span className="info-value">{modalUser.pan || "—"}</span></div>
                </div>
                {modalUser.device && (
                  <div className="info-section">
                    <div className="info-section-title">Device & Session</div>
                    <div className="info-row"><span className="info-label">Device</span><span className="info-value">{modalUser.device?.name || "—"}</span></div>
                    <div className="info-row"><span className="info-label">IP Address</span><span className="info-value">{modalUser.device?.ip || "—"}</span></div>
                    <div className="info-row"><span className="info-label">Last Login</span><span className="info-value">{formatDate(modalUser.device?.loginAt)}</span></div>
                  </div>
                )}
                {modalUser.question?.length > 0 && (
                  <div className="info-section">
                    <div className="info-section-title">
                      Questions &nbsp;
                      <span style={{ background: "#1a1a30", color: "#5050a0", padding: "1px 7px", borderRadius: 5, fontSize: 10 }}>
                        {modalUser.question.length}
                      </span>
                    </div>
                    {modalUser.question.map((q, i) => (
                      <div key={i} className="q-item">
                        <div className="q-num">{i + 1}</div>
                        <div>
                          <div className="q-text">{q.question}</div>
                          {q.createTime && <div className="q-time">{formatDate(q.createTime)}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TASK DETAIL MODAL */}
      {taskModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setTaskModal(null)}>
          <div className="task-modal-box">
            {/* Header */}
            <div className="task-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, #4f46e520, #0d948820)",
                  border: "1px solid #2a2a40",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#7070b0",
                  fontFamily: "'Syne', sans-serif"
                }}>
                  {initials(taskModal.name)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#e0e0f0", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {taskModal.name || "Unknown User"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10.5, color: "#33334a" }}>{taskModal.userId}</span>
                    <span className={`badge ${taskModal.status === "online" ? "badge-online" : "badge-offline"}`} style={{ padding: "2px 8px", fontSize: 10 }}>
                      {taskModal.status === "online" ? "● online" : "○ offline"}
                    </span>
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setTaskModal(null)}>✕</button>
            </div>

            <div className="task-modal-body">

              {/* Last Active */}
              {taskModal.lastActive && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a3a60", marginBottom: 6 }}>Last Active</div>
                  <div style={{ fontSize: 12.5, color: "#7070a0", background: "#0d0d1a", border: "1px solid #1a1a2c", borderRadius: 8, padding: "8px 12px" }}>
                    {formatDate(taskModal.lastActive)}
                  </div>
                </div>
              )}

              {/* Device */}
              {taskModal.device && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a3a60", marginBottom: 8 }}>Device & Session</div>
                  <div className="device-grid">
                    <div className="device-chip">
                      <div className="device-chip-label">Device</div>
                      <div className="device-chip-value">{taskModal.device.name || "—"}</div>
                    </div>
                    <div className="device-chip">
                      <div className="device-chip-label">Login Time</div>
                      <div className="device-chip-value">{formatDate(taskModal.device.loginAt)}</div>
                    </div>
                    <div className="device-chip" style={{ gridColumn: "1 / -1" }}>
                      <div className="device-chip-label">IP Address</div>
                      <div className="device-chip-value">{taskModal.device.ip || "—"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a3a60" }}>Questions</div>
                  <span style={{ background: "#1a1a30", color: "#5050a0", padding: "1px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600 }}>
                    {taskModal.question?.length || 0}
                  </span>
                </div>
                <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2c", borderRadius: 10, padding: "4px 14px", maxHeight: 280, overflowY: "auto" }}>
                  {(taskModal.question || []).map((q, idx) => (
                    <div key={idx} className="q-item">
                      <div className="q-num">{idx + 1}</div>
                      <div>
                        <div className="q-text">{q.question?.trim() || <span style={{ color: "#33334a", fontStyle: "italic" }}>empty</span>}</div>
                        {q.createTime && <div className="q-time">{formatDate(q.createTime)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="sidebar" style={{
        width: 220, background: "#0a0a12",
        borderRight: "1px solid #16162a",
        padding: "26px 14px", display: "flex",
        flexDirection: "column", gap: 3, flexShrink: 0,
        transition: "width 0.2s"
      }}>
        <div style={{ padding: "0 8px 22px", borderBottom: "1px solid #16162a", marginBottom: 8 }}>
          <span className="brand-icon" style={{ display: "none" }}>⊞</span>
          <div className="brand-text">
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Admin<span style={{ color: "#4f46e5" }}>Panel</span>
            </div>
            <div style={{ fontSize: 10.5, color: "#2a2a44", marginTop: 4, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Control Center
            </div>
          </div>
        </div>

        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => item.action ? item.action() : setActive(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}

        <div style={{ marginTop: "auto", padding: "16px 8px 0", borderTop: "1px solid #16162a" }}>
          <div className="footer-text" style={{ fontSize: 10.5, color: "#2a2a44", textTransform: "uppercase", letterSpacing: "0.06em" }}>Logged in as</div>
          <div className="footer-text" style={{ fontSize: 13, color: "#666", marginTop: 4, fontWeight: 500 }}>
            {JSON.parse(localStorage.getItem("user") || "{}")?.name || "Admin"}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content" style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 27, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                Good day 👋
              </h1>
              <p style={{ color: "#3a3a5a", fontSize: 13.5, marginTop: 6 }}>Here's what's happening in your system.</p>
            </div>

            <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Users", value: "8", icon: "◎", color: "#a78bfa", glow: "#4f46e5" },
                { label: "Active Tasks", value: "64", icon: "✦", color: "#2dd4bf", glow: "#0d9488" },
                { label: "Pending", value: "12", icon: "◷", color: "#fb923c", glow: "#c2410c" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 10.5, color: "#333355", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 38, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#fff", marginTop: 8, letterSpacing: "-0.05em" }}>{s.value}</div>
                    </div>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: `${s.glow}18`, border: `1px solid ${s.glow}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, color: s.color
                    }}>{s.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#13131e", border: "1px solid #1e1e32", borderRadius: 14, padding: "20px 24px" }}>
              <p style={{ color: "#2e2e4e", fontSize: 13 }}>
                Click <strong style={{ color: "#4f46e5" }}>Users</strong> or <strong style={{ color: "#0d9488" }}>Tasks</strong> in the sidebar to load data.
              </p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, gap: 4 }}>
            <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
          </div>
        )}

        {/* USERS */}
        {active === "users" && !loading && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>Users</h2>
              <p style={{ color: "#3a3a5a", fontSize: 13, marginTop: 4 }}>{data.length} registered accounts</p>
            </div>
            <div style={{ background: "#13131e", border: "1px solid #1e1e32", borderRadius: 14, overflow: "hidden", overflowX: "auto" }}>
              {data.length === 0 ? (
                <div className="empty-state"><span className="emoji">◎</span>No users found</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Name</th><th>Email</th>
                      <th className="hide-mobile">Mobile</th>
                      <th className="hide-mobile">Status</th>
                      <th>Role</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((u, i) => (
                      <tr key={i}>
                        <td style={{ color: "#2a2a44", fontSize: 12 }}>{i + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: 8,
                              background: "linear-gradient(135deg, #4f46e520, #0d948820)",
                              border: "1px solid #2a2a40",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, fontWeight: 700, color: "#7070b0", flexShrink: 0
                            }}>{initials(u.name)}</div>
                            <span style={{ color: "#ddd", fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td className="hide-mobile">{u.mobile || "—"}</td>
                        <td className="hide-mobile">{u.status || "offline"}</td>
                        <td>
                          <span className={`badge ${u.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>{u.role}</span>
                        </td>
                        <td>
                          <button className="view-btn" onClick={() => getSpecificUser(u._id)}>View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TASKS */}
        {active === "tasks" && !loading && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>Tasks</h2>
              <p style={{ color: "#3a3a5a", fontSize: 13, marginTop: 4 }}>{data.length} users with task data</p>
            </div>

            <div style={{ background: "#13131e", border: "1px solid #1e1e32", borderRadius: 14, overflow: "hidden", overflowX: "auto" }}>
              {data.length === 0 ? (
                <div className="empty-state"><span className="emoji">✦</span>No tasks found</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th className="hide-mobile">User ID</th>
                      <th>Status</th>
                      <th className="hide-mobile">Device</th>
                      <th className="hide-mobile">Last Active</th>
                      <th>Questions</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((t, i) => (
                      <tr key={i}>
                        <td style={{ color: "#2a2a44", fontSize: 12 }}>{i + 1}</td>

                        {/* Name */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                              background: "linear-gradient(135deg, #4f46e520, #0d948820)",
                              border: "1px solid #2a2a40",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, fontWeight: 700, color: "#7070b0"
                            }}>{initials(t.name)}</div>
                            <span style={{ color: "#ddd", fontWeight: 500, whiteSpace: "nowrap" }}>{t.name || "—"}</span>
                          </div>
                        </td>

                        {/* User ID */}
                        <td className="hide-mobile" style={{ fontFamily: "monospace", fontSize: 11, color: "#33334a" }}>
                          {t.userId}
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${t.status === "online" ? "badge-online" : "badge-offline"}`}>
                            {t.status === "online" ? "● online" : "○ offline"}
                          </span>
                        </td>

                        {/* Device */}
                        <td className="hide-mobile" style={{ fontSize: 12, color: "#55557a", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.device?.name || "—"}
                        </td>

                        {/* Last Active */}
                        <td className="hide-mobile" style={{ fontSize: 11.5, color: "#44446a", whiteSpace: "nowrap" }}>
                          {t.lastActive ? new Date(t.lastActive).toLocaleDateString() : "—"}
                        </td>

                        {/* Questions count */}
                        <td>
                          <span className="badge badge-count">{t.question?.length || 0} Q</span>
                        </td>

                        {/* Action */}
                        <td>
                          <button className="view-btn" onClick={() => setTaskModal(t)}>
                            View Tasks
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}



// for card view 
// {active === "tasks" && !loading && (
//   <div>
//     {/* Header */}
//     <div style={{ marginBottom: 24 }}>
//       <h2 style={{
//         fontFamily: "'Syne', sans-serif",
//         fontSize: 22,
//         fontWeight: 800,
//         color: "#fff"
//       }}>
//         Tasks
//       </h2>
//       <p style={{ color: "#3a3a5a", fontSize: 13, marginTop: 4 }}>
//         {data.length} users with task data
//       </p>
//     </div>

//     {/* CARD GRID */}
//     {data.length === 0 ? (
//       <div className="empty-state">
//         <span className="emoji">✦</span>No tasks found
//       </div>
//     ) : (
//       <div className="card-grid">
//         {data.map((t, i) => (
//           <div className="task-card" key={i}>

//             {/* Top Section */}
//             <div className="card-header">
//               <div className="avatar">
//                 {initials(t.name)}
//               </div>

//               <div>
//                 <h4>{t.name || "—"}</h4>
//                 <p className="user-id">{t.userId}</p>
//               </div>

//               <span className={`status ${t.status}`}>
//                 {t.status === "online" ? "● Online" : "○ Offline"}
//               </span>
//             </div>

//             {/* Body */}
//             <div className="card-body">
//               <p><strong>Device:</strong> {t.device?.name || "—"}</p>
//               <p><strong>Last Active:</strong> {
//                 t.lastActive
//                   ? new Date(t.lastActive).toLocaleDateString()
//                   : "—"
//               }</p>
//             </div>

//             {/* Footer */}
//             <div className="card-footer">
//               <span className="question-badge">
//                 {t.question?.length || 0} Questions
//               </span>

//               <button onClick={() => setTaskModal(t)}>
//                 View Tasks
//               </button>
//             </div>

//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// )}