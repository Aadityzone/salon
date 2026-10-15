import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
export const runtime = "nodejs";
const defaults = [
  { name: "Hair Styling", description: "Cuts, colour, styling and treatments.", durationMinutes: 60, priceInPaise: 49900, category: "Hair", active: true },
  { name: "Skin Rituals", description: "Facials, glow rituals and skin care.", durationMinutes: 60, priceInPaise: 99900, category: "Skin", active: true },
  { name: "Makeup", description: "Soft glam, party and occasion makeup.", durationMinutes: 90, priceInPaise: 299900, category: "Makeup", active: true },
  { name: "Nail Care", description: "Manicures, pedicures and nail art.", durationMinutes: 45, priceInPaise: 49900, category: "Nails", active: true },
];
export async function GET() {
  try {
    await connectDB();
    if (await Service.countDocuments() === 0) await Service.insertMany(defaults, { ordered: false }).catch(() => undefined);
    const services = await Service.find({ active: true }).sort({ category: 1, name: 1 }).lean();
    return NextResponse.json({ services: services.map(s => ({ id: String(s._id), name: s.name, description: s.description, durationMinutes: s.durationMinutes, priceInPaise: s.priceInPaise, category: s.category })) });
  } catch { return NextResponse.json({ error: "Services are temporarily unavailable." }, { status: 503 }); }
}
