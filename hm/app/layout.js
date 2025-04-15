import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "عيادة التجميل",
  description: "موقع عيادة تجميل لحجز المواعيد والخدمات",
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let role = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      role = decoded?.role;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const showLayout = role === "patient";

  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-pink-50 text-gray-800`}>
        {showLayout && <Navbar />}
        {children}
        {showLayout && <Footer />}
      </body>
    </html>
  );
}


