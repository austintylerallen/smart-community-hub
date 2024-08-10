import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewsfeedPage from './pages/NewsfeedPage'; // Import NewsfeedPage
import ProtectedRoute from './components/ProtectedRoute';
import Notifications from './components/Notifications'; // Ensure this import is correct

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Notifications />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/newsfeed" element={<ProtectedRoute component={NewsfeedPage} />} /> {/* Add Newsfeed route */}
        </Routes>
      </Container>
    </SnackbarProvider>
  );
}

export default App;
