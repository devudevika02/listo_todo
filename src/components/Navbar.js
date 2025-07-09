import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isLogin = location.pathname === '/';

  return (
    <nav className="d-flex justify-content-between align-items-center px-4 py-2 bg-dark">
      <h1
        className="mb-0 fw-bold"
        style={{
          fontSize: '2rem',
          letterSpacing: '2px',
          background: 'linear-gradient(90deg, #23ccc1 30%, #e0eafc 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 24px rgba(35,204,193,0.18)',
        }}
      >
        <i className="bi bi-check2-circle" style={{ verticalAlign: 'middle' }}></i> Listö
      </h1>
      {isLogin ? (
        <Link to="/signup" className="btn btn-outline-info">
          Signup
        </Link>
      ) : (
        <Link to="/" className="btn btn-outline-info">
          Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
