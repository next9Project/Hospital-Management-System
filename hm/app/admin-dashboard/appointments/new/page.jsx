"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewAppointmentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    doctor: "",
    patient: "",
    date: "",
    time: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await fetch("/api/doctors");
        const patientRes = await fetch("/api/tests/new");
        const doctorsData = await doctorRes.json();
        const patientsData = await patientRes.json();

        setDoctors(doctorsData);
        setPatients(patientsData);
      } catch (err) {
        console.error("❌ فشل في جلب البيانات:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("✅ تم إضافة الموعد بنجاح");
        router.push("/admin-dashboard/appointments");
      } else {
        const err = await res.json();
        alert("❌ فشل في إضافة الموعد: " + (err.error || "خطأ غير معروف"));
      }
    } catch (err) {
      alert("❌ فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          إضافة موعد جديد
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          {/* اختيار المريض */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">
              اسم المريض
            </label>
            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              className="w-full border-gray-200 rounded-lg p-2 bg-pink-50 focus:ring-pink-500 focus:border-pink-500  text-black"
              required
            >
              <option value="">اختر مريض</option>
              {patients.map((p) => (
                <option className="text-gray-800" key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* اختيار الطبيب */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">
              اسم الطبيب
            </label>
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              className="w-full border-gray-200 rounded-lg p-2 bg-pink-50 focus:ring-pink-500 focus:border-pink-500  text-black"
              required
            >
              <option value="">اختر طبيب</option>
              {doctors.map((d) => (
                <option className="text-gray-800" key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* التاريخ والوقت */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                التاريخ
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-lg p-2 bg-pink-50 focus:ring-pink-500 focus:border-pink-500  text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">
                الوقت
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-lg p-2 bg-pink-50 focus:ring-pink-500 focus:border-pink-500  text-black"
                required
              />
            </div>
          </div>

          {/* سبب الزيارة */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">
              سبب الموعد
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full border-gray-200 rounded-lg p-2 bg-pink-50 focus:ring-pink-500 focus:border-pink-500  text-black"
              rows="3"
              placeholder="سبب الزيارة"
            ></textarea>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
            >
              {loading ? "...جاري الإضافة" : "إضافة الموعد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}