import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { TaskProvider, useTasks } from "./TaskContext";
import type { Priority, Status, Category, Task } from "./types";

// ============================================================================
// SHARED COMPONENTS & BADGES
// ============================================================================
const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const labels: Record<Priority, string> = {
    high: "High",
    medium: "Med",
    low: "Low",
  };
  return (
    <span
      className={`badge priority-${priority}`}
      aria-label={`Priority ${priority}`}
    >
      <span className="badge-dot" />
      {labels[priority]}
    </span>
  );
};

const StatusChip: React.FC<{ status: Status }> = ({ status }) => {
  const map: Record<Status, { label: string; cls: string }> = {
    todo: { label: "To Do", cls: "status-todo" },
    "in-progress": { label: "In Progress", cls: "status-in-progress" },
    done: { label: "Done", cls: "status-done" },
  };
  return (
    <span className={`badge ${map[status].cls}`}>{map[status].label}</span>
  );
};

// ============================================================================
// CONFIRMATION MODAL
// ============================================================================
interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-dialog">
        <h3
          id="modal-title"
          style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "1.5rem",
            fontSize: "0.925rem",
          }}
        >
          {message}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} type="button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN 8: SHARED LAYOUT
// ============================================================================
const Layout: React.FC<{
  children: React.ReactNode;
  user: string | null;
  onLogout: () => void;
}> = ({ children, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="nav-container">
          <Link to="/" className="brand-logo" aria-label="AuraTask Home">
            <div className="brand-icon">A</div>
            <span>AuraTask</span>
          </Link>

          {user && (
            <button
              className="mobile-menu-toggle"
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          )}

          {user && (
            <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  end
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Tasks
                </NavLink>
              </li>
              <li>
                <Link
                  to="/tasks/new"
                  className="btn btn-primary btn-sm"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  + New Task
                </Link>
              </li>
              <li className="user-menu" style={{ marginLeft: "1rem" }}>
                <div className="user-avatar" title={user}>
                  {user.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--color-danger)" }}
                  aria-label="Log out of account"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </header>

      <main className="main-content">{children}</main>

      <footer className="site-footer">
        <p>© 2026 AuraTask • Designed with high-contrast WCAG AA precision.</p>
      </footer>
    </div>
  );
};

// ============================================================================
// SCREEN 1: LOGIN (/login)
// ============================================================================
const LoginScreen: React.FC<{ onLogin: (email: string) => void }> = ({
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      errs.email = "Please enter a valid email.";

    if (!password) errs.password = "Password is required.";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onLogin(email);
      navigate("/");
    }
  };

  const handleFillDemo = () => {
    setEmail("alex.morgan@company.com");
    setPassword("demopass123");
    setErrors({});
  };

  return (
    <div style={{ maxWidth: "420px", margin: "4rem auto 0" }}>
      <div className="form-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            className="brand-icon"
            style={{ margin: "0 auto 1rem", width: "48px", height: "48px" }}
          >
            A
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Welcome to AuraTask
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            Sign in to your personal workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
            />
            {errors.email && (
              <p id="email-err" className="form-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-pass">
              Password
            </label>
            <input
              id="login-pass"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "pass-err" : undefined}
            />
            {errors.password && (
              <p id="pass-err" className="form-error">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Sign In
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "var(--color-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-secondary)",
              marginBottom: "0.5rem",
            }}
          >
            Demo Account: <strong>alex.morgan@company.com</strong>
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary btn-sm"
          >
            Quick fill credentials
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN 2: DASHBOARD (/)
// ============================================================================
const DashboardScreen: React.FC = () => {
  const { tasks, toggleStatus } = useTasks();
  const todayStr = new Date().toISOString().split("T")[0];

  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter(
    (t) => t.status !== "done" && t.dueDate < todayStr
  ).length;

  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const dueTodayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const recentTasks = [...tasks].slice(0, 4);

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Good morning, Alex 👋</h1>
        <p className="dashboard-subtitle">
          Here is a snapshot of your productivity goals today.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card in-progress">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgress}</span>
        </div>
        <div className="stat-card done">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{done}</span>
        </div>
        <div className="stat-card overdue">
          <span className="stat-label">Overdue</span>
          <span
            className="stat-value"
            style={{ color: overdue > 0 ? "var(--color-danger)" : undefined }}
          >
            {overdue}
          </span>
        </div>
      </div>

      <div className="progress-banner">
        <div className="progress-header">
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              Overall Progress
            </h3>
            <span
              style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}
            >
              {done} of {total} tasks completed
            </span>
          </div>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--color-primary)",
            }}
          >
            {percent}%
          </span>
        </div>
        <div
          className="progress-bar-track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="dashboard-split">
        <section className="panel" aria-labelledby="due-today-title">
          <div className="panel-title">
            <h2 id="due-today-title" style={{ fontSize: "1.1rem" }}>
              Due Today ({dueTodayTasks.length})
            </h2>
            <Link to="/tasks" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          {dueTodayTasks.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
              No tasks due today. Great job!
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {dueTodayTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.625rem 0",
                    borderBottom: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "done"}
                      onChange={() => toggleStatus(task.id)}
                      className="task-checkbox"
                      aria-label={`Mark ${task.title} as completed`}
                    />
                    <Link
                      to={`/tasks/${task.id}`}
                      style={{ fontWeight: 500, fontSize: "0.9375rem" }}
                    >
                      {task.title}
                    </Link>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel" aria-labelledby="recent-tasks-title">
          <div className="panel-title">
            <h2 id="recent-tasks-title" style={{ fontSize: "1.1rem" }}>
              Recent Activity
            </h2>
            <Link to="/tasks/new" className="btn btn-secondary btn-sm">
              + Add
            </Link>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {recentTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.625rem 0",
                  borderBottom: "1px solid var(--color-border-subtle)",
                }}
              >
                <div>
                  <Link
                    to={`/tasks/${task.id}`}
                    style={{ fontWeight: 500, fontSize: "0.9375rem" }}
                  >
                    {task.title}
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    <span className="category-pill">{task.category}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
                <StatusChip status={task.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN 3: TASKS LIST (/tasks)
// ============================================================================
const TasksListScreen: React.FC = () => {
  const { tasks, toggleStatus, deleteTask } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();

  // Simulated state controls
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Modal State
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Filters & Sorting
  const search = searchParams.get("q") || "";
  const filterStatus = searchParams.get("status") || "all";
  const filterPriority = searchParams.get("priority") || "all";
  const filterCategory = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "dueDate-asc";

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== "all") {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  // Filter implementation
  let filtered = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || t.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === "dueDate-asc") return a.dueDate.localeCompare(b.dueDate);
    if (sortBy === "dueDate-desc") return b.dueDate.localeCompare(a.dueDate);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "priority") {
      const weight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
      return weight[b.priority] - weight[a.priority];
    }
    return 0;
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 800 }}>Tasks</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Manage, prioritize, and track all your personal to-dos.
          </p>
        </div>
        <Link to="/tasks/new" className="btn btn-primary">
          + New Task
        </Link>
      </div>

      {/* Prototype interactive state toggles */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1200);
          }}
        >
          ⚡ Preview Skeleton
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setHasError(!hasError)}
        >
          ⚡ Toggle Error State
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="task-controls">
        <div className="search-input-wrap">
          <input
            type="search"
            className="form-input"
            placeholder="Search tasks by title or details..."
            value={search}
            onChange={(e) => updateParam("q", e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        <div className="filter-row">
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={filterStatus}
            onChange={(e) => updateParam("status", e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            className="form-select"
            style={{ width: "auto" }}
            value={filterPriority}
            onChange={(e) => updateParam("priority", e.target.value)}
            aria-label="Filter by Priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            className="form-select"
            style={{ width: "auto" }}
            value={filterCategory}
            onChange={(e) => updateParam("category", e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
          </select>

          <select
            className="form-select"
            style={{ width: "auto", marginLeft: "auto" }}
            value={sortBy}
            onChange={(e) => updateParam("sort", e.target.value)}
            aria-label="Sort tasks by"
          >
            <option value="dueDate-asc">Sort: Due date (Soonest)</option>
            <option value="dueDate-desc">Sort: Due date (Latest)</option>
            <option value="priority">Sort: Highest priority</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* UI State: Error */}
      {hasError ? (
        <div
          className="empty-state"
          style={{ borderColor: "var(--color-danger)" }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</div>
          <h3 style={{ marginBottom: "0.25rem" }}>Unable to fetch tasks</h3>
          <p
            style={{
              color: "var(--color-text-muted)",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            A temporary connection issue occurred while loading your tasks.
          </p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setHasError(false)}
          >
            Retry Connection
          </button>
        </div>
      ) : isLoading ? (
        /* UI State: Loading Skeleton */
        <div className="task-list">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="task-card">
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <div
                  className="skeleton"
                  style={{ width: "24px", height: "24px", borderRadius: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="skeleton"
                    style={{
                      height: "16px",
                      width: "40%",
                      marginBottom: "8px",
                    }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: "12px", width: "20%" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* UI State: Empty State */
        <div className="empty-state">
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📋</div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
            No tasks found
          </h3>
          <p
            style={{
              color: "var(--color-text-muted)",
              marginBottom: "1.25rem",
              fontSize: "0.925rem",
            }}
          >
            {tasks.length === 0
              ? "You have a clean slate! Create your very first task to get organized."
              : "No tasks matched your active filter or search criteria."}
          </p>
          {tasks.length === 0 ? (
            <Link to="/tasks/new" className="btn btn-primary">
              Create your first task
            </Link>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchParams({});
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        /* Regular Task List */
        <div className="task-list">
          {filtered.map((task) => (
            <article
              key={task.id}
              className="task-card"
              aria-labelledby={`task-label-${task.id}`}
            >
              <div className="task-left">
                <input
                  type="checkbox"
                  id={`chk-${task.id}`}
                  className="task-checkbox"
                  checked={task.status === "done"}
                  onChange={() => toggleStatus(task.id)}
                  aria-label={`Toggle task completion for "${task.title}"`}
                />
                <div className="task-content">
                  <Link
                    to={`/tasks/${task.id}`}
                    id={`task-label-${task.id}`}
                    className={`task-title-link ${
                      task.status === "done" ? "is-done" : ""
                    }`}
                  >
                    {task.title}
                  </Link>
                  <div className="task-meta">
                    <StatusChip status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    <span className="category-pill">{task.category}</span>
                    <span>📅 {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="task-actions">
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="btn btn-secondary btn-sm"
                  aria-label="Edit task"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--color-danger)" }}
                  onClick={() => setTaskToDelete(task)}
                  aria-label={`Delete task ${task.title}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
      />
    </div>
  );
};

// ============================================================================
// SCREEN 4: TASK DETAILS (/tasks/:id)
// ============================================================================
const TaskDetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, deleteTask, toggleStatus } = useTasks();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const task = id ? getTaskById(id) : undefined;

  if (!task) {
    return (
      <div className="empty-state">
        <h2>Task not found</h2>
        <p style={{ color: "var(--color-text-muted)", margin: "1rem 0" }}>
          The requested task does not exist or was deleted.
        </p>
        <Link to="/tasks" className="btn btn-primary">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <Link
        to="/tasks"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          marginBottom: "1.5rem",
          fontWeight: 500,
        }}
      >
        ← Back to all tasks
      </Link>

      <div className="panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>{task.title}</h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link
              to={`/tasks/${task.id}/edit`}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </Link>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <StatusChip status={task.status} />
          <PriorityBadge priority={task.priority} />
          <span
            className="category-pill"
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8125rem" }}
          >
            🏷️ {task.category}
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            📅 Due: <strong>{task.dueDate}</strong>
          </span>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              color: "var(--color-text-secondary)",
              marginBottom: "0.5rem",
            }}
          >
            Description
          </h3>
          <p
            style={{
              lineHeight: 1.7,
              color: "var(--color-text-primary)",
              whiteSpace: "pre-wrap",
            }}
          >
            {task.description || "No detailed description provided."}
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}
          >
            Status quick toggle:
          </span>
          <button
            className={`btn btn-sm ${
              task.status === "done" ? "btn-secondary" : "btn-primary"
            }`}
            onClick={() => toggleStatus(task.id)}
          >
            {task.status === "done"
              ? "Mark as Unfinished"
              : "✓ Mark as Completed"}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${task.title}"?`}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteTask(task.id);
          setIsDeleteModalOpen(false);
          navigate("/tasks");
        }}
      />
    </div>
  );
};

// ============================================================================
// SCREEN 5: CREATE / EDIT TASK FORM (/tasks/new and /tasks/:id/edit)
// ============================================================================
const TaskFormScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { getTaskById, addTask, updateTask } = useTasks();
  const navigate = useNavigate();

  const existing = id ? getTaskById(id) : undefined;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [status, setStatus] = useState<Status>(existing?.status || "todo");
  const [priority, setPriority] = useState<Priority>(
    existing?.priority || "medium"
  );
  const [category, setCategory] = useState<Category>(
    existing?.category || "Work"
  );
  const [dueDate, setDueDate] = useState(
    existing?.dueDate || new Date().toISOString().split("T")[0]
  );

  // Field Touched & Inline Validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = {
    title: !title.trim()
      ? "Task title is required."
      : title.trim().length < 3
      ? "Title must be at least 3 characters."
      : "",
    dueDate: !dueDate ? "A valid due date is required." : "",
  };

  const isFormValid = !errors.title && !errors.dueDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (isEditMode && id) {
      updateTask(id, {
        title,
        description,
        status,
        priority,
        category,
        dueDate,
      });
      navigate(`/tasks/${id}`);
    } else {
      addTask({ title, description, status, priority, category, dueDate });
      navigate("/tasks");
    }
  };

  return (
    <div className="form-card">
      <h1
        style={{
          fontSize: "1.625rem",
          fontWeight: 800,
          marginBottom: "0.25rem",
        }}
      >
        {isEditMode ? "Edit Task" : "Create New Task"}
      </h1>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "0.875rem",
          marginBottom: "2rem",
        }}
      >
        {isEditMode
          ? "Make adjustments to your existing task."
          : "Add a new priority item to your workflow."}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="task-title">
            Task Title *
          </label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            value={title}
            placeholder="e.g., Prepare quarterly budget review"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
            aria-invalid={touched.title && !!errors.title}
            aria-describedby={
              touched.title && errors.title ? "title-error" : undefined
            }
          />
          {touched.title && errors.title && (
            <p id="title-error" className="form-error">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="task-desc">
            Description
          </label>
          <textarea
            id="task-desc"
            className="form-textarea"
            rows={4}
            value={description}
            placeholder="Add relevant notes, checklist items, or links..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Row: Status, Priority, Category */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="task-status">
              Status
            </label>
            <select
              id="task-status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-category">
              Category
            </label>
            <select
              id="task-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="task-duedate">
            Due Date *
          </label>
          <input
            id="task-duedate"
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, dueDate: true }))}
            aria-invalid={touched.dueDate && !!errors.dueDate}
            aria-describedby={
              touched.dueDate && errors.dueDate ? "due-error" : undefined
            }
          />
          {touched.dueDate && errors.dueDate && (
            <p id="due-error" className="form-error">
              {errors.dueDate}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "2rem",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormValid}
          >
            {isEditMode ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// SCREEN 7: NOT FOUND (404)
// ============================================================================
const NotFoundScreen: React.FC = () => {
  return (
    <div
      className="empty-state"
      style={{ maxWidth: "500px", margin: "4rem auto" }}
    >
      <h1
        style={{
          fontSize: "4rem",
          fontWeight: 800,
          color: "var(--color-primary)",
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
        Page not found
      </h2>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        The link you followed does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

// ============================================================================
// MAIN ROOT APP WITH ROUTING
// ============================================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(
    "alex.morgan@company.com"
  );

  const handleLogin = (email: string) => setCurrentUser(email);
  const handleLogout = () => setCurrentUser(null);

  return (
    <TaskProvider>
      <BrowserRouter>
        <Layout user={currentUser} onLogout={handleLogout}>
          <Routes>
            <Route
              path="/login"
              element={
                currentUser ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginScreen onLogin={handleLogin} />
                )
              }
            />
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                currentUser ? (
                  <DashboardScreen />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/tasks"
              element={
                currentUser ? (
                  <TasksListScreen />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/tasks/new"
              element={
                currentUser ? (
                  <TaskFormScreen />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/tasks/:id"
              element={
                currentUser ? (
                  <TaskDetailsScreen />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/tasks/:id/edit"
              element={
                currentUser ? (
                  <TaskFormScreen />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TaskProvider>
  );
}
