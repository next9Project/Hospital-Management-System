'use client';
import { useEffect, useState } from 'react';

export default function PrescriptionsTable() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch('/api/prescriptions');
        const data = await res.json();
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-right">الوصفات الطبية</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-right">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">اسم المريض</th>
              <th className="py-3 px-4">اسم الطبيب</th>
              <th className="py-3 px-4">الدواء</th>
              <th className="py-3 px-4">الجرعة</th>
              <th className="py-3 px-4">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <tr key={prescription._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{prescription.patientId?.name || '—'}</td>
                  <td className="py-3 px-4">{prescription.doctorId?.name || '—'}</td>
                  <td className="py-3 px-4">{prescription.medication}</td>
                  <td className="py-3 px-4">{prescription.dosage}</td>
                  <td className="py-3 px-4">{formatDate(prescription.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  لا توجد وصفات طبية حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
