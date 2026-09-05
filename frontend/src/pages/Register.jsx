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
      /*
       * Backend will:
       * 1. Check email
       * 2. Create pending registration
       * 3. Generate OTP
       * 4. Send OTP to email
       *
       * User is NOT created in DB yet.
       */
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

      <div className="register-card">

        <div className="logo">🎵</div>

        <h1>Create Account</h1>

        <p className="subtitle">
          Join TuneFlow and enjoy unlimited music
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}

          <div className="input-group">
            <label htmlFor="fullName">
              Full Name
            </label>

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

          {/* EMAIL */}

          <div className="input-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}

          <div className="input-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
              disabled={loading}
            />
          </div>

          {/* SUBMIT */}

          <button
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="bottom-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;