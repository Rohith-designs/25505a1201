
import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [page, setPage] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const isRegister = page === "register";
    const endpoint = isRegister ? "/register" : "/login";

    const payload = isRegister
      ? formData
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (isRegister) {
        setMessage("Registration successful! Please log in.");
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        setPage("login");
      } else {
        setUser(data.user);
        setPage("home");
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      setError(
        "Unable to connect. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setUser(null);
    setPage("login");
    setMessage("");
    setError("");
  }

  if (page === "home" && user) {
    return (
      <div className="home-page">
        <nav className="navbar">
          <h2>AtlasApp</h2>
          <div>
            <span>Welcome, {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <main className="hero">
          <h1>Welcome to AtlasApp!</h1>
          <p>
            Your React application is connected to Express
            and MongoDB Atlas.
          </p>
          <p>You are logged in as {user.email}.</p>
        </main>
      </div>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <h1>
            {page === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p>
            {page === "login"
              ? "Login to continue to AtlasApp"
              : "Register your new account"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {page === "register" && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : page === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <div className="switch-auth">
          {page === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setPage("register");
                  setMessage("");
                  setError("");
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setPage("login");
                  setMessage("");
                  setError("");
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
