"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="text-right flex items-center">
                  {/* Flower logo */}
                  <svg
                    className="h-12 w-12 ml-2 text-pink-600"
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
                    <div className="text-2xl font-bold text-pink-600">
                      لمسات الجمال
                    </div>
                    <div className="text-sm text-gray-600">
                      عيادة التجميل المتكاملة
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4 space-x-reverse">
              <Link
                href="/"
                className="text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-2 rounded-md text-md font-medium"
              >
                الرئيسية
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-2 rounded-md text-md font-medium"
              >
                خدماتنا
              </Link>
              {/* <Link
                href="/specialists"
                className="text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-2 rounded-md text-md font-medium"
              >
                الأخصائيون
              </Link> */}
              {/* <Link
                href="/gallery"
                className="text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-2 rounded-md text-md font-medium"
              >
                معرض الصور
              </Link> */}
              <Link
                href="/about"
                className="text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-2 rounded-md text-md font-medium"
              >
                من نحن
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-2 rounded-md text-md font-medium"
              >
                اتصل بنا
              </Link>
            </div>

            <Link
              href="/appointment"
              className="mr-4 bg-pink-600 text-white hover:bg-pink-500 px-5 py-2 rounded-lg text-md font-medium transition-colors duration-300 shadow-md hover:shadow-lg flex items-center"
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-pink-600 focus:outline-none"
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white pb-4">
          <div className="pt-2 px-4 space-y-1">
            <Link
              href="/"
              className="block text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-3 rounded-md text-base font-medium border-b border-gray-100"
              onClick={toggleMenu}
            >
              الرئيسية
            </Link>
            <Link
              href="/services"
              className="block text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-3 rounded-md text-base font-medium border-b border-gray-100"
              onClick={toggleMenu}
            >
              خدماتنا
            </Link>
            {/* <Link
              href="/specialists"
              className="block text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-3 rounded-md text-base font-medium border-b border-gray-100"
              onClick={toggleMenu}
            >
              الأخصائيون
            </Link> */}
            {/* <Link
              href="/gallery"
              className="block text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-3 rounded-md text-base font-medium border-b border-gray-100"
              onClick={toggleMenu}
            >
              معرض الصور
            </Link> */}
            <Link
              href="/about"
              className="block text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-3 rounded-md text-base font-medium border-b border-gray-100"
              onClick={toggleMenu}
            >
              من نحن
            </Link>
            <Link
              href="/contact"
              className="block text-gray-600 hover:bg-pink-50 hover:text-pink-600 px-3 py-3 rounded-md text-base font-medium border-b border-gray-100"
              onClick={toggleMenu}
            >
              اتصل بنا
            </Link>
            <div className="pt-2">
              <Link
                href="/appointment"
                className="flex justify-center items-center w-full bg-pink-600 text-white hover:bg-pink-500 px-3 py-3 rounded-md text-base font-medium transition-colors duration-300"
                onClick={toggleMenu}
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
