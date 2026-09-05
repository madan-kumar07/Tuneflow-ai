import axios from "axios";

const API = "http://localhost:8080/api/auth";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// LOGIN
export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API}/login`,
    loginData
  );

  return response.data;
};

// REGISTER → OTP will be sent
export const registerUser = async (registerData) => {
  const response = await axios.post(
    `${API}/register`,
    registerData
  );

  return response.data;
};

// VERIFY OTP
export const verifyOtp = async (otpData) => {
  const response = await axios.post(
    `${API}/otp/verify`,
    otpData
  );

  return response.data;
};

// RESEND OTP
export const resendOtp = async (email) => {
  const response = await axios.post(
    `${API}/otp/send`,
    {
      email: email,
    }
  );

  return response.data;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");

  // Remove old keys also, if they exist
  localStorage.removeItem("email");
  localStorage.removeItem("role");
};