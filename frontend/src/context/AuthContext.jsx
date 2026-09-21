import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email") || localStorage.getItem("userEmail");
    const role = localStorage.getItem("role") || localStorage.getItem("userRole");

    if (token) {
      setUser({
        token,
        email,
        role,
      });
    }
  }, []);

  const login = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    if (data?.email) {
      localStorage.setItem("email", data.email);
      localStorage.setItem("userEmail", data.email);
    }
    if (data?.role) {
      localStorage.setItem("role", data.role);
      localStorage.setItem("userRole", data.role);
    }

    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};