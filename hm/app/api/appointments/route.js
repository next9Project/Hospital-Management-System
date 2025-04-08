const { NextResponse } = require("next/server");
const connectDB = require("../lib/db");
const Appointment = require("../models/Appointment");

async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const doctorId = url.searchParams.get("doctorId");
  const appointments = await Appointment.find({ doctorId }).populate("patientId", "name");
  return NextResponse.json(appointments);
}

async function PATCH(req) {
  await connectDB();
  const { id, status } = await req.json();
  const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  return NextResponse.json(appointment);
}

module.exports = { GET, PATCH };