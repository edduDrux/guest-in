"use client";
import { SessionProvider } from 'next-auth/react';
import "./globals.css";
import { Comfortaa } from '@next/font/google';

const comfortaa = Comfortaa({
  weight: ['300', '400', '500', '600', '700'], // Escolha os pesos disponíveis
  subsets: ['latin'], // Escolha o subset
  variable: '--font-comfortaa', // Defina uma variável CSS
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comfortaa.variable} font-sans antialiased`}>
        {/* Envolva com o SessionProvider */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
