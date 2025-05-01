import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import VendorPortalPage from './pages/VendorPortalPage';
import DashboardPage from './pages/DashboardPage';
import CommunityPage from './pages/CommunityPage';
import VenuePage from './pages/VenuePage';
import { EventProvider } from './contexts/EventContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <EventProvider>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/vendor-portal" element={<VendorPortalPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/venues" element={<VenuePage />} />
          </Routes>
        </Layout>
      </EventProvider>
    </Router>
  );
}

export default App;