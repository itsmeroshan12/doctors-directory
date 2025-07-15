import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API = process.env.REACT_APP_API_BASE;
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError(true);
      setMessage('Verification token missing.');
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${API}/api/user/verify-email?token=${token}`);
        const msg = response.data.message || 'Email verified successfully!';
        setMessage(msg);

        // Treat "already verified" as success
        if (msg.toLowerCase().includes('already verified')) {
          setError(false);
        }

        setLoading(false);

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/user/login');
        }, 10000);
      } catch (err) {
        setError(true);
        setMessage(err.response?.data?.message || 'Verification failed or token expired.');
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center">
          <h2 className={`mb-3 ${error ? 'text-danger' : 'text-success'}`}>
            {error ? 'Error' : 'Success'}
          </h2>

          {loading ? (
            <div>
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Verifying your email...</p>
            </div>
          ) : (
            <>
              <div
                role="alert"
                className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`}
              >
                {message}
              </div>
              {!error && <p className="text-muted">You will be redirected shortly...</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
