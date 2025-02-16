import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import { userApi } from '../sevices/api';

type VerificationStatus = 'verifying' | 'success' | 'error';

const EmailVerificationPage: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('verifying');
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        console.log("token",token)
         await userApi.verifyEmail(token);
        setVerificationStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        {verificationStatus === 'verifying' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h5">Verifying your email...</Typography>
          </>
        )}
        {verificationStatus === 'success' && (
          <Typography variant="h5" color="primary">
            Email verified successfully! Redirecting to login page...
          </Typography>
        )}
        {verificationStatus === 'error' && (
          <Typography variant="h5" color="error">
            Email verification failed. Please try again or contact support.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EmailVerificationPage;
