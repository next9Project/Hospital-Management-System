// "use client";
// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";

// export default function AppointmentPage() {
//   const [formData, setFormData] = useState({
//     date: "",
//     time: "",
//     doctorId: "",
//     notes: "",
//   });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [doctors, setDoctors] = useState([]);

//   // Fetch doctors for dropdown (unchanged)
//   useEffect(() => {

//     const fetchDoctors = async () => {
//       try {
//         const res = await fetch("/api/doctors"); // Assume an API exists
//         const data = await res.json();
//         console.log(data)
//         setDoctors(data);
//       } catch {
//         setMessage("فشل تحميل قائمة الأطباء");
//       }
//     };
    
//     fetchDoctors();
//   }, []);

//   useEffect(() => {
//     if (message) {
//       Swal.fire({
//         icon: message.includes("نجاح") ? "success" : "error",
//         text: message,
//         confirmButtonText: "حسنًا",
//         customClass: {
//           popup: "swal-rtl",
//         },
//         didOpen: () => {
//           const swalPopup = document.querySelector(".swal-rtl");
//           if (swalPopup) swalPopup.dir = "rtl";
//         },
//       });
//     }
//   }, [message]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     // Validate date (ensure it's not in the past)
//     const selectedDate = new Date(formData.date);
//     if (selectedDate < new Date()) {
//       setMessage("يرجى اختيار تاريخ مستقبلي");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (res.ok) {
//         setMessage("تم الحجز بنجاح");
//         setFormData({ date: "", time: "", doctorId: "", notes: "" });
//       } else {
//         setMessage(data.error || "حدث خطأ أثناء الحجز");
//       }
//     } catch (error) {
//       setLoading(false);
//       setMessage("حدث خطأ أثناء الاتصال بالخادم");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4 text-center">📅 حجز موعد</h1>
//       <form onSubmit={handleSubmit} className="bg-white text-black p-4 rounded shadow space-y-4">
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           min={new Date().toISOString().split("T")[0]}
//           required
//         />
//         <input
//           type="time"
//           name="time"
//           value={formData.time}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <select
//           name="doctorId"
//           value={formData.doctorId}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         >
//           <option value="">اختر طبيبًا</option>
//           {doctors.map((doctor) => (
//             <option key={doctor._id} value={doctor._id}>
//               {doctor.name}
//             </option>
//           ))}
//         </select>
//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           placeholder="ملاحظات (اختياري)"
//         />
//         <button
//           type="submit"
//           className="bg-pink-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
//           disabled={loading}
//         >
//           {loading ? "جارٍ الحجز..." : "حجز الموعد"}
//         </button>
//       </form>
//       {message && <p className="text-center text-pink-600 mt-4">{message}</p>}
//     </div>
//   );
// }



'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import AppointmentList from '@/app/components/AppointmentLists';
import AppointmentForm from '@/app/components/forms/AppointmentForm';
import { toast } from 'react-toastify';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/appointments');
      setAppointments(data.data);
    } catch (error) {
      toast.error('فشل في جلب المواعيد');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreate = () => {
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedAppointment) {
        await axios.put(`/api/appointments/${selectedAppointment._id}`, formData);
        toast.success('تم تحديث الموعد بنجاح');
      } else {
        console.log('إنشاء موعد بالبيانات:', formData);
        const response = await axios.post('/api/appointments', formData);
        console.log('الاستجابة:', response);
        toast.success('تم إنشاء الموعد بنجاح');
      }
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('خطأ كامل:', error);
      console.error('استجابة الخطأ:', error.response);
      toast.error(error.response?.data?.error || 'حدث خطأ ما');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/appointments/status/${id}`, { status });
      toast.success('تم تحديث الحالة بنجاح');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل في تحديث الحالة');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      toast.success('تم حذف الموعد بنجاح');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل في حذف الموعد');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-pink-50" dir="rtl">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">المواعيد</h1>
        <button
          onClick={handleCreate}
          className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-md transition duration-300 shadow-sm"
        >
          إضافة موعد جديد
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-pink p-6 rounded-lg shadow-md border border-gray-200">
          <AppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* <AppointmentList
          appointments={appointments}
          loading={loading}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        /> */}
      </div>
    </div>
  );
}