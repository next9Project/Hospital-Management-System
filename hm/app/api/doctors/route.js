import { connectDB } from '../../lib/db'
import Doc from '../../models/Doc'

export async function GET() {
  try {
    await connectDB()
    const doctors = await Doc.find().sort({ createdAt: -1 })
    return Response.json(doctors)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const doctor = await Doc.create(body)
    return Response.json({ success: true, doctor })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
