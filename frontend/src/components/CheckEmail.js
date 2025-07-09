// components/CheckEmail.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const CheckEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow p-4 text-center rounded-4">
            <FaEnvelopeOpenText size={50} className="text-success mb-3" />
            <h3>Verify Your Email</h3>
            <p className="mt-3">
              We’ve sent a verification link to your email. Please click the link to complete your registration.
            </p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
