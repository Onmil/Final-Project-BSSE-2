import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "../assets/images/m_logo.png";

const NAV_LINKS = ["HOME", "TOURS", "DESTINATIONS"];

type Page = "home" | "tours" | "destinations";

interface User {
  name: string;
  email: string;
}

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ onLoginClick, onSignupClick, onNavigate, currentPage, user, onLogout }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActive = () => {
    if (currentPage === "tours") return "TOURS";
    if (currentPage === "destinations") return "DESTINATIONS";
    return "HOME";
  };

  const handleNav = (link: string) => {
    if (link === "HOME") onNavigate("home");
    else if (link === "TOURS") onNavigate("tours");
    else if (link === "DESTINATIONS") onNavigate("destinations");
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <nav className="navbar">
      <img
        src={logo}
        alt="logo"
        className="logo"
        onClick={() => onNavigate("home")}
        style={{ cursor: "pointer" }}
      />

      {NAV_LINKS.map((link) => (
        <button
          key={link}
          onClick={() => handleNav(link)}
          className={getActive() === link ? "nav-link active" : "nav-link"}
        >
          {link}
        </button>
      ))}

      <div className="auth-buttons">
        {user ? (
          <div className="profile-wrap" ref={dropdownRef}>
            <button
              className="profile-circle"
              onClick={() => setDropdownOpen((v) => !v)}
              title={user.name}
            >
              {getInitials(user.name)}
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-avatar">{getInitials(user.name)}</div>
                <p className="profile-name">{user.name}</p>
                <p className="profile-email">{user.email}</p>
                <hr className="profile-divider" />
                <button
                  className="profile-logout"
                  onClick={() => { setDropdownOpen(false); onLogout(); }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="auth-btn login" onClick={onLoginClick}>Login</button>
            <button className="auth-btn signup" onClick={onSignupClick}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}