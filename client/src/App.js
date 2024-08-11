import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NewsfeedPage from './pages/NewsfeedPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Teal
    },
    secondary: {
      main: '#004d40', // Dark Teal
    },
  },
});

const App = () => {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    setAuth(!!accessToken);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar isAuth={isAuth} setAuth={setAuth} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newsfeed" element={<NewsfeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        <Route path="/register" element={<RegisterPage setAuth={setAuth} />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
