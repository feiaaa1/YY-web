import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
    document.documentElement.dataset.theme = theme;
  }, []);

  return <>{children}</>;
}
