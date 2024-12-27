import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../context/AuthContext";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Adjust navigation visibility based on window size
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 680) {
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  }, [windowWidth]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header id="top-head">
      <div className="inner">
        <h1>
          <Link to="/">LOGO</Link>
        </h1>
        <div id="nav_toggle">
          <IconButton onClick={handleMenuToggle} color="inherit">
            <MenuIcon />
          </IconButton>
        </div>
        <nav
          style={{
            display: windowWidth <= 680 && !menuOpen ? "none" : "block",
          }}
        >
          <ul>
            <li>
              <Link to="/">HOME</Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
                <li>
                  <Link to="/checkout">Checkout</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
