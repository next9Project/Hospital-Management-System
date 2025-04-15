"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.log("المستخدم غير مسجل أو خطأ في الجلب");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-b from-white to-gray-50 shadow-lg" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="text-right flex items-center">
                  {/* Flower logo */}
                  <svg
                    className="h-14 w-14 ml-3 text-pink-700"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50 20C50 20 40 35 25 35C10 35 10 50 10 50C10 50 10 65 25 65C40 65 50 80 50 80C50 80 60 65 75 65C90 65 90 50 90 50C90 50 90 35 75 35C60 35 50 20 50 20Z"
                      fill="currentColor"
                      fillOpacity="0.2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="50" cy="50" r="10" fill="currentColor" />
                    <path
                      d="M30 30C30 30 40 40 50 40C60 40 70 30 70 30"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M30 70C30 70 40 60 50 60C60 60 70 70 70 70"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <div className="text-3xl font-extrabold text-pink-700 tracking-tight">لمسات الجمال</div>
                    <div className="text-xs text-gray-500 font-medium">عيادة التجميل المتكاملة</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4 space-x-reverse">
              <Link href="/" className="text-gray-700 hover:bg-pink-100 hover:text-pink-700 px-4 py-2.5 rounded-lg text-base font-semibold transition-all duration-300 hover:-translate-y-0.5">
                الرئيسية
              </Link>
              <Link href="/appointments" className="text-gray-700 hover:bg-pink-100 hover:text-pink-700 px-4 py-2.5 rounded-lg text-base font-semibold transition-all duration-300 hover:-translate-y-0.5">
                مواعيدي
              </Link>
              <Link href="/about" className="text-gray-700 hover:bg-pink-100 hover:text-pink-700 px-4 py-2.5 rounded-lg text-base font-semibold transition-all duration-300 hover:-translate-y-0.5">
                من نحن
              </Link>
              <Link href="/contact" className="text-gray-700 hover:bg-pink-100 hover:text-pink-700 px-4 py-2.5 rounded-lg text-base font-semibold transition-all duration-300 hover:-translate-y-0.5">
                اتصل بنا
              </Link>
            </div>

            <Link
              href="/appointment"
              className="mr-4 bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800 px-6 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center"
            >
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              احجز موعد
            </Link>

            {/* user info or login button */}
            {user ? (
              <div className="flex items-center gap-2 mr-4">
                <Link href="/profile">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="صورة المستخدم"
                      className="w-9 h-9 rounded-full border-2 border-pink-400 cursor-pointer transition-transform duration-200 hover:scale-110 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold cursor-pointer transition-transform duration-200 hover:scale-110 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                </Link>
                <div className="flex flex-col items-end">
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 font-medium hover:text-red-700 hover:underline transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="mr-4 bg-pink-100 text-pink-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-pink-200 transition-all duration-300 hover:shadow-sm focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 hover:text-pink-700 hover:bg-pink-50 transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
