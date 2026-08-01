import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { ykuatiaTheme } from './ykuatiaTheme';

type Props = {
  children: ReactNode;
};

export const AppThemeProvider = ({ children }: Props) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={ykuatiaTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
