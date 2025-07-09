import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/user/forgot-password', { email });
      toast.success(res.data.message || 'Check your email for reset link!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-4 rounded-4">
            <h2 className="text-center text-primary mb-4">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label"><FaEnvelope /> Registered Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@domain.com"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center mt-3">
                Remember your password?{' '}
                <a href="/user/login" className="text-decoration-none text-primary">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
