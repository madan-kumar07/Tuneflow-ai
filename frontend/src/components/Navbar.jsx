import "./Navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <h2>Good Evening 👋</h2>
        <p>Find your favorite songs</p>
      </div>

      <div className="nav-right">
        <FaBell className="icon" />
        <FaUserCircle className="icon profile" />
      </div>
    </div>
  );
};

export default Navbar;