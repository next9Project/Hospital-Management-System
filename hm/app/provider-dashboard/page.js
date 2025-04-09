// const WelcomeBanner = require("../components/WelcomeBanner");
// const PatientList = require("../components/PatientList");
// const AppointmentCalendar = require("../components/AppointmentCalendar");
// const Notifications = require("../components/Notifications");
// const { verifyToken } = require("../lib/auth");

// async function ProviderDashboard({ req }) {
//   // التحقق من المستخدم
//   const user = verifyToken(req);
//   if (!user || (user.role !== "doctor" && user.role !== "nurse")) {
//     return { redirect: { destination: "/login", permanent: false } }; // إعادة توجيه بسيطة
//   }

//   // جلب البيانات بطريقة مباشرة
//   const patients = await fetch(`http://localhost:3000/api/patients?doctorId=${user.id}`).then(res => res.json());
//   const appointments = await fetch(`http://localhost:3000/api/appointments?doctorId=${user.id}`).then(res => res.json());
//   const notifications = await fetch(`http://localhost:3000/api/notifications?userId=${user.id}`).then(res => res.json());

//   // عرض الواجهة
//   return (
//     <div className="p-4">
//       <WelcomeBanner name={user.name} role={user.role} />
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="md:col-span-2">
//           <AppointmentCalendar appointments={appointments} user={user} />
//           <PatientList patients={patients} user={user} />
//         </div>
//         <Notifications notifications={notifications} />
//       </div>
//     </div>
//   );
// }

// module.exports = ProviderDashboard;




const WelcomeBanner = require("../components/WelcomeBanner");
const PatientList = require("../components/PatientList");
const AppointmentCalendar = require("../components/AppointmentCalendar");
const Notifications = require("../components/Notifications");

import { headers } from "next/headers";


async function ProviderDashboard() {
  const headersList = headers();
  const userHeader = await headersList.get("x-user");

  // التحقق من وجود بيانات المستخدم
  if (!userHeader) {
    throw new Error("المستخدم غير مصرح له، يرجى تسجيل الدخول");
  }

  const user = JSON.parse(userHeader);

  // جلب البيانات
  const patients = await fetch(`http://localhost:3000/api/patients?doctorId=${user.id}`).then(res => res.json());
  const appointments = await fetch(`http://localhost:3000/api/appointments?doctorId=${user.id}`).then(res => res.json());
  const notifications = await fetch(`http://localhost:3000/api/notifications?userId=${user.id}`).then(res => res.json());

  return (
    <div className="p-4">
      <WelcomeBanner name={user.name} role={user.role} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <AppointmentCalendar appointments={appointments} user={user} />
          <PatientList patients={patients} user={user} />
        </div>
        <Notifications notifications={notifications} />
      </div>
    </div>
  );
}

module.exports = ProviderDashboard;