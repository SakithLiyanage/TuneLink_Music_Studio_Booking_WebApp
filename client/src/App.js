import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StudiosPage from './pages/StudiosPage';
import StudioDetailsPage from './pages/StudioDetailsPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailsPage from './pages/ArtistDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboard pages - Client
import ClientDashboard from './dashboard/client/ClientDashboard';
import ClientBookings from './dashboard/client/ClientBookings';
import ClientProfile from './dashboard/client/ClientProfile';

// Dashboard pages - Artist
import ArtistDashboard from './dashboard/artist/ArtistDashboard';
import ArtistProfile from './dashboard/artist/ArtistProfile';
import ArtistBookings from './dashboard/artist/ArtistBookings';
import ArtistMedia from './dashboard/artist/ArtistMedia';
import ArtistAvailability from './dashboard/artist/ArtistAvailability';

// Dashboard pages - Studio
import StudioDashboard from './dashboard/studio/StudioDashboard';
import StudioProfile from './dashboard/studio/StudioProfile';
import StudioBookings from './dashboard/studio/StudioBookings';
import StudioImages from './dashboard/studio/StudioImages';
import StudioAvailability from './dashboard/studio/StudioAvailability';

// Dashboard pages - Admin
import AdminDashboard from './dashboard/admin/AdminDashboard';
import AdminUsers from './dashboard/admin/AdminUsers';
import AdminStudios from './dashboard/admin/AdminStudios';
import AdminArtists from './dashboard/admin/AdminArtists';
import AdminBookings from './dashboard/admin/AdminBookings';

// Auth provider for context
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="studios" element={<StudiosPage />} />
            <Route path="studios/:id" element={<StudioDetailsPage />} />
            <Route path="artists" element={<ArtistsPage />} />
            <Route path="artists/:id" element={<ArtistDetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Client dashboard routes */}
          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ClientDashboard />} />
            <Route path="bookings" element={<ClientBookings />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>

          {/* Artist dashboard routes */}
          <Route path="/artist" element={
            <ProtectedRoute allowedRoles={['artist']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ArtistDashboard />} />
            <Route path="profile" element={<ArtistProfile />} />
            <Route path="bookings" element={<ArtistBookings />} />
            <Route path="media" element={<ArtistMedia />} />
            <Route path="availability" element={<ArtistAvailability />} />
          </Route>

          {/* Studio dashboard routes */}
          <Route path="/studio" element={
            <ProtectedRoute allowedRoles={['studio']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudioDashboard />} />
            <Route path="profile" element={<StudioProfile />} />
            <Route path="bookings" element={<StudioBookings />} />
            <Route path="images" element={<StudioImages />} />
            <Route path="availability" element={<StudioAvailability />} />
          </Route>

          {/* Admin dashboard routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="studios" element={<AdminStudios />} />
            <Route path="artists" element={<AdminArtists />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;