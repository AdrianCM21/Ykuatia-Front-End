import type { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#0B6E6E',
      dark: '#084F4F',
      light: '#2A9A9A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1F4E79',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#E8F2F2',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#14323A',
      secondary: '#4A6670',
    },
    success: {
      main: '#2E7D4F',
    },
    error: {
      main: '#C23B3B',
    },
    divider: 'rgba(11, 110, 110, 0.12)',
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #0B6E6E 0%, #1F4E79 100%)',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(11, 110, 110, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #0B6E6E 0%, #1F4E79 100%)',
          boxShadow: '0 8px 24px rgba(11, 110, 110, 0.18)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(11, 110, 110, 0.12)',
          background:
            'linear-gradient(180deg, #F4FBFA 0%, #EAF4F4 55%, #E2EEF2 100%)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#E8F2F2',
        },
      },
    },
  },
};
