// app/api/profile/route.js
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Patient from "../../../models/Patient";
import Appointment from "../../../models/Appointment";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  // الحصول على الهيدر Authorization
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "لم يتم إرسال التوكن" }), {
      status: 401,
    });
  }

  // توقع أن يكون شكل الهيدر: Bearer <token>
  const token = authHeader.split(" ")[1];
  if (!token) {
    return new Response(JSON.stringify({ error: "التوكن غير موجود" }), {
      status: 401,
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ error: "توكن غير صالح" }), {
      status: 401,
    });
  }

  // الاتصال بقاعدة البيانات
  await dbConnect();

  try {
    // جلب بيانات المستخدم باستخدام decoded.id
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "المستخدم غير موجود" }), {
        status: 404,
      });
    }

    const profileData = { user };

    // إذا كان المستخدم مريض، نقوم بجلب بيانات المريض والمواعيد
    if (user.role === "patient") {
      const patient = await Patient.findOne({ userId: user._id }).lean();
      const appointments = await Appointment.find({ patientId: user._id })
        .populate({ path: "doctorId", select: "name email phone" })
        .lean();
      profileData.patient = patient;
      profileData.appointments = appointments;
    } else {
      // في حال كان الدور ليس مريض – يمكن تعديل الرد أو إضافة حالات أخرى
      profileData.appointments = [];
    }

    return new Response(JSON.stringify(profileData), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
