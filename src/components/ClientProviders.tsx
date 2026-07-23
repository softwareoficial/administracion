'use client';

import { ThemeProvider } from '../lib/theme/ThemeProvider';
import { ToastProvider } from '../components/toast/ToastProvider';
import { TourProvider } from '../components/tour/TourProvider';
import { LoadingProvider } from '../components/loading/LoadingProvider';
import VersionChecker from '../components/VersionChecker';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TourProvider>
          <LoadingProvider>
            <VersionChecker />
            {children}
          </LoadingProvider>
        </TourProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
