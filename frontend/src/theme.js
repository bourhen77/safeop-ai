import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BCD4',
      light: '#4DD0E1',
      dark: '#0097A7',
      contrastText: '#000',
    },
    secondary: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
    },
    background: {
      default: '#050D1A',
      paper: '#0A1628',
    },
    success: { main: '#00C853' },
    warning: { main: '#FFB300' },
    error: { main: '#F44336' },
    text: {
      primary: '#E8F4F8',
      secondary: '#90A4AE',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 4, padding: '8px 20px' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #4DD0E1 0%, #00BCD4 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 188, 212, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: '"Roboto Mono", monospace' },
      },
    },
  },
});

export default theme;
