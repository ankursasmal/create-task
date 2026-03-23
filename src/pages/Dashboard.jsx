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
  const [expandedUser, setExpandedUser] = useState(null);

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

  const getTasks = async () => {
    try {
      setLoading(true);
      setActive("tasks");
      const res = await axios.get(`${BASE_URL}/all-Task`, {
        withCredentials:true,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setData(res.data.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "users", label: "Users", icon: "◎", action: getUsers },
    { id: "tasks", label: "Tasks", icon: "✦", action: getTasks },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#0f0f13" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1a22; }
        ::-webkit-scrollbar-thumb { background: #3a3a52; border-radius: 2px; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 10px;
          cursor: pointer; transition: all 0.2s;
          color: #666; font-size: 14px; font-weight: 500;
          border: 1px solid transparent;
        }
        .nav-item:hover { color: #fff; background: #1e1e2a; }
        .nav-item.active { color: #fff; background: #1e1e2a; border-color: #2e2e42; }
        .nav-item .icon { font-size: 16px; width: 20px; text-align: center; }

        .stat-card {
          background: #16161f; border: 1px solid #22222e;
          border-radius: 14px; padding: 24px;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: #3a3a52; }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th {
          text-align: left; padding: 12px 16px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #555;
          border-bottom: 1px solid #1e1e2a;
        }
        .data-table td {
          padding: 14px 16px; font-size: 13px; color: #aaa;
          border-bottom: 1px solid #16161f;
          transition: background 0.15s;
        }
        .data-table tr:hover td { background: #13131a; color: #ddd; }

        .badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 600;
        }
        .badge-admin { background: #1a2a1a; color: #4ade80; border: 1px solid #2a4a2a; }
        .badge-user  { background: #1a1a2a; color: #818cf8; border: 1px solid #2a2a4a; }
        .badge-count { background: #1e1e2a; color: #888; border: 1px solid #2a2a3a; }

        .expand-btn {
          background: #1e1e2a; border: 1px solid #2a2a3a;
          color: #888; padding: 4px 12px; border-radius: 6px;
          cursor: pointer; font-size: 12px; transition: all 0.15s;
        }
        .expand-btn:hover { background: #2a2a3a; color: #fff; }

        .question-list {
          background: #0d0d12; border: 1px solid #1e1e2a;
          border-radius: 8px; padding: 12px 16px;
          margin-top: 8px; max-height: 160px; overflow-y: auto;
        }
        .question-item {
          padding: 6px 0; font-size: 12px; color: #777;
          border-bottom: 1px solid #1a1a22;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .question-item:last-child { border-bottom: none; }
        .question-item::before { content: "›"; color: #444; flex-shrink: 0; margin-top: 1px; }

        .loading-dot {
          display: inline-block; width: 6px; height: 6px;
          background: #555; border-radius: 50; margin: 0 2px;
          animation: bounce 1.2s infinite;
        }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        .empty-state {
          text-align: center; padding: 60px 20px;
          color: #333; font-size: 14px;
        }
        .empty-state .emoji { font-size: 32px; margin-bottom: 12px; display: block; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: 220, background: "#0c0c10",
        borderRight: "1px solid #1a1a22",
        padding: "28px 16px", display: "flex",
        flexDirection: "column", gap: 4, flexShrink: 0
      }}>
        <div style={{ padding: "0 8px 24px", borderBottom: "1px solid #1a1a22", marginBottom: 8 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            Admin<span style={{ color: "#4f4f7a" }}>Panel</span>
          </div>
          <div style={{ fontSize: 11, color: "#333", marginTop: 4, letterSpacing: "0.05em" }}>CONTROL CENTER</div>
        </div>

        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => item.action ? item.action() : setActive(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div style={{ marginTop: "auto", padding: "16px 8px 0", borderTop: "1px solid #1a1a22" }}>
          <div style={{ fontSize: 11, color: "#333" }}>Logged in as</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 2, fontWeight: 500 }}>
            {JSON.parse(localStorage.getItem("user") || "{}")?.name || "Admin"}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                Good day 👋
              </h1>
              <p style={{ color: "#444", fontSize: 14, marginTop: 6 }}>Here's what's happening in your system.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Users", value: "8", icon: "◎", color: "#818cf8" },
                { label: "Active Tasks", value: "64", icon: "✦", color: "#4ade80" },
                { label: "Pending", value: "12", icon: "◷", color: "#fb923c" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 36, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#fff", marginTop: 8, letterSpacing: "-0.04em" }}>{s.value}</div>
                    </div>
                    <span style={{ fontSize: 22, color: s.color, opacity: 0.7 }}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#16161f", border: "1px solid #22222e", borderRadius: 14, padding: "20px 24px" }}>
              <p style={{ color: "#333", fontSize: 13 }}>Click <strong style={{ color: "#555" }}>Users</strong> or <strong style={{ color: "#555" }}>Tasks</strong> in the sidebar to load data.</p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, gap: 4 }}>
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        )}

        {/* USERS */}
        {active === "users" && !loading && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>Users</h2>
              <p style={{ color: "#444", fontSize: 13, marginTop: 4 }}>{data.length} registered accounts</p>
            </div>

            <div style={{ background: "#16161f", border: "1px solid #22222e", borderRadius: 14, overflow: "hidden" }}>
              {data.length === 0 ? (
                <div className="empty-state"><span className="emoji">◎</span>No users found</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((u, i) => (
                      <tr key={i}>
                        <td style={{ color: "#333", fontSize: 12 }}>{i + 1}</td>
                        <td style={{ color: "#ddd", fontWeight: 500 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.mobile || "—"}</td>
                        <td>
                          <span className={`badge ${u.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                            {u.role}
                          </span>
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
              <p style={{ color: "#444", fontSize: 13, marginTop: 4 }}>{data.length} users with task data</p>
            </div>

            <div style={{ background: "#16161f", border: "1px solid #22222e", borderRadius: 14, overflow: "hidden" }}>
              {data.length === 0 ? (
                <div className="empty-state"><span className="emoji">✦</span>No tasks found</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th><th>User ID</th><th>Questions</th><th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((t, i) => (
                      <>
                        <tr key={i}>
                          <td style={{ color: "#333", fontSize: 12 }}>{i + 1}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 12, color: "#666" }}>{t.userId}</td>
                          <td>
                            <span className="badge badge-count">{t.question?.length || 0} questions</span>
                          </td>
                          <td>
                            {t.question?.length > 0 && (
                              <button
                                className="expand-btn"
                                onClick={() => setExpandedUser(expandedUser === i ? null : i)}
                              >
                                {expandedUser === i ? "▲ Hide" : "▼ View"}
                              </button>
                            )}
                          </td>
                        </tr>
                        {expandedUser === i && (
                          <tr key={`exp-${i}`}>
                            <td colSpan={4} style={{ padding: "4px 16px 16px" }}>
                              <div className="question-list">
                                {t.question.map((q, idx) => (
                                  <div key={idx} className="question-item">{q.question}</div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
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