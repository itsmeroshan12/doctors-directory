import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaPhone, FaWhatsapp, FaMapMarkerAlt, FaCalendarAlt, FaUserMd,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'swiper/css';
import styles from './ClinicDetails.module.css';
import Navbar from '../components/Navbar';
import { Autoplay } from 'swiper/modules';


const ClinicDetails = () => {
  const { area, category, slug } = useParams();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clinics/${area}/${category}/${slug}`);
        setClinic(res.data);
      } catch (err) {
        console.error('Error fetching clinic details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
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

  if (!clinic) {
    return <div className="text-center my-5 text-danger">Clinic not found.</div>;
  }

  return (
    <>
      <Navbar />


      <div className={styles.container}>
        <h2 className={styles.title}>{clinic.name}</h2>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row">
              {/* Left Column: Swiper Images */}
              <div className={`col-md-4 col-sm-12 mb-3 p-2 ${styles.card}`}>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  className={styles.swiperContainer}
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                >
                  {clinic.clinicImage && (
                    <SwiperSlide>
                      <img
                        src={`http://localhost:5000/uploads/${clinic.clinicImage}`}
                        alt="Clinic"
                        className={styles.swiperImage}
                      />
                    </SwiperSlide>
                  )}
                  {clinic.doctorImage && (
                    <SwiperSlide>
                      <img
                        src={`http://localhost:5000/uploads/${clinic.doctorImage}`}
                        alt="Doctor"
                        className={styles.swiperImage}
                      />
                    </SwiperSlide>
                  )}
                  {clinic.otherImage && (
                    <SwiperSlide>
                      <img
                        src={`http://localhost:5000/uploads/${clinic.otherImage}`}
                        alt="Other"
                        className={styles.swiperImage}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>

              </div>

              {/* Right Column: Details */}
              <div className={`col-md-8 col-sm-12 p-3 ${styles.card}`}>
                <div className="d-flex align-items-center mb-3">
                  {clinic.doctorImage ? (
                    <img
                      src={`http://localhost:5000/uploads/${clinic.doctorImage}`}
                      alt="Doctor"
                      className={`me-3 ${styles.profileImage}`}
                    />
                  ) : (
                    <FaUserMd className="me-2 text-primary" size={30} />
                  )}

                  <div className="d-flex flex-column">
                    <h5 className={styles.heading} style={{ marginBottom: "2px" }}>
                      {clinic.doctorName}
                    </h5>

                    {clinic.qualifications && (
                      <span className="fw-semibold text-secondary" style={{ fontSize: "14px" }}>
                        {clinic.qualifications}
                      </span>
                    )}
                  </div>
                </div>


                <p className={styles.textJustify}>{clinic.description}</p>

                <div className={styles.infoText}>
                  <FaMapMarkerAlt className="me-2" /> {clinic.address}, {clinic.area}
                </div>
                <div className={styles.infoText}>
                  <FaPhone className="me-2" /> {clinic.mobile}
                </div>
                <div className={styles.infoText}>
                  <FaCalendarAlt className="me-2" /> Added {calculateDaysAgo(clinic.createdAt)}
                </div>
                <div className={styles.infoText}><strong>Category:</strong> {clinic.category}</div>
                <div className={styles.infoText}><strong>Qualifications:</strong> {clinic.qualifications}</div>

                <div className={styles.infoText}><strong>Specialization:</strong> {clinic.specialization}</div>

                <div className={styles.infoText}><strong>Experience:</strong> {clinic.experience} years</div>
                <div className={styles.infoText}><strong>Email:</strong> {clinic.email}</div>
                <div className={styles.infoText}>
                  <strong>Website:</strong>{' '}
                  <a href={clinic.website} target="_blank" rel="noreferrer">{clinic.website}</a>
                </div>

                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <a
                    className={`btn btn-outline-success ${styles.btnCustom}`}
                    href={`https://wa.me/91${clinic.mobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="me-1" /> WhatsApp
                  </a>
                  <a
                    className={`btn btn-outline-primary ${styles.btnCustom}`}
                    href={`tel:+91${clinic.mobile}`}
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

export default ClinicDetails;
