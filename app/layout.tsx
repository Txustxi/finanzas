import '@/styles/globals.css';
import Providers from './providers';
import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

export const metadata = {
  title: 'Quant Platform',
  description: 'Panel cuantitativo',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <MotionConfig reducedMotion="user">
          <Providers>{children}</Providers>
        </MotionConfig>
      </body>
    </html>
  );
}
