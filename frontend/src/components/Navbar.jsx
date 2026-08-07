import "./Navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <h1>Good Evening 👋</h1>
        <p>Find your favorite songs</p>
      </div>

      <div className="nav-right">
        <FaBell className="icon" />

        <span
          style={{
            color: "white",
            marginRight: "15px",
            fontWeight: "600",
          }}
        >
          {user?.email}
        </span>

        <FaUserCircle
          className="icon profile"
          title="Logout"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default Navbar;