import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#ec407a', // --color-brand-500
      light: '#ffe4ea', // --color-brand-100
      medium: '#eb5f8ef1',
      dark: '#b81f57', // --color-brand-700
      contrastText: '#fff',
    },
  },
  components: {
    // Garantindo que todos os TextFields tenham o estilo outlined por padrão
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
  MuiMenuItem: { 
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#fba4b6', 
            color: '#b81f57',
            '&:hover': { 
              backgroundColor: '#ec407a', 
              color: '#fff', 
            },
          },
          '&:hover': {
            backgroundColor: '#fba4b6',
          },
        },
      },
    },
});

export default customTheme