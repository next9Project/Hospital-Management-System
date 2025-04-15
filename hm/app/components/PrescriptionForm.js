// "use client";
// import { useState } from "react";

// export default function PrescriptionForm({ patientId, doctorId }) {
//   const [form, setForm] = useState({
//     medication: "",
//     dosage: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!patientId || !doctorId) {
//       console.error("بيانات المريض أو الطبيب ناقصة:", { patientId, doctorId });
//       alert("خطأ: بيانات المريض أو الطبيب ناقصة");
//       return;
//     }
//     const payload = {
//       patientId,
//       doctorId,
//       medication: form.medication,
//       dosage: form.dosage,
//     };
//     console.log("إرسال البيانات:", payload);
//     const res = await fetch("/api/prescriptions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (res.ok) {
//       alert("تمت إضافة الوصفة الطبية بنجاح!");
//       setForm({ medication: "", dosage: "" });
//     } else {
//       const errorData = await res.json();
//       console.error("خطأ في الاستجابة:", errorData);
//       alert(`فشل إضافة الوصفة: ${errorData.error || "خطأ غير معروف"}`);
//     }
//   };

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6" dir="rtl">
//       <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">إضافة وصفة طبية</h3>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-1 text-right">
//             الدواء
//           </label>
//           <input
//             id="medication"
//             type="text"
//             placeholder="أدخل اسم الدواء"
//             value={form.medication}
//             onChange={(e) => setForm({ ...form, medication: e.target.value })}
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1 text-right">
//             الجرعة
//           </label>
//           <input
//             id="dosage"
//             type="text"
//             placeholder="أدخل تعليمات الجرعة"
//             value={form.dosage}
//             onChange={(e) => setForm({ ...form, dosage: e.target.value })}
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//         >
//           إضافة الوصفة
//         </button>
//       </form>
//     </div>
//   );
// }

// app/components/PrescriptionForm.jsx
"use client";
import { useState } from "react";

export default function PrescriptionForm({ patients, doctorId, onSuccess }) {
  const [form, setForm] = useState({
    patientId: "",
    medication: "",
    dosage: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !doctorId) {
      alert("خطأ: يجب اختيار مريض وتوفير بيانات الطبيب");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        patientId: form.patientId,
        doctorId,
        medication: form.medication,
        dosage: form.dosage,
      };
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("تمت إضافة الوصفة الطبية بنجاح!");
        setForm({ patientId: "", medication: "", dosage: "" });
        if (onSuccess) onSuccess();
      } else {
        const errorData = await res.json();
        alert(`فشل إضافة الوصفة: ${errorData.error || "خطأ غير معروف"}`);
      }
    } catch (error) {
      console.error("خطأ في إضافة الوصفة:", error);
      alert("فشل إضافة الوصفة: خطأ في الاتصال");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6" dir="rtl">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">إضافة وصفة طبية</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1 text-right">
            المريض
          </label>
          <select
            id="patientId"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
            required
            disabled={submitting}
          >
            <option value="">اختر مريضًا</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-1 text-right">
            الدواء
          </label>
          <input
            id="medication"
            type="text"
            placeholder="أدخل اسم الدواء"
            value={form.medication}
            onChange={(e) => setForm({ ...form, medication: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1 text-right">
            الجرعة
          </label>
          <input
            id="dosage"
            type="text"
            placeholder="أدخل تعليمات الجرعة"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
            required
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
          disabled={submitting}
        >
          {submitting ? "جارٍ الإضافة..." : "إضافة الوصفة"}
        </button>
      </form>
    </div>
  );
}