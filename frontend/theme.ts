// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Modern blue for primary buttons
    },
    secondary: {
      main: '#F5A623', // Warm orange for secondary actions
    },
    success: {
      main: '#28C76F', // Green for success messages
    },
    warning: {
      main: '#FFC107', // Yellow for warnings
    },
    error: {
      main: '#FF4D4F', // Red for errors
    },
    background: {
      default: '#F4F5FA', // Light gray background
      paper: '#FFFFFF', // White for cards/dialogs
    },
    text: {
      primary: '#212121', // Dark gray for main text
      secondary: '#757575', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
    button: {
      textTransform: 'none', // Keeps button text capitalization minimal
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Smooth corners for buttons
        },
      },
    },
  },
});

export default theme;
