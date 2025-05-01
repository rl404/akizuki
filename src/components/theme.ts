'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
});

export default theme;
