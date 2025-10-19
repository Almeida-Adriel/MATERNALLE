import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#ec407a', // --color-brand-500
      light: '#fba4b6', // --color-brand-300
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
});

export default customTheme