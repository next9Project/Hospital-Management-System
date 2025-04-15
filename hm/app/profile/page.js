"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: ""
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          profileImage: data.user.profileImage || ""
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setMessage("❌ فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setEditing(false);
        setMessage("✅ تم تحديث البيانات بنجاح");
      } else {
        setMessage(`❌ فشل التحديث: ${data.message || "حدث خطأ ما"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ فشل التحديث: خطأ في الاتصال");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 dir-rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">الملف الشخصي</h1>

      {message && (
        <div className={`mb-6 p-3 rounded-lg text-center ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-4">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-200 flex items-center justify-center bg-gray-100">
                <img
                  src={formData.profileImage || "/default-avatar.png"}
                  alt="الصورة الشخصية"
                  className="w-full h-full object-cover"
                />
              </div>
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full cursor-pointer transition-all duration-200 shadow-md">
                <Camera size={20} />
              </label>
              <input 
                id="profile-upload"
                type="file" 
                name="profileImage" 
                accept="image/*" 
                onChange={handleChange} 
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">انقر على أيقونة الكاميرا لتغيير الصورة</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">الاسم</label>
              <input
                type="text"
                name="name"
                placeholder="أدخل الاسم الكامل"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 font-medium">رقم الهاتف</label>
              <input
                type="text"
                name="phone"
                placeholder="أدخل رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 font-medium">العنوان</label>
              <input
                type="text"
                name="address"
                placeholder="أدخل العنوان"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <button 
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md"
            >
              حفظ التعديلات
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-200 mb-4">
              <img
                src={user.profileImage || "/default-avatar.png"}
                alt="الصورة الشخصية"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name || "المستخدم"}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-pink-100 p-2 rounded-full mr-3">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-medium">{user.phone || "غير محدد"}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-pink-100 p-2 rounded-full mr-3">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">العنوان</p>
                <p className="font-medium">{user.address || "غير محدد"}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md flex items-center"
              onClick={() => setEditing(true)}
            >
              <span className="mr-2">✏️</span> تعديل البيانات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}