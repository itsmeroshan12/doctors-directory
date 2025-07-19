import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Placeholder } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faClinicMedical, faHospital } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Navbar from '../components/Navbar';
import slugify from '../utils/slugify';
import Footer from '../components/Footer';
import { TypeAnimation } from 'react-type-animation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_BASE;

  const cards = [
    { title: "Doctors", icon: faUserMd, path: "/doctors/list" },
    { title: "Clinics", icon: faClinicMedical, path: "/clinics/list" },
    { title: "Hospitals", icon: faHospital, path: "/hospitals/list" },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [doctorsRes, clinicsRes, hospitalsRes] = await Promise.all([
          axios.get(`${API}/api/doctors/latest`),
          axios.get(`${API}/api/clinics/latest`),
          axios.get(`${API}/api/hospitals/latest`),
        ]);

        const combined = [
          ...doctorsRes.data.map(item => ({ ...item, type: 'doctor' })),
          ...clinicsRes.data.map(item => ({ ...item, type: 'clinic' })),
          ...hospitalsRes.data.map(item => ({ ...item, type: 'hospital' })),
        ];

        setListings(combined.slice(0, 12));
      } catch (error) {
        console.error('Error fetching latest listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [API]);

  const getListingUrl = (item) => {
    const area = slugify(item.area || 'unknown');
    const slug = item.slug || 'no-slug';

    if (item.type === 'hospital') {
      // No category in hospital route
      return `/hospitals/${area}/${slug}`;
    }

    const category = slugify(item.category || item.type || 'general');
    return `/${item.type}s/${area}/${category}/${slug}`;
  };

  const handleAddClick = (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      toast.warning('Please login to add a listing');
      navigate('/user/login');
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <section className="premium-section py-5">
          <div className="text-center mb-5">
            <h1 className="text-white fw-bold">Welcome to Doctor Directory</h1>

            <TypeAnimation
              sequence={[
                'Locate and list the best doctors - Clinic - hospitals in your city..',
                2000,
                '',
                'Find trusted healthcare professionals near you..',
                2000,
                '',
              ]}
              wrapper="p"
              className="lead typing-text text-light"
              cursor={true}
              repeat={Infinity}
            />

            <div className="dropdown d-inline-block mt-3 position-relative">
              <button
                className="btn btn-light dropdown-toggle fw-semibold"
                type="button"
                id="addDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleAddClick}
              >
                ➕ Add Listing
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                aria-labelledby="addDropdown"
                style={{ position: 'absolute', zIndex: 1000 }}
              >
                <li>
                  <Link className="dropdown-item d-flex align-items-center gap-2" to="/doctors/add">
                    <i className="fas fa-user-md text-primary"></i> Add Doctor
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center gap-2" to="/clinics/add">
                    <i className="fas fa-clinic-medical text-success"></i> Add Clinic
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center gap-2" to="/hospitals/add">
                    <i className="fas fa-hospital text-danger"></i> Add Hospital
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Container>
            <Row className="justify-content-center flex-wrap text-center">
              {cards.map((card, index) => (
                <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-4">
                  <Card
                    className="shadow-sm h-100 card-hover bg-white rounded-4 border-0"
                    onClick={() => navigate(card.path)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                      <div className="icon-circle mb-3">
                        <FontAwesomeIcon icon={card.icon} size="2x" className="text-primary" />
                      </div>
                      <Card.Title className="mb-2" style={{ fontSize: '1rem' }}>{card.title}</Card.Title>
                      <Button variant="outline-primary" size="sm">View</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <div className="text-center mb-3 mt-5">
          <h4 className="text-dark">Latest Listings</h4>
        </div>

        <Container className="col-10">
          <Row className="g-4">
            {loading
              ? Array.from({ length: 8 }).map((_, idx) => (
                <Col key={idx} xs={12} sm={6} md={3}>
                  <Card className="h-100 shadow-sm">
                    <Placeholder as={Card.Img} animation="wave" style={{ height: '180px' }} />
                    <Card.Body>
                      <Placeholder as={Card.Title} animation="wave" xs={6} />
                      <Placeholder as={Card.Text} animation="wave" xs={4} />
                      <Placeholder.Button variant="primary" xs={6} />
                    </Card.Body>
                  </Card>
                </Col>
              ))
              : listings.map((item, idx) => (
                <Col key={idx} xs={12} sm={6} md={3}>
                  <Card className="h-100 shadow-sm listing-card">
                    <Card.Img
                      variant="top"
                      src={item.image ? `${API}/uploads/${item.image}` : 'https://via.placeholder.com/300x180.png?text=No+Image'}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title className="fw-semibold" style={{ fontSize: '1rem' }}>
                        {item.name}
                      </Card.Title>
                      <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {item.category || item.type}
                      </Card.Text>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(getListingUrl(item))}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>

        <Container className='col-10 py-5'>
          <Row className='g-5'>
            <div className="offer-section text-center text-white px-3 py-5 rounded-2">
              <h2 className="fw-bold mb-3">What We Offer</h2>
              <p className="mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
                Doctor Directory is your one-stop platform to explore trusted <strong>Doctors</strong>,
                top-rated <strong>Clinics</strong>, and leading <strong>Hospitals</strong> in your area.
                Add your listings, connect with patients, and grow your medical presence — all in one place.
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-4">
                <div className="info-box text-start bg-light text-dark p-4 rounded shadow-sm">
                  <h6 className="text-primary fw-bold mb-2">✅ Verified Listings</h6>
                  <p className="small mb-0">Only trusted professionals and institutions.</p>
                </div>
                <div className="info-box text-start bg-light text-dark p-4 rounded shadow-sm">
                  <h6 className="text-success fw-bold mb-2">📍 Location Based</h6>
                  <p className="small mb-0">Find the nearest medical help in seconds.</p>
                </div>
                <div className="info-box text-start bg-light text-dark p-4 rounded shadow-sm">
                  <h6 className="text-warning fw-bold mb-2">💼 Add Your Profile</h6>
                  <p className="small mb-0">Doctors, Clinics, and Hospitals can list easily.</p>
                </div>
                <div className="info-box text-start bg-light text-dark p-4 rounded shadow-sm">
                  <h6 className="text-danger fw-bold mb-2">🔒 Secure Contact</h6>
                  <p className="small mb-0">We protect your privacy and data.</p>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
