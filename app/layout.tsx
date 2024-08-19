'use client';
import {
  ClerkProvider,
  
} from '@clerk/nextjs'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from './theme';
import { CssBaseline } from '@mui/material';

const inter = Inter({ subsets: ["latin"] });


// export const metadata: Metadata = {
//   title: "Flash Card App",
//   description: "AI Flash Card App",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <ClerkProvider>
        <CssBaseline />
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
    </ClerkProvider>
  );
}