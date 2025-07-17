import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import CheckEmail from './components/CheckEmail';
import VerifyEmail from './components/VerifyEmail';

import AddClinic from './components/AddListing';
import ClinicList from './components/ClinicList';
import ClinicDetails from './pages/ClinicDetails';


import AddDoctor from './components/AddDoctor';
import DoctorList from './components/DoctorList';
import DoctorDetails from './pages/DoctorDetails';
import DoctorEdit from './pages/DoctorEdit'; 

import AddHospital from './components/AddHospital';
import HospitalList from './components/HospitalList';
import HospitalDetails from './pages/HospitalDetails';
import HospitalEdit from './pages/HospitalEdit';

import MyListings from './pages/MyListings';
import ClinicEdit from './pages/ClinicEdit';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import ProtectedRoute from './components/ProtectedRoute';




function App() {
  return (
    <Router>
      <Routes>
        {/* User Authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/check-email" element={<CheckEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password/:token" element={<ResetPassword />} />

        <Route path="/user/items" element={  <ProtectedRoute> <MyListings /> </ProtectedRoute>} />

        {/* Clinic */}
        <Route path="/clinics/add" element={<ProtectedRoute><AddClinic /></ProtectedRoute>} />
        <Route path="/clinics/list" element={<ClinicList />} />
        <Route path="/clinics/:area/:category/:slug" element={<ClinicDetails />} />
        <Route path="/clinics/edit/:id" element={<ProtectedRoute><ClinicEdit /></ProtectedRoute>} />

        {/* Doctor */}
        <Route path="/doctors/add" element={<ProtectedRoute> <AddDoctor /></ProtectedRoute>} />
        <Route path="/doctors/list" element={<DoctorList />} />
        <Route path="/doctors/:area/:category/:slug" element={<DoctorDetails />} />
        <Route path="/doctors/edit/:id" element={<ProtectedRoute><DoctorEdit /></ProtectedRoute>} /> 

        {/* Hospital - ✅ Correct Route */}
        <Route path="/hospitals/add" element={<ProtectedRoute><AddHospital /></ProtectedRoute>} />
        <Route path="/hospitals/list" element={<HospitalList />} />
        <Route path="/hospitals/:area/:slug" element={<HospitalDetails />} />
         <Route path="/hospitals/edit/:id" element={<ProtectedRoute><HospitalEdit /></ProtectedRoute>} />
         
        

        {/* Optional: 404 redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
