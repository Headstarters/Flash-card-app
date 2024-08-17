// theme.js
import { createTheme } from '@mui/material/styles';

// Create a theme instance with Poppins font
const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    background: {
      default: '#bbe7fc', // Apply your background color here
    },
  },
});

export default theme;
