"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          title: "خطأ في تسجيل الدخول",
          text: data.error || "بيانات الاعتماد غير صحيحة",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ec4899",
        });
        setError(data.error);
      } else {
        await Swal.fire({
          title: "تم تسجيل الدخول بنجاح!",
          text: `مرحباً بعودتك ${data.user.name}`,
          icon: "success",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ec4899",
          timer: 2000,
          timerProgressBar: true,
        });

        // Redirect based on role
        const { role } = data.user;
        if (role === "doctor") {
          router.push("/provider-dashboard");
        } else if (role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/"); // Default to home page for patient
        }
      }
    } catch (err) {
      await Swal.fire({
        title: "خطأ",
        text: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#ec4899",
      });
      setError("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Replace with your actual Google login implementation
      console.log("Google login clicked");
      await Swal.fire({
        title: "جارٍ التوجيه",
        text: "سيتم توجيهك إلى صفحة تسجيل الدخول عبر جوجل",
        icon: "info",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#ec4899",
      });
      // Add your Google OAuth redirect logic here
    } catch (error) {
      await Swal.fire({
        title: "خطأ",
        text: "فشل في تسجيل الدخول عبر جوجل",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#ec4899",
      });
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Header with branded accent */}
          <div className="h-3 bg-gradient-to-r from-pink-500 to-pink-600"></div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              مرحباً بعودتك
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-600"
                  >
                    كلمة المرور
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                تسجيل الدخول
              </button>
            </form>

            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-600">
                    أو سجل الدخول باستخدام
                  </span>
                </div>
              </div>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-800 transition shadow-sm"
              >
                <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24">
                  <path
                    d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z"
                    fill="#4285F4"
                  />
                </svg>
                تسجيل الدخول عبر جوجل
              </button>
            </div>
          </div>

          <div className="text-center bg-gray-50 p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟
              <a
                href="/register"
                className="mr-1 text-pink-600 hover:text-pink-500 font-medium"
              >
                إنشاء حساب جديد
              </a>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          © 2025 جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}