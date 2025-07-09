import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Login() {
  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <div className="card p-4 shadow" style={{ width: '350px' }}>
          <h3 className="text-center mb-4">Login</h3>
          <form>
            <input type="email" className="form-control mb-3" placeholder="Email" />
            <input type="password" className="form-control mb-3" placeholder="Password" />
            <button className="btn btn-info w-100">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
