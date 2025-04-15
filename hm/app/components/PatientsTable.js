import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useState } from 'react';

const MySwal = withReactContent(Swal);

export default function PatientsTable({ patients }) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 🩺 Show prescription form
  const showPrescriptionForm = async (patientId) => {
    // 🔐 استعلام للحصول على doctorId من الـ token
    const doctorRes = await fetch('/api/auth/me');
    const doctorData = await doctorRes.json();
  
    if (!doctorRes.ok) {
      return Swal.fire({
        icon: 'error',
        title: 'غير مصرح',
        text: 'الرجاء تسجيل الدخول كطبيب لإضافة وصفة',
      });
    }
  
    const doctorId = doctorData.userId;
  
    MySwal.fire({
      title: 'إضافة وصفة طبية',
      html: `
        <input type="text" id="medication" class="swal2-input" placeholder="الدواء">
        <input type="text" id="dosage" class="swal2-input" placeholder="الجرعة">
      `,
      confirmButtonText: 'إرسال',
      showCancelButton: true,
      cancelButtonText: 'إلغاء',
      focusConfirm: false,
      preConfirm: async () => {
        const medication = document.getElementById('medication').value;
        const dosage = document.getElementById('dosage').value;
  
        if (!medication || !dosage) {
          Swal.showValidationMessage('جميع الحقول مطلوبة');
          return false;
        }
  
        try {
          const res = await fetch('http://localhost:3000/api/prescriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId,
              doctorId,
              medication,
              dosage,
            }),
          });
  
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'فشل في الإرسال');
  
          return data;
        } catch (error) {
          Swal.showValidationMessage(`خطأ: ${error.message}`);
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'تم إرسال الوصفة بنجاح',
          text: `تمت إضافة وصفة للمريض`,
        });
      }
    });
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">الاسم</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">العمر</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">الجنس</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">رقم الهاتف</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">الحالة</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">تاريخ التسجيل</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.name}</td>
                  <td className="py-3 px-4">{patient.age}</td>
                  <td className="py-3 px-4">{patient.gender}</td>
                  <td className="py-3 px-4">{patient.phone}</td>
                  <td className="py-3 px-4">{patient.condition || 'غير محدد'}</td>
                  <td className="py-3 px-4">{formatDate(patient.createdAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => showPrescriptionForm(patient._id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        إضافة وصفة
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  لا يوجد مرضى لعرضهم
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
