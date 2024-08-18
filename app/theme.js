import { createTheme } from '@mui/material/styles';

// Light Theme
const lightTheme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    mode: 'light',
    background: {
      default: '#e3f2fd',
    },
    primary: {
      main: '#009688',
    },
  },
});

// Dark Theme
const darkTheme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#1b1b1b',
    },
    primary: {
      main: '#ffc107',
    },
  },
});

export { lightTheme, darkTheme };
