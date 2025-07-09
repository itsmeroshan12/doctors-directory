import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ClinicList.css'; // reuse the same styles
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import { Collapse } from 'react-bootstrap';
import Navbar from './Navbar';
import slugify from '../utils/slugify';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const DoctorList = () => {
  const [filters, setFilters] = useState({ name: '', area: '' });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const doctorsPerPage = 5;
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 768;

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/doctors', {
        params: filters,
      });
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDoctors(sorted);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ name: '', area: '' });
    setCurrentPage(1);
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const truncateWords = (text, maxWords) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  };

  const highlightMatch = (text, keyword) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? <mark key={i}>{part}</mark> : part
    );
  };

  const calculateDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <Navbar />

      <div className="px-4 mt-3">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
      </div>
      <div className="clinic-list-wrapper container mt-4">
        <h2 className="text-center text-primary mb-4">Doctors</h2>

        {isMobile && (
          <div className="text-center mb-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide Filters ▲' : 'Show Filters ▼'}
            </button>
          </div>
        )}

        <Collapse in={!isMobile || showFilters}>
          <div className="sticky-filter bg-white py-3 shadow-sm mb-3 px-2 animate-fade-in">
            <div className="row g-2 align-items-center justify-content-center text-center">
              <div className="col-6 col-md-3">
                <input
                  name="name"
                  className="form-control animate-input"
                  placeholder="Search by Name"
                  value={filters.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6 col-md-3">
                <input
                  name="area"
                  className="form-control animate-input"
                  placeholder="Search by Area"
                  value={filters.area}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6 col-md-2 mt-2 mt-md-0">
                <button className="btn btn-outline-primary w-100 animate-button" onClick={handleSearch}>
                  Search
                </button>
              </div>
              <div className="col-6 col-md-2 mt-2 mt-md-0">
                <button className="btn btn-outline-danger w-100 animate-button" onClick={handleClearFilters}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </Collapse>

        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="clinic-listing shimmer mb-3 d-flex align-items-center justify-content-center w-100">
              <div className="shimmer-img me-3 rounded"></div>
              <div className="flex-grow-1">
                <div className="shimmer-line w-75 mb-2"></div>
                <div className="shimmer-line w-50 mb-1"></div>
                <div className="shimmer-line w-100"></div>
              </div>
            </div>
          ))
        ) : currentDoctors.length === 0 ? (
          <p className="text-center">No doctors found.</p>
        ) : (
          currentDoctors.map((doc) => (
            <div key={doc.id} className="clinic-listing mb-4 d-flex w-100 animate-fade-in">
              <img
                src={`http://localhost:5000/uploads/${doc.doctorImage}`}
                alt={doc.name}
                className="clinic-img me-3 rounded"
              />
              <div className="flex-grow-1">
                <div className="clinic-title fw-bold text-dark fs-5 mb-1">
                  {highlightMatch(doc.name, filters.name)}
                </div>
                <div className="text-secondary small mb-1">
                  {truncateWords(doc.description, isMobile ? 15 : 25)}
                </div>
                <div className="text-muted small mb-3">
                  🩺 {doc.specialization} &nbsp;|&nbsp; 📍 {highlightMatch(doc.area, filters.area)} &nbsp;|&nbsp; 📞 {doc.mobile} &nbsp;|&nbsp; 📅 {calculateDaysAgo(doc.createdAt)}
                </div>
                <div className={`row g-2 ${isMobile ? 'flex-nowrap overflow-auto mobile-button-row' : ''}`}>
                  <div className="col-12 col-md">
                    <button
                      className="btn btn-sm btn-outline-primary shadow-sm rounded-pill custom-mobile-btn"
                      onClick={() => {
                        window.location.href = `/doctors/${slugify(doc.area)}/${slugify(doc.category)}/${doc.slug}`;
                      }}
                    >
                      View More
                    </button>
                  </div>
                  <div className="col-12 col-md">
                    <a
                      className="btn btn-sm btn-success shadow-sm rounded-pill custom-mobile-btn"
                      href={`https://wa.me/91${doc.mobile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="me-1" /> WhatsApp
                    </a>
                  </div>
                  <div className="col-12 col-md">
                    <a
                      className="btn btn-sm btn-outline-secondary shadow-sm rounded-pill custom-mobile-btn"
                      href={`tel:+91${doc.mobile}`}
                    >
                      <FaPhone className="me-1" /> Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="d-flex justify-content-center py-4 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              className={`btn btn-sm mx-1 custom-mobile-btn ${currentPage === idx + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default DoctorList;
