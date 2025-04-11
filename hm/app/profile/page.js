"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  // حالة تخزين البيانات في النموذج للتعديل
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    axios
      .get("/api/profile", { withCredentials: true })
      .then((response) => {
        setProfile(response.data);
        const user = response.data.user;
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          profileImage: user.profileImage || "",
        }));
      })
      .catch((err) => {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message
        );
        setError(err.response?.data.error || "حدث خطأ أثناء جلب البيانات");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.patch("/api/profile", formData, {
        withCredentials: true,
      });
      setMessage(res.data.message || "تم تحديث البيانات بنجاح");
      // تحديث بيانات المستخدم في الحالة بناءً على البيانات الجديدة
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, ...formData },
      }));
      setEditing(false);
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response?.data || err.message
      );
      setError(err.response?.data.error || "حدث خطأ أثناء تحديث البيانات");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 m-4 bg-pink-50 border border-pink-200 rounded-lg shadow text-right">
        <div className="text-pink-600 font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          خطأ: {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-lg">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden text-right">
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6">
        <div className="flex flex-col items-center mb-4">
          {/* Profile Image at the top */}
          <div className="mb-4">
            {profile.user.profileImage ? (
              <img
                src={profile.user.profileImage}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-pink-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">{profile.user.name}</h1>
          <p className="text-pink-100 mt-1">{profile.user.email}</p>
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={() => setEditing(!editing)}
            className="bg-white text-pink-600 font-medium py-2 px-6 rounded shadow hover:bg-gray-50 transition-colors"
          >
            {editing ? "إلغاء التعديل" : "تعديل الملف الشخصي"}
          </button>
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        {message && (
          <div className="mb-4 p-3 bg-pink-50 text-pink-600 rounded-md border border-pink-200">
            {message}
          </div>
        )}

        {!editing ? (
          <>
            {/* عرض بيانات الحساب */}
            <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 ml-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  معلومات الحساب
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <p className="text-gray-600 text-sm mb-1">الاسم</p>
                  <p className="font-medium text-gray-800">
                    {profile.user.name}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <p className="text-gray-600 text-sm mb-1">
                    البريد الإلكتروني
                  </p>
                  <p className="font-medium text-gray-800">
                    {profile.user.email}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <p className="text-gray-600 text-sm mb-1">الهاتف</p>
                  <p className="font-medium text-gray-800">
                    {profile.user.phone || "غير محدد"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <p className="text-gray-600 text-sm mb-1">العنوان</p>
                  <p className="font-medium text-gray-800">
                    {profile.user.address || "غير محدد"}
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          // نموذج تعديل بيانات الحساب
          <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-gray-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-2 border-pink-500"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center border-2 border-pink-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-pink-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-pink-600 text-white rounded-full p-2 cursor-pointer hover:bg-pink-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">العنوان</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-500 text-white py-2 px-6 rounded transition-colors w-full"
              >
                تحديث البيانات
              </button>
            </form>
          </section>
        )}

        {/* عرض المواعيد (للمستخدم من نوع patient) */}
        {profile.user.role === "patient" && (
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 ml-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">المواعيد</h2>
            </div>
            {profile.appointments && profile.appointments.length > 0 ? (
              <div className="space-y-4">
                {profile.appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="border border-gray-200 p-4 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-pink-50 text-pink-600"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                      <p className="text-gray-600 text-sm">
                        {new Date(appointment.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="mb-1">
                        <span className="font-medium text-gray-800 ml-1">
                          الطبيب:
                        </span>
                        <span>
                          {appointment.doctorId
                            ? appointment.doctorId.name
                            : "غير محدد"}
                        </span>
                      </p>
                      {appointment.notes && (
                        <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium ml-1">ملاحظات:</span>
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-100">
                <p className="text-gray-600">ليس لديك مواعيد مسجلة.</p>
                <button className="mt-4 bg-pink-600 hover:bg-pink-500 text-white font-medium py-2 px-6 rounded-md transition-colors">
                  حجز موعد جديد
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
