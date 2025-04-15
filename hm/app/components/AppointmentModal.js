export default function AppointmentModal({ appointment, onClose, handleStatusChange }) {
    if (!appointment) return null;
  
    // Format date for display
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
  
    const getStatusText = (status) => {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'pending': return 'قيد الانتظار';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" dir="rtl">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">تفاصيل الموعد</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">اسم الطبيب</p>
                <p className="mt-1">{appointment.doctorName || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">التاريخ والوقت</p>
                <p className="mt-1">{formatDate(appointment.appointmentDate || appointment.date)}</p>
                {appointment.timeSlot && (
                  <p className="mt-1">{appointment.timeSlot}</p>
                )}
              </div>
              
              {appointment.appointmentType && (
                <div>
                  <p className="text-sm font-medium text-gray-500">نوع الموعد</p>
                  <p className="mt-1">{appointment.appointmentType}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">الحالة</p>
                <div className="mt-1 flex items-center space-x-2">
                  <select 
                    className="border rounded p-2 w-full"
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
              
              {appointment.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-500">سبب الزيارة</p>
                  <p className="mt-1">{appointment.reason}</p>
                </div>
              )}
              
              {appointment.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">ملاحظات</p>
                  <p className="mt-1">{appointment.notes}</p>
                </div>
              )}
              
              {appointment.amount && (
                <div>
                  <p className="text-sm font-medium text-gray-500">التكلفة</p>
                  <p className="mt-1">{appointment.amount} {appointment.currency || ''}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }