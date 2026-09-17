import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../service/authService";
import "./Register.css";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
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

    if (formData.fullName.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser(formData);

      toast.success("OTP sent to your email 📧");

      navigate("/verify-otp", {
        state: {
          email: formData.email.trim().toLowerCase(),
        },
      });
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to send OTP. Please try again.";

      setError(
        typeof message === "string"
          ? message
          : "Unable to send OTP. Please try again."
      );

      toast.error("OTP could not be sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-layout">

        {/* ================= LEFT SIDE ================= */}

        <section className="register-left">

          <div className="tf-brand">
            <div className="tf-logo">♫</div>

            <div>
              TuneFlow <span>AI</span>
            </div>
          </div>


          <div className="left-content">

            <span className="small-label">
              MUSIC • AI • YOU
            </span>

            <h2>
              Your music.
              <br />
              <span>Your flow.</span>
            </h2>

            <p>
              Discover music you love, create playlists
              and enjoy a simple listening experience
              built around you.
            </p>


            <div className="left-info">

              <div className="info-item">
                <div className="info-icon">
                  ✦
                </div>

                <div>
                  <strong>
                    Discover music
                  </strong>

                  <small>
                    Find songs you'll love
                  </small>
                </div>
              </div>


              <div className="info-item">
                <div className="info-icon">
                  ♡
                </div>

                <div>
                  <strong>
                    Build your library
                  </strong>

                  <small>
                    Save your favorite songs
                  </small>
                </div>
              </div>

            </div>

          </div>


          {/* Simple music decoration */}

          <div className="music-decoration">

            <div className="disc">
              <div className="disc-hole"></div>
            </div>

            <div className="music-note note-a">
              ♪
            </div>

            <div className="music-note note-b">
              ♫
            </div>

          </div>


          <div className="left-footer">
            <span>LISTEN</span>
            <span>DISCOVER</span>
            <span>REPEAT</span>
          </div>

        </section>


        {/* ================= RIGHT SIDE ================= */}

        <section className="register-right">

          <div className="existing-account">
            Already have an account?

            <Link to="/login">
              Log in →
            </Link>
          </div>


          <div className="form-heading">

            <span>
              WELCOME TO TUNEFLOW
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Start your personalized music journey.
            </p>

          </div>


          {error && (
            <div className="register-error">
              <b>!</b>
              <span>{error}</span>
            </div>
          )}


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* Full name */}

            <div className="form-field">

              <label htmlFor="fullName">
                Full name
              </label>

              <div className="input-box">

                <span>○</span>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* Email */}

            <div className="form-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-box">

                <span>@</span>

                <input
                  id="email"
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

            <div className="form-field">

              <div className="password-title">

                <label htmlFor="password">
                  Password
                </label>

                <small>
                  Minimum 6 characters
                </small>

              </div>


              <div className="input-box">

                <span>•</span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>


              {formData.password && (
                <div className="password-strength">

                  <i
                    className={
                      formData.password.length >= 6
                        ? "active"
                        : ""
                    }
                  />

                  <i
                    className={
                      formData.password.length >= 10
                        ? "active"
                        : ""
                    }
                  />

                  <i
                    className={
                      /[A-Z]/.test(
                        formData.password
                      ) &&
                      /\d/.test(
                        formData.password
                      )
                        ? "active"
                        : ""
                    }
                  />

                </div>
              )}

            </div>


            {/* Terms */}

            <label className="terms">

              <input
                type="checkbox"
                required
                disabled={loading}
              />

              <span>
                I agree to the{" "}
                <a href="#terms">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy">
                  Privacy Policy
                </a>
              </span>

            </label>


            {/* Submit */}

            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Sending OTP..."
                  : "Create account"}
              </span>

              <b>→</b>

            </button>

          </form>


          <div className="secure-line">
            <span></span>
            SECURE SIGNUP
            <span></span>
          </div>


          <p className="bottom-login">
            Already have an account?{" "}
            <Link to="/login">
              Log in
            </Link>
          </p>


          <p className="security-note">
            Your email will be verified with a one-time password.
          </p>

        </section>

      </div>

    </div>
  );
};

export default Register;