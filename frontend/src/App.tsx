import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from '../theme';
import store, { RootState } from '../src/reduxStore/store';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoutes';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { ImageAppContextProvider } from './context/ImageAppContext';

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.appUser.isAuthenticated);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ImageAppContextProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
          <Route 
  path="/login" 
  element={
    isLoggedIn ? <Navigate to="/home" replace /> : <Login />
  } 
/>            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
        </ImageAppContextProvider>
      </ThemeProvider>
  );
}

export default App;