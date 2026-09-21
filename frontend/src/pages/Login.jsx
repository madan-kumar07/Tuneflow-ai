import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../service/authService";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);

      login(data);

      toast.success("Welcome back 🎵");

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Invalid email or password";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-layout">

        {/* ================= LEFT ================= */}

        <section className="login-left">

          <div className="login-brand">

            <div className="login-logo">
              ♫
            </div>

            <div>
              TuneFlow <span>AI</span>
            </div>

          </div>


          <div className="login-left-content">

            <span className="login-label">
              YOUR MUSIC AWAITS
            </span>

            <h2>
              Welcome
              <br />
              <span>back.</span>
            </h2>

            <p>
              Continue listening to your favorite songs,
              playlists and discoveries right where you
              left off.
            </p>


            <div className="login-feature">

              <div className="login-feature-icon">
                ♪
              </div>

              <div>
                <strong>
                  Your music, your flow
                </strong>

                <small>
                  Everything you love in one place
                </small>
              </div>

            </div>

          </div>


          <div className="login-art">

            <div className="login-disc">
              <div></div>
            </div>

            <span className="login-note note-one">
              ♪
            </span>

            <span className="login-note note-two">
              ♫
            </span>

          </div>


          <div className="login-footer">
            <span>LISTEN</span>
            <span>DISCOVER</span>
            <span>REPEAT</span>
          </div>

        </section>


        {/* ================= RIGHT ================= */}

        <section className="login-right">

          <div className="register-link">

            New to TuneFlow?

            <Link to="/register">
              Create account →
            </Link>

          </div>


          <div className="login-heading">

            <span>
              WELCOME BACK
            </span>

            <h1>
              Sign in to TuneFlow
            </h1>

            <p>
              Get back into your music flow.
            </p>

          </div>


          {error && (
            <div className="login-error">

              <b>!</b>

              <span>
                {error}
              </span>

            </div>
          )}


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="login-field">

              <label htmlFor="login-email">
                Email address
              </label>

              <div className="login-input">

                <span>
                  @
                </span>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* Password */}

            <div className="login-field">

              <div className="login-password-title">

                <label htmlFor="login-password">
                  Password
                </label>

                <Link to="/register">
                  Need help?
                </Link>

              </div>


              <div className="login-input">

                <span>
                  •
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </span>

              <b>
                →
              </b>

            </button>

          </form>


          <div className="login-divider">
            <span></span>
            YOUR MUSIC • YOUR FLOW
            <span></span>
          </div>


          <div className="login-info">

            <div className="login-info-icon">
              ♪
            </div>

            <div>

              <strong>
                Ready to listen?
              </strong>

              <small>
                Sign in to access your TuneFlow library.
              </small>

            </div>

          </div>


          <p className="create-account-text">

            Don't have an account?{" "}

            <Link to="/register">
              Create one
            </Link>

          </p>

        </section>

      </div>

    </div>
  );
};

export default Login;