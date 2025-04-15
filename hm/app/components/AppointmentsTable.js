import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function AppointmentsTable({ 
  appointments, 
  handleStatusChange, 
  openModal,
  pagination,
  onPageChange,
  onFilterChange 
}) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    date: ''
  });

  // Convert UTC date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      date: ''
    });
    onFilterChange({
      search: '',
      status: 'all',
      date: ''
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const result = await Swal.fire({
      title: 'تأكيد التغيير',
      text: 'هل أنت متأكد من تغيير حالة الموعد؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، تغيير',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await handleStatusChange(id, newStatus);
        Swal.fire({
          title: 'تم التحديث!',
          text: 'تم تغيير حالة الموعد بنجاح',
          icon: 'success',
          confirmButtonText: 'حسناً'
        });
      } catch (error) {
        Swal.fire({
          title: 'خطأ!',
          text: 'فشل في تحديث حالة الموعد',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filter Controls */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">بحث</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="ابحث باسم المريض أو السبب"
              className="w-full p-2 border rounded-md text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-right"
            >
              <option value="all">الكل</option>
              <option value="pending">قيد الانتظار</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              تطبيق الفلتر
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">اسم الطبيب</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">اسم المريض</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">التاريخ</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">الوقت</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">نوع الموعد</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">الحالة</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{appointment.doctorName || 'غير محدد'}</td>
                  <td className="py-3 px-4">{
                    appointment.patient ? 
                    (typeof appointment.patient === 'string' ? appointment.patient : 'مريض') : 
                    'غير محدد'
                  }</td>
                  <td className="py-3 px-4">{formatDate(appointment.appointmentDate || appointment.date)}</td>
                  <td className="py-3 px-4">{appointment.timeSlot || 'غير محدد'}</td>
                  <td className="py-3 px-4">{appointment.appointmentType || 'زيارة عامة'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2 items-center">
                      <button 
                        onClick={() => openModal(appointment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        عرض
                      </button>
                      <span className="text-gray-300 mx-1">|</span>
                      <select 
                        className="text-sm border rounded p-1"
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  لا توجد مواعيد لعرضها
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            عرض {appointments.length} من أصل {pagination.totalAppointments} موعد
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded-md ${pagination.currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              السابق
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md ${page === pagination.currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded-md ${pagination.currentPage === pagination.totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
  