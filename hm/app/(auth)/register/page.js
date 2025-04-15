"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "patient",
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
      const response = await axios.post("/api/auth/register", formData);
      if (response.status === 201) {
        await Swal.fire({
          title: "تم التسجيل بنجاح!",
          text: "تم إنشاء حسابك بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ec4899", // Pink color to match your theme
        });
        
        // Redirect based on role
        const { role } = formData;
        if (role === "doctor") {
          router.push("/provider-dashboard");
        } else if (role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/"); // Default to home page for patient
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-pink-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Header with branded accent */}
          <div className="h-3 bg-gradient-to-r from-pink-500 to-pink-600"></div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              إنشاء حساب جديد
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  الاسم الكامل
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="محمد أحمد"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                />
              </div>

              {/* Email */}
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  كلمة المرور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                />
                <p className="text-xs text-gray-600 mt-1 text-right">
                  يجب أن تتكون من 8 أحرف على الأقل
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+966 50 123 4567"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  العنوان
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="شارع الملك فهد، الرياض"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  الدور
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-right"
                >
                  <option value="patient">مريض</option>
                  <option value="doctor">طبيب</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg mt-6"
              >
                إنشاء حساب
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <a
                  href="/login"
                  className="text-pink-600 hover:text-pink-500 font-medium"
                >
                  تسجيل الدخول
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          © 2025. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}