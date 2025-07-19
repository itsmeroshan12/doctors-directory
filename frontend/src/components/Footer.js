import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="footer bg-dark text-white text-center py-4">
      <div className="container">
        <p className="mb-2">&copy; {new Date().getFullYear()} DoctorDirectory</p>

        <div className="footer-links mb-2">
          <a href="/">Home</a>
          <span className="mx-2">|</span>
          <a href="/user/login">Login</a>
        </div>

        <div className="social-icons mb-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white">
            <FaInstagram />
          </a>
        </div>

        <div className="powered-by mt-3">
          <small>
            Powered by{' '}
            <a href="https://edgelinktechnology.com/" target="_blank" rel="noopener noreferrer" className="text-info">
              Edgelink Technology
            </a>
          </small>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
