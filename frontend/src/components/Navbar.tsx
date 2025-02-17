import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LoggedOut } from '.././reduxStore/slices/userSlice';
import { RootState } from '../reduxStore/store';
import AlertModal from './AlertModal';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.appUser.isAuthenticated);
  const userDetails = useSelector((state: RootState) => state.appUser.user);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    if (isAuthenticated && userDetails) {
      setEmail(userDetails.email);
    } else {
      setEmail(null);
    }
  }, [isAuthenticated, userDetails]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirm = () => {
    console.log('Confirmed');
    handleLogout()
    handleCloseModal();
  };

  const handleLogout = () => {
    dispatch(LoggedOut());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Image App
        </Typography>
        {isAuthenticated && email && (
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Welcome, {email}
          </Typography>
        )}
        <Box>
          
          {isAuthenticated ? (
          
            <Button color="inherit" onClick={handleOpenModal}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>Signup</Button>
            </>
          )}
        </Box>
      </Toolbar>
      <AlertModal
        open={isModalOpen}
        title="Logout"
        content="Do you want to continue?"
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </AppBar>
  );
};

export default Navbar;

