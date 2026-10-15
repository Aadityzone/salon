import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { isOwnerAuthenticated } from "@/lib/owner-auth";
import { Appointment, SlotReservation } from "@/models/Appointment";
export const runtime = "nodejs";
export async function GET() {
  if (!await isOwnerAuthenticated()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    await connectDB();
    const appointments = await Appointment.find().sort({ startsAt: 1 }).limit(300).lean();
    return NextResponse.json({ appointments: appointments.map(a => ({ id: String(a._id), customerName: a.customerName, customerPhone: a.customerPhone, customerEmail: a.customerEmail, notes: a.notes, serviceName: a.serviceName, durationMinutes: a.durationMinutes, priceInPaise: a.priceInPaise, staffId: a.staffId, startsAt: a.startsAt, endsAt: a.endsAt, status: a.status })) });
  } catch { return NextResponse.json({ error: "Could not load appointments." }, { status: 503 }); }
}
const StatusInput = z.object({ status: z.enum(["cancelled", "completed"]) });
export async function PATCH(request: NextRequest) {
  if (!await isOwnerAuthenticated()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid appointment." }, { status: 400 });
  const parsed = StatusInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  try {
    await connectDB();
    const appointment = await Appointment.findByIdAndUpdate(id, { $set: { status: parsed.data.status } }, { new: true });
    if (!appointment) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    if (parsed.data.status === "cancelled") await SlotReservation.deleteMany({ appointmentId: appointment._id });
    return NextResponse.json({ ok: true, id, status: appointment.status });
  } catch { return NextResponse.json({ error: "Could not update appointment." }, { status: 503 }); }
}
