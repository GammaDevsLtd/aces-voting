import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import Header from "@/components/Header/Header";
import GammaDevs from "@/components/GammaDevs/GammaDevs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aces TechFest 2025",
  description: "Regsitrations are now Ongoing!! Join Us at River State University for an experience like no other",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
        {children}
        <GammaDevs/>
        </AuthProvider>
      </body>
    </html>
  );
}
