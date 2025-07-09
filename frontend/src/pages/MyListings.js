import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Collapse,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faClinicMedical,
  faHospital,
  faArrowLeft,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import "./MyListings.css";

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    type: "all",
    sort: "latest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const listingsPerPage = 12;

  const cards = [
    { title: "Doctors", icon: faUserMd, path: "/doctors/add" },
    { title: "Clinics", icon: faClinicMedical, path: "/clinics/add" },
    { title: "Hospitals", icon: faHospital, path: "/hospitals/add" },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/listings", {
          withCredentials: true,
        });
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  const getImage = (item) =>
    item.clinicImage || item.doctorImage || item.hospitalImage || "default.png";

  const confirmDelete = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedItem) return;

    const { listingType, id } = selectedItem;

    try {
      await axios.delete(`http://localhost:5000/api/${listingType}s/${id}`, {
        withCredentials: true,
      });

      setListings((prev) =>
        prev.filter((item) => !(item.listingType === listingType && item.id === id))
      );

      setShowModal(false);
      toast.success("Listing deleted successfully!");
    } catch (err) {
      console.error("Error deleting listing:", err);
      toast.error("Failed to delete. Try again.");
    }
  };

  const filteredListings = listings
    .filter((item) =>
      filters.type === "all" ? true : item.listingType === filters.type
    )
    .filter((item) =>
      filters.name
        ? item.name.toLowerCase().includes(filters.name.toLowerCase())
        : true
    )
    .sort((a, b) =>
      filters.sort === "latest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const indexOfLast = currentPage * listingsPerPage;
  const indexOfFirst = indexOfLast - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  const resetFilters = () => {
    setFilters({ name: "", type: "all", sort: "latest" });
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <div className="px-4 mt-3">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
      </div>

      <Container className="my-4">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <h2 className="text-primary">My Listings</h2>
        </div>

        {/* Filter Toggle (Mobile) */}
        <div className="d-md-none text-center mb-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            {showMobileFilter ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filter Section */}
        <Collapse in={showMobileFilter || window.innerWidth >= 768}>
          <div className="bg-light border rounded p-3 mb-4">
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </Col>
              <Col xs={6} md={4}>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="doctor">Doctors</option>
                  <option value="clinic">Clinics</option>
                  <option value="hospital">Hospitals</option>
                </Form.Select>
              </Col>
              <Col xs={6} md={2}>
                <Form.Select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={2}>
                <Button variant="outline-danger" onClick={resetFilters} className="w-100">
                  Reset
                </Button>
              </Col>
            </Row>
          </div>
        </Collapse>

        {/* Add Listing Cards */}
        <Row className="justify-content-center mb-5">
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className="text-center shadow-sm h-100 card-hover"
                onClick={() => navigate(card.path)}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                  <div className="icon-circle mb-3">
                    <FontAwesomeIcon icon={card.icon} className="icon" />
                  </div>
                  <Card.Title className="mb-3">{card.title}</Card.Title>
                  <Button variant="outline-primary" size="sm">
                    Add
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* User Listings */}
        <Row>
          {currentListings.length === 0 ? (
            <p className="text-center">No listings found.</p>
          ) : (
            currentListings.map((item) => (
              <Col key={`${item.listingType}-${item.id}`} xs={12} sm={6} md={3} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000/uploads/${getImage(item)}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      <strong>Type:</strong> {item.type} <br />
                      <strong>Area:</strong> {item.area} <br />
                      <strong>Category:</strong> {item.category} <br />
                      <strong>Mobile:</strong> {item.mobile} <br />
                      <small className="text-muted">
                        <strong>Listing:</strong> {item.listingType}
                      </small>
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/${item.listingType.toLowerCase()}s/edit/${item.id}`)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(item)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={currentPage === idx + 1 ? "primary" : "outline-primary"}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            Are you sure you want to delete this listing?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
       <Footer />
    </>
  );
};

export default MyListings;
