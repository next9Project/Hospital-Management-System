import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Appointment from "@/app/models/Appointment";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Doctor from "@/app/models/Doctor";
import { cookies } from "next/headers";


// دالة PATCH لتحديث حالة الموعد
export async function PATCH(request) {
  try {
    await connectDB();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

// دالة GET لجلب المواعيد
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const date = searchParams.get("date") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 6;

    const query = {};

    if (search) {
      query.$or = [
        { "patient.name": { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== "all") {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const skip = (page - 1) * limit;
    const totalAppointments = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(totalAppointments / limit);

    const appointments = await Appointment.find(query)
      .populate({ path: "patient", select: "name", strictPopulate: false })
      .populate({ path: "doctor", select: "name", strictPopulate: false })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      appointments,
      pagination: {
        currentPage: page,
        totalPages,
        totalAppointments,
        appointmentsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}



// دالة POST لإنشاء موعد جديد
// export async function POST(request) {
//   try {
//     const token = request.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { date, time, doctorId, notes } = await request.json();

//     if (!date || !time) {
//       return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
//     }

//     await connectDB();

//     const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
//     if (doctorId && !isValidObjectId(doctorId)) {
//       return NextResponse.json({ error: "Invalid doctorId" }, { status: 400 });
//     }

//     // Use decoded.userId as patientId
//     const patientId = decoded.userId;

//     // Optional: Check for overlapping appointments
//     const appointmentDateTime = new Date(`${date}T${time}`);
//     const existingAppointment = await Appointment.findOne({
//       doctorId,
//       date: { $eq: appointmentDateTime },
//     });

//     if (existingAppointment) {
//       return NextResponse.json({ error: "Doctor is already booked at this time" }, { status: 409 });
//     }

//     const appointment = new Appointment({
//       userId: decoded.userId,
//       patientId, // Automatically set from JWT
//       doctorId: doctorId || null,
//       date: appointmentDateTime,
//       notes,
//       status: "pending",
//     });

//     await appointment.save();

//     return NextResponse.json({ message: "تم الحجز بنجاح", appointment }, { status: 201 });
//   } catch (error) {
//     console.error("Error during appointment creation:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }







export async function POST(request) {
  try {
    await connectDB();
    
    // 1. التحقق من اتصال قاعدة البيانات
    if (mongoose.connection.readyState !== 1) {
      throw new Error("لا يوجد اتصال بقاعدة البيانات");
    }

    const body = await request.json();
    console.log("بيانات الواردة:", body);

    // 2. التحقق من التوكن
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;    

    if (!token) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    // 3. فك تشفير التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "patient") {
      return NextResponse.json(
        { success: false, error: "فقط المرضى يمكنهم حجز المواعيد" },
        { status: 403 }
      );
    }

    // 4. التحقق من الحقول المطلوبة
    const requiredFields = ['doctorName', 'appointmentDate', 'day', 'timeSlot', 'reason'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `الحقول المطلوبة ناقصة: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // 5. تحويل التاريخ إلى كائن Date
    const appointmentDate = new Date(body.appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "تنسيق التاريخ غير صحيح" },
        { status: 400 }
      );
    }

    // 6. التحقق من عدم وجود موعد متكرر
    const existingAppointment = await Appointment.findOne({
      doctorName: body.doctorName,
      appointmentDate,
      timeSlot: body.timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: "هذا الموعد محجوز مسبقاً" },
        { status: 400 }
      );
    }

    

    // 7. إنشاء الموعد
    const appointment = await Appointment.create({
      doctorName: body.doctorName,
      appointmentDate,
      day: body.day,
      timeSlot: body.timeSlot,
      appointmentType: body.appointmentType,
      reason: body.reason,
      amount: body.amount || 15,
      currency: body.currency || 'JOD',
      patient: decoded.userId,
      patientName: decoded.name,
      status: 'pending'
    });

    // 8. تحديث حقل الطبيب إذا كان موجوداً
    try {
      const doctor = await Doctor.findOne({ name: body.doctorName });
      if (doctor) {
        appointment.doctor = doctor._id;
        await appointment.save();
      }
    } catch (doctorError) {
      console.error("خطأ في تحديث بيانات الطبيب:", doctorError);
    }

    return NextResponse.json(
      {
        success: true,
        data: appointment,
        message: "تم حجز الموعد بنجاح"
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("تفاصيل الخطأ في الخادم:", {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ غير متوقع في الخادم",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}


