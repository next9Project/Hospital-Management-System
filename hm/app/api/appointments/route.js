const { NextResponse } = require("next/server");
import { connectDB } from '../../lib/db'
 const Appointment = require("../../models/Appointment");


// PATCH: تغيير حالة موعد
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
      { new: true } // إرجاع الموعد المحدث
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



export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // استخراج معلمات الاستعلام
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const date = searchParams.get("date") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 6;

    // بناء شروط الاستعلام
    const query = {};

    // تصفية حسب البحث (الاسم أو السبب)
    if (search) {
      query.$or = [
        { "patient.name": { $regex: search, $options: "i" } }, // البحث في اسم المريض (غير حساس لحالة الأحرف)
        { reason: { $regex: search, $options: "i" } },         // البحث في السبب
      ];
    }

    // تصفية حسب الحالة
    if (status !== "all") {
      query.status = status;
    }

    // تصفية حسب التاريخ
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // حساب الترقيم
    const skip = (page - 1) * limit;
    const totalAppointments = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(totalAppointments / limit);

    // جلب المواعيد مع التصفية والترقيم
    const appointments = await Appointment.find(query)
      .populate({ path: "patient", select: "name", strictPopulate: false })
      .populate({ path: "doctor", select: "name", strictPopulate: false })
      .skip(skip)
      .limit(limit);

    // إرجاع البيانات مع معلومات الترقيم
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

