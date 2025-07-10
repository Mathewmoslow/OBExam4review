'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import StyledComponentsRegistry from '@/lib/registry';
import { GlobalStyles, theme } from '@/lib/styles';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A202C',
              color: '#F7F9FB',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#06FFA5',
                secondary: '#F7F9FB',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF4365',
                secondary: '#F7F9FB',
              },
            },
          }}
        />
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
