// app/api/profile/route.js
import dbConnect from "../../lib/db";
import User from "../../models/User";
import Patient from "../../models/Patient";
import Appointment from "../../models/Appointment";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  const tokenCookie = request.cookies.get("token");
  if (!tokenCookie) {
    return new Response(JSON.stringify({ error: "لم يتم إرسال التوكن" }), {
      status: 401,
    });
  }
  const token = tokenCookie.value;
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ error: "توكن غير صالح" }), {
      status: 401,
    });
  }

  await dbConnect();

  try {
    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "المستخدم غير موجود" }), {
        status: 404,
      });
    }

    const profileData = { user };

    if (user.role === "patient") {
      const patient = await Patient.findOne({ userId: user._id }).lean();
      const appointments = await Appointment.find({ patientId: user._id })
        .populate({ path: "doctorId", select: "name email phone" })
        .lean();
      profileData.patient = patient;
      profileData.appointments = appointments;
    } else {
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

export async function PATCH(request) {
  // قراءة التوكن من الكوكيز
  const tokenCookie = request.cookies.get("token");
  if (!tokenCookie) {
    return new Response(JSON.stringify({ error: "لم يتم إرسال التوكن" }), {
      status: 401,
    });
  }
  const token = tokenCookie.value;

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ error: "توكن غير صالح" }), {
      status: 401,
    });
  }

  await dbConnect();

  // توقع أن يتم إرسال البيانات الجديدة في جسم الطلب بتنسيق JSON
  const { name, phone, address, profileImage } = await request.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId, // استخدام المفتاح الصحيح من الـ payload (userId)
      { name, phone, address, profileImage, updatedAt: Date.now() },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "المستخدم غير موجود" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "تم تحديث البيانات", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
