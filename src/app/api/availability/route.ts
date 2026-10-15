import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { SlotReservation } from "@/models/Appointment";
export const runtime = "nodejs";
const TZ = "+05:30";
function atIST(date: string, time: string) { return new Date(date + "T" + time + ":00" + TZ); }
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  const serviceId = request.nextUrl.searchParams.get("serviceId") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !mongoose.isValidObjectId(serviceId)) return NextResponse.json({ error: "Choose a valid date and service." }, { status: 400 });
  try {
    await connectDB();
    const service = await Service.findOne({ _id: serviceId, active: true }).lean();
    if (!service) return NextResponse.json({ error: "That service is unavailable." }, { status: 404 });
    const staffIds = ["team-1", "team-2"];
    const durationSlots = Math.ceil(service.durationMinutes / 15);
    const dayStart = atIST(date, "00:00");
    const dayEnd = atIST(date, "23:59");
    const reserved = await SlotReservation.find({ staffId: { $in: staffIds }, slotStart: { $gte: dayStart, $lte: dayEnd } }).select("staffId slotStart").lean();
    const occupied = new Set(reserved.map(r => r.staffId + "|" + new Date(r.slotStart).toISOString()));
    const slots: { time: string; available: boolean }[] = [];
    const now = Date.now();
    for (let minute = 10 * 60; minute + service.durationMinutes <= 19 * 60; minute += 15) {
      const hh = String(Math.floor(minute / 60)).padStart(2, "0");
      const mm = String(minute % 60).padStart(2, "0");
      const time = hh + ":" + mm;
      const start = atIST(date, time);
      if (start.getTime() <= now) continue;
      let available = false;
      for (const staffId of staffIds) {
        let free = true;
        for (let i = 0; i < durationSlots; i++) {
          const slot = new Date(start.getTime() + i * 15 * 60_000).toISOString();
          if (occupied.has(staffId + "|" + slot)) { free = false; break; }
        }
        if (free) { available = true; break; }
      }
      slots.push({ time, available });
    }
    return NextResponse.json({ date, service: { id: String(service._id), durationMinutes: service.durationMinutes }, slots });
  } catch { return NextResponse.json({ error: "Could not check availability right now." }, { status: 503 }); }
}
