// pages/Signup.js
import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FormikValues, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {userApi} from '../sevices/api';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
     await userApi.register(values)
     
      navigate('/login');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
              <Field
                as={TextField}
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                margin="normal"
                error={touched.phoneNumber && errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
              <Field
                as={TextField}
                fullWidth
                name="password"
                label="Password"
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
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Signup;
