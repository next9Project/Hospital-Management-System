import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from '../../lib/db';
const Prescription = require("../../models/Prescription");


export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { patientId, doctorId, medication, dosage } = body;

    // تحقق من أن الـ IDs صالحة
    if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json(
        { error: "patientId أو doctorId غير صالح" },
        { status: 400 }
      );
    }

    const prescription = new Prescription({
      patientId: new mongoose.Types.ObjectId(patientId),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      medication,
      dosage,
    });

    await prescription.save();
    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error("Error adding prescription:", error);
    return NextResponse.json({ error: "Failed to add prescription" }, { status: 500 });
  }
}





export async function GET() {
  try {
    await connectDB();
    const prescriptions = await Prescription.find()
      .populate("patientId", "name phone") // لجلب اسم المريض
      .populate("doctorId", "name email"); // لجلب اسم الطبيب

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}