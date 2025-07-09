import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      // Save token and firstName to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('firstName', res.data.user.firstName); // Save firstName

      toast.success('✅ Login successful!', {
        position: 'top-right',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: false,
        closeOnClick: true,
      });

      // Redirect after login
      setTimeout(() => {
        navigate('/');
      }, 1500); // small delay so user sees the toast

    } catch (error) {
      const errMsg = error.response?.data?.message || '❌ Login failed';
      toast.error(errMsg, {
        position: 'top-right',
        pauseOnHover: true,
        autoClose: 4000,
        draggable: true,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">User Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3 position-relative">
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              name="password"
              value={password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
            <span
              style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer', userSelect: 'none' }}
              onClick={togglePasswordVisibility}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
            )}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <Link to="/user/forgot-password">Forgot Password?</Link>
        </div>
        <div className="mt-2 text-center">
          <span>Don't have an account? <Link to="/user/register">Register</Link></span>
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
