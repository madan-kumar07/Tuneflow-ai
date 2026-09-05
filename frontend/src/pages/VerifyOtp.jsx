import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  verifyOtp,
  resendOtp,
} from "../service/authService";
import "./VerifyOtp.css";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const [countdown, setCountdown] = useState(60);

  // If user directly opens /verify-otp
  useEffect(() => {
    if (!email) {
      toast.error("Registration session not found");
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp({
        email,
        otp,
      });

      /*
       * Backend returns AuthResponse after
       * successful OTP verification.
       */

      const data = response?.data || response;

      if (data?.token) {
        localStorage.setItem("token", data.token);

        if (data.email) {
          localStorage.setItem("userEmail", data.email);
        }

        if (data.role) {
          localStorage.setItem("userRole", data.role);
        }
      }

      toast.success("Email verified! Welcome to TuneFlow 🎵");

      navigate("/", { replace: true });

    } catch (err) {
      console.error("OTP verification error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid or expired OTP";

      setError(
        typeof message === "string"
          ? message
          : "Invalid or expired OTP"
      );

      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    setResending(true);
    setError("");

    try {
      await resendOtp(email);

      setOtp("");
      setCountdown(60);

      toast.success("A new OTP has been sent 📧");

    } catch (err) {
      console.error("Resend OTP error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to resend OTP";

      setError(
        typeof message === "string"
          ? message
          : "Unable to resend OTP"
      );

      toast.error("Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="verify-page">

      <div className="verify-card">

        {/* ICON */}

        <div className="verify-icon">
          ✉️
        </div>

        {/* HEADER */}

        <h1>Verify Your Email</h1>

        <p className="verify-subtitle">
          We've sent a 6-digit verification code to
        </p>

        <p className="verify-email">
          {email}
        </p>

        {/* ERROR */}

        {error && (
          <div className="verify-error">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          <div className="otp-group">

            <label htmlFor="otp">
              Enter verification code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              disabled={loading}
              autoFocus
            />

          </div>

          <button
            type="submit"
            className="verify-btn"
            disabled={loading || otp.length !== 6}
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

        </form>

        {/* RESEND */}

        <div className="resend-section">

          <p>
            Didn't receive the code?
          </p>

          {countdown > 0 ? (
            <span className="resend-timer">
              Resend OTP in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending
                ? "Sending..."
                : "Resend OTP"}
            </button>
          )}

        </div>

        {/* BACK */}

        <div className="back-section">
          <Link to="/register">
            ← Back to registration
          </Link>
        </div>

      </div>

    </div>
  );
};

export default VerifyOtp;