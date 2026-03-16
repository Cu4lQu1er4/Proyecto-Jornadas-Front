import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import RegisterSW from "./register-sw";
import SessionLoader from "@/components/SessionLoader";

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Control Laboral Nerpel",
  description: "Sistema de control laboral de INDUSTRIA TEXTIL NERPEL SAS",
  manifest: "/manifest.json",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={dmSans.variable} lang="en">
      <body
        className="font-sans"
      >
        <SessionLoader />
        <RegisterSW />
        {children}
        <Toaster 
          position="top-center"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}