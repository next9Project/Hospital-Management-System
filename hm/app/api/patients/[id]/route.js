import { NextResponse } from "next/server";
import { connectDB } from '@/app/lib/db'
const Patient = require("@/app/models/Patient");

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params; // Extract the ID from the URL parameters
    
    // Validate the ID format if needed (e.g., check if it's a valid MongoDB ID)
    
    const patient = await Patient.findById(id);
    
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" }, 
      { status: 500 }
    );
  }
}