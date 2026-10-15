import "dotenv/config";
import mongoose from "mongoose";
import Service from "../src/models/Service";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI before running npm run seed.");
  await mongoose.connect(uri);
  const services = [
    { name: "Hair Styling", description: "Cuts, colour, styling and treatments.", durationMinutes: 60, priceInPaise: 49900, category: "Hair", active: true },
    { name: "Skin Rituals", description: "Facials, glow rituals and skin care.", durationMinutes: 60, priceInPaise: 99900, category: "Skin", active: true },
    { name: "Makeup", description: "Soft glam, party and occasion makeup.", durationMinutes: 90, priceInPaise: 299900, category: "Makeup", active: true },
    { name: "Nail Care", description: "Manicures, pedicures and nail art.", durationMinutes: 45, priceInPaise: 49900, category: "Nails", active: true },
  ];
  for (const service of services) await Service.updateOne({ name: service.name }, { $setOnInsert: service }, { upsert: true });
  console.log("Initial salon services are ready.");
  await mongoose.disconnect();
}
main().catch(async error => { console.error(error); await mongoose.disconnect().catch(() => undefined); process.exitCode = 1; });
