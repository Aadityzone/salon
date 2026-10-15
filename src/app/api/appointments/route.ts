import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { Appointment, SlotReservation } from "@/models/Appointment";
export const runtime = "nodejs";
const BookingInput = z.object({
  serviceId: z.string().refine(mongoose.isValidObjectId, "Invalid service."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^(?:1[0-8]|10|11|12|13|14|15|16|17|18):(?:00|15|30|45)$/),
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(7).max(25),
  customerEmail: z.string().trim().email().max(254).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional(),
});
const TZ = "+05:30";
function atIST(date: string, time: string) { return new Date(date + "T" + time + ":00" + TZ); }
export async function POST(request: NextRequest) {
  const parsed = BookingInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  const input = parsed.data;
  try {
    await connectDB();
    // Ensure the unique staff/slot index exists before accepting any bookings.
    await SlotReservation.createIndexes();
    const service = await Service.findOne({ _id: input.serviceId, active: true });
    if (!service) return NextResponse.json({ error: "That service is no longer available." }, { status: 404 });
    const startsAt = atIST(input.date, input.time);
    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);
    const open = atIST(input.date, "10:00");
    const close = atIST(input.date, "19:00");
    if (startsAt < open || endsAt > close || startsAt <= new Date()) return NextResponse.json({ error: "Choose a future time within salon opening hours (10 AM–7 PM)." }, { status: 400 });
    const appointment = await Appointment.create({
      customerName: input.customerName, customerPhone: input.customerPhone, customerEmail: input.customerEmail ?? "",
      notes: input.notes ?? "", serviceId: service._id, serviceName: service.name, durationMinutes: service.durationMinutes,
      priceInPaise: service.priceInPaise, startsAt, endsAt, status: "confirmed",
    });
    const slotCount = Math.ceil(service.durationMinutes / 15);
    const staffIds = ["team-1", "team-2"];
    for (const staffId of staffIds) {
      const reservations = Array.from({ length: slotCount }, (_, index) => ({
        staffId, slotStart: new Date(startsAt.getTime() + index * 15 * 60_000), appointmentId: appointment._id,
      }));
      try {
        await SlotReservation.insertMany(reservations, { ordered: true });
        await Appointment.updateOne({ _id: appointment._id }, { $set: { staffId } });
        return NextResponse.json({ appointment: { id: String(appointment._id), serviceName: service.name, date: input.date, time: input.time, status: "confirmed", priceInPaise: service.priceInPaise }, message: "Your appointment is confirmed." }, { status: 201 });
      } catch {
        await SlotReservation.deleteMany({ appointmentId: appointment._id });
      }
    }
    await Appointment.deleteOne({ _id: appointment._id });
    return NextResponse.json({ error: "That time was just booked. Please choose another available slot." }, { status: 409 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) return NextResponse.json({ error: "Please check your booking details." }, { status: 400 });
    return NextResponse.json({ error: "We could not save your appointment. Please try again." }, { status: 503 });
  }
}
