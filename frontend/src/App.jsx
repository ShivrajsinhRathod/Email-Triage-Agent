import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  Zap,
  Settings,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [triageData, setTriageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTriageData() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/triage?limit=5`
      );

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      setTriageData(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTriageData();
  }, []);

  const priorityOrder = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortedEmails = [...triageData].sort(
    (a, b) =>
      (priorityOrder[b.analysis?.priority] || 0) -
      (priorityOrder[a.analysis?.priority] || 0)
  );

  const importantEmails = triageData.filter(
    (x) =>
      x.analysis?.priority === "Critical" ||
      x.analysis?.priority === "High"
  ).length;

  const urgentEmails = triageData.filter(
    (x) => x.analysis?.priority === "Critical"
  ).length;

  const actionRequired = triageData.filter(
    (x) => x.analysis?.requires_action === true
  ).length;

  const navigate = (page) => {
    setActivePage(page);
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <h2>Email Triage Agent</h2>
            <span>AI-POWERED EMAIL MANAGEMENT</span>
          </div>
        </div>

        <div className="connection">
          <span className="status-dot"></span>
          <span>Gmail Connected</span>
        </div>

        <nav className="navigation">

          <button
            className={`nav-item ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === "inbox" ? "active" : ""
            }`}
            onClick={() => navigate("inbox")}
          >
            <Inbox size={18} />
            Inbox
          </button>

          <button
            className={`nav-item ${
              activePage === "priority" ? "active" : ""
            }`}
            onClick={() => navigate("priority")}
          >
            <Sparkles size={18} />
            AI Priority
          </button>

          <button
            className={`nav-item ${
              activePage === "actions" ? "active" : ""
            }`}
            onClick={() => navigate("actions")}
          >
            <Zap size={18} />
            Suggested Actions
          </button>

          <button
            className={`nav-item ${
              activePage === "settings" ? "active" : ""
            }`}
            onClick={() => navigate("settings")}
          >
            <Settings size={18} />
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div className="user-avatar">U</div>

          <div>
            <strong>User</strong>
            <span>Personal Account</span>
          </div>
        </div>

      </aside>


      {/* MAIN */}
      <main className="main-content">

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <>
            <header className="topbar">

              <div>
                <p className="eyebrow">
                  EMAIL TRIAGE AGENT
                </p>

                <h1>Good morning.</h1>

                <p className="subtitle">
                  Your AI assistant is keeping your inbox organized.
                </p>
              </div>

              <div className="topbar-status">
                <CheckCircle2 size={16} />
                AI System Active
              </div>

            </header>


            {error && (
              <div className="control-panel">
                <AlertCircle size={20} />
                {error}
              </div>
            )}


            {/* METRICS */}
            <section className="metrics">

              <div className="metric-card">
                <div className="metric-icon">
                  <Mail size={20} />
                </div>

                <span>Emails Analyzed</span>
                <strong>
                  {loading ? "..." : triageData.length}
                </strong>
                <small>AI analyzed</small>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Sparkles size={20} />
                </div>

                <span>Important</span>
                <strong>
                  {loading ? "..." : importantEmails}
                </strong>
                <small>High priority</small>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Zap size={20} />
                </div>

                <span>Urgent</span>
                <strong>
                  {loading ? "..." : urgentEmails}
                </strong>
                <small>Critical priority</small>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <CheckCircle2 size={20} />
                </div>

                <span>AI Actions</span>
                <strong>
                  {loading ? "..." : actionRequired}
                </strong>
                <small>Requires action</small>
              </div>

            </section>


            {/* DASHBOARD GRID */}
            <section className="dashboard-grid">

              <div className="panel large-panel">

                <div className="panel-header">

                  <div>
                    <span className="section-label">
                      AI PRIORITY
                    </span>

                    <h2>Priority Inbox</h2>
                  </div>

                  <span className="panel-badge">
                    AI Analysis
                  </span>

                </div>


                {loading ? (
                  <div className="empty-state">
                    <RefreshCw size={30} />
                    <h3>Analyzing emails...</h3>
                    <p>Please wait.</p>
                  </div>
                ) : (
                  <EmailList emails={sortedEmails} />
                )}

              </div>


              <div className="panel">

                <div className="panel-header">

                  <div>
                    <span className="section-label">
                      TODAY
                    </span>

                    <h2>AI Overview</h2>
                  </div>

                </div>

                <div className="overview-item">
                  <span>Highest Priority</span>
                  <strong>
                    {sortedEmails[0]?.analysis?.priority || "—"}
                  </strong>
                </div>

                <div className="overview-item">
                  <span>Emails Requiring Action</span>
                  <strong>{actionRequired}</strong>
                </div>

                <div className="overview-item">
                  <span>Emails Analyzed</span>
                  <strong>{triageData.length}</strong>
                </div>

              </div>

            </section>


            {/* HUMAN CONTROL */}
            <section className="control-panel">

              <div className="control-icon">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <span className="section-label">
                  HUMAN CONTROL
                </span>

                <h2>You stay in control.</h2>

                <p>
                  The AI recommends priorities and actions.
                  Nothing changes in your Gmail account without
                  your approval.
                </p>
              </div>

            </section>


            {/* RECENT */}
            <section className="panel recent-panel">

              <div className="panel-header">

                <div>
                  <span className="section-label">
                    RECENT EMAILS
                  </span>

                  <h2>Inbox</h2>
                </div>

                <button
                  className="secondary-button"
                  onClick={loadTriageData}
                >
                  Refresh
                </button>

              </div>

              <EmailList emails={triageData} />

            </section>
          </>
        )}


        {/* INBOX */}
        {activePage === "inbox" && (
          <PageLayout
            title="Inbox"
            label="ALL EMAILS"
            icon={<Inbox size={24} />}
            onBack={() => navigate("dashboard")}
          >
            <EmailList emails={triageData} />
          </PageLayout>
        )}


        {/* AI PRIORITY */}
        {activePage === "priority" && (
          <PageLayout
            title="AI Priority"
            label="AI ANALYSIS"
            icon={<Sparkles size={24} />}
            onBack={() => navigate("dashboard")}
          >
            <EmailList emails={sortedEmails} />
          </PageLayout>
        )}


        {/* ACTIONS */}
        {activePage === "actions" && (
          <PageLayout
            title="Suggested Actions"
            label="HUMAN APPROVAL"
            icon={<Zap size={24} />}
            onBack={() => navigate("dashboard")}
          >

            {triageData.filter(
              (x) => x.analysis?.requires_action
            ).length === 0 ? (

              <div className="empty-state">
                <CheckCircle2 size={32} />
                <h3>No suggested actions</h3>
                <p>
                  The AI has not identified any actions requiring approval.
                </p>
              </div>

            ) : (

              triageData
                .filter(
                  (x) => x.analysis?.requires_action
                )
                .map((item) => (

                  <div
                    className="email-item"
                    key={item.email.id}
                  >

                    <div className="email-item-main">

                      <div className="email-sender">
                        {item.email.sender}
                      </div>

                      <div className="email-subject">
                        {item.email.subject}
                      </div>

                      <div className="email-summary">
                        {item.analysis?.summary}
                      </div>

                    </div>

                    <button className="secondary-button">
                      Review
                    </button>

                  </div>

                ))

            )}

          </PageLayout>
        )}


        {/* SETTINGS */}
        {activePage === "settings" && (
          <PageLayout
            title="Settings"
            label="CONFIGURATION"
            icon={<Settings size={24} />}
            onBack={() => navigate("dashboard")}
          >

            <div className="panel">

              <div className="overview-item">
                <span>Gmail Connection</span>
                <strong>Connected</strong>
              </div>

              <div className="overview-item">
                <span>AI Engine</span>
                <strong>Gemini</strong>
              </div>

              <div className="overview-item">
                <span>Human Approval</span>
                <strong>Required</strong>
              </div>

              <div className="overview-item">
                <span>AI Cache</span>
                <strong>Enabled</strong>
              </div>

            </div>

          </PageLayout>
        )}

      </main>

    </div>
  );
}


/* =================================
   EMAIL LIST COMPONENT
================================= */

function EmailList({ emails }) {

  if (!emails || emails.length === 0) {

    return (
      <div className="empty-state">

        <Mail size={30} />

        <h3>No emails found</h3>

        <p>
          There are no analyzed emails to display.
        </p>

      </div>
    );
  }


  return (

    <div className="email-list">

      {emails.map((item) => {

        const email = item.email;
        const analysis = item.analysis;

        return (

          <div
            className="email-item"
            key={email.id}
          >

            <div className="email-item-main">

              <div className="email-sender">
                {email.sender || "Unknown sender"}
              </div>

              <div className="email-subject">
                {email.subject || "(No subject)"}
              </div>

              <div className="email-summary">
                {analysis?.summary ||
                  "No summary available."}
              </div>

            </div>


            <div className="email-item-meta">

              <span className="category">
                {analysis?.category || "Other"}
              </span>

              <span
                className={`priority priority-${(
                  analysis?.priority || "Low"
                ).toLowerCase()}`}
              >
                {analysis?.priority || "Unknown"}
              </span>

            </div>

          </div>

        );
      })}

    </div>
  );
}


/* =================================
   PAGE LAYOUT
================================= */

function PageLayout({
  title,
  label,
  icon,
  onBack,
  children,
}) {

  return (

    <>

      <header className="topbar">

        <div>

          <p className="eyebrow">
            {label}
          </p>

          <h1>
            {icon} {title}
          </h1>

          <p className="subtitle">
            Manage and review your AI-processed emails.
          </p>

        </div>

        <button
          className="secondary-button"
          onClick={onBack}
        >
          <ArrowLeft size={14} />
          Dashboard
        </button>

      </header>


      <section
        className="panel"
        style={{ marginTop: "30px" }}
      >
        {children}
      </section>

    </>
  );
}


export default App;