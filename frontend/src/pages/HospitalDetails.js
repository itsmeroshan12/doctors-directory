import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHospital
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'swiper/css';
import styles from './ClinicDetails.module.css';
import Navbar from '../components/Navbar';
import { Autoplay } from 'swiper/modules';

const HospitalDetails = () => {
  const { area, category, slug } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/hospitals/${area}/${category}/${slug}`);
        setHospital(res.data);
      } catch (err) {
        console.error('Error fetching hospital details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [area, category, slug]);

  const calculateDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <Skeleton height={40} width="50%" className="mb-3" />
        <div className="row">
          <div className="col-md-6 mb-3">
            <Skeleton height={300} />
          </div>
          <div className="col-md-6">
            <Skeleton count={8} />
            <div className="d-flex gap-2 mt-3">
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return <div className="text-center my-5 text-danger">Hospital not found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>{hospital.name}</h2>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row">
              {/* Left: Swiper Images */}
              <div className={`col-md-4 col-sm-12 mb-3 p-2 ${styles.card}`}>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  className={styles.swiperContainer}
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {hospital.hospitalImage && (
                    <SwiperSlide>
                      <img
                        src={`http://localhost:5000/uploads/${hospital.hospitalImage}`}
                        alt="Hospital"
                        className={styles.swiperImage}
                      />
                    </SwiperSlide>
                  )}
                  {hospital.otherImage && (
                    <SwiperSlide>
                      <img
                        src={`http://localhost:5000/uploads/${hospital.otherImage}`}
                        alt="Other"
                        className={styles.swiperImage}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>

              {/* Right: Info */}
              <div className={`col-md-8 col-sm-12 p-3 ${styles.card}`}>
                <div className="d-flex align-items-center mb-3">
                  {hospital.hospitalImage ? (
                    <img
                      src={`http://localhost:5000/uploads/${hospital.hospitalImage}`}
                      alt="Hospital"
                      className={`me-2 ${styles.profileImage}`}
                    />
                  ) : (
                    <FaHospital className="me-2 text-primary" size={30} />
                  )}

                  <h5 className={styles.heading}>{hospital.name}</h5>
                </div>

                <p className={styles.textJustify}>{hospital.description}</p>

                <div className={styles.infoText}>
                  <FaMapMarkerAlt className="me-2" /> {hospital.address}, {hospital.area}
                </div>
                <div className={styles.infoText}>
                  <FaPhone className="me-2" /> {hospital.mobile}
                </div>
                <div className={styles.infoText}>
                  <FaCalendarAlt className="me-2" /> Added {calculateDaysAgo(hospital.createdAt)}
                </div>
                <div className={styles.infoText}><strong>Category:</strong> {hospital.category}</div>
                <div className={styles.infoText}><strong>Email:</strong> {hospital.email}</div>
                <div className={styles.infoText}>
                  <strong>Website:</strong>{' '}
                  <a href={hospital.website} target="_blank" rel="noreferrer">{hospital.website}</a>
                </div>

                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <a
                    className={`btn btn-outline-success ${styles.btnCustom}`}
                    href={`https://wa.me/91${hospital.mobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="me-1" /> WhatsApp
                  </a>
                  <a
                    className={`btn btn-outline-primary ${styles.btnCustom}`}
                    href={`tel:+91${hospital.mobile}`}
                  >
                    <FaPhone className="me-1" /> Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalDetails;
