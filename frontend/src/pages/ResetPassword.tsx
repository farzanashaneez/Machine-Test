import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { userApi } from '../sevices/api';
import { useSnackbar } from '../context/ImageAppContext';
import axios, { AxiosError } from 'axios';

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { openSnackbar } = useSnackbar();


  const handleEmailSubmit = async (values: { email: string }, { setSubmitting }: any) => {
    try {
      await userApi.forgotPassword(values.email);
      setEmail(values.email);
      setStep(2);
      setOpenDialog(true);
      openSnackbar("Otp send to email successfully",'success')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ status: string; statusCode: number; message: string }>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data.message || 'An error occurred';
          openSnackbar(errorMessage,'error')
        } else {
          openSnackbar(axiosError.message,'error')
        }
      } else {
        openSnackbar('An unexpected error occurred','error')
      }

    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (values: { otp: string }, { setSubmitting }: any) => {
    try {
      await userApi.validateOTP(values.otp,email);
      setStep(3);
    } catch (error) {
      console.error('Error validating OTP:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (values: { password: string }, { setSubmitting }: any) => {
    try {
      await userApi.resetPassword({ email, password: values.password });
      setOpenDialog(false);
      // Show success message or redirect to login
    } catch (error) {
      console.error('Error resetting password:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().required('Required').length(6, 'OTP must be 6 digits'),
  });

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Required'),
  });

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={emailValidationSchema}
          onSubmit={handleEmailSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                type="email"
                margin="normal"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                Send Reset Link
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          {step === 2 && (
            <Formik
              initialValues={{ otp: '' }}
              validationSchema={otpValidationSchema}
              onSubmit={handleOtpSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    name="otp"
                    label="OTP"
                    margin="normal"
                    error={touched.otp && errors.otp}
                    helperText={touched.otp && errors.otp}
                  />
                  <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>Verify OTP</Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
          {step === 3 && (
            <Formik
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={passwordValidationSchema}
              onSubmit={handlePasswordReset}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    name="password"
                    label="New Password"
                    type="password"
                    margin="normal"
                    error={touched.password && errors.password}
                    helperText={touched.password && errors.password}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    margin="normal"
                    error={touched.confirmPassword && errors.confirmPassword}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                  <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>Reset Password</Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ResetPassword;
