import "dotenv/config";
import { db } from "./index";

import {
  users,
  retailers,
  dispatchers,
  riders,
  deliveryRequests,
  deliveryAssignments,
  deliveryStatusHistory,
  riderLocations,
} from "./schema";

import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash(
    "password123",
    10
  );

  // USERS

  const [admin] = await db
    .insert(users)
    .values({
      firstName: "System",
      lastName: "Admin",
      email: "admin@test.com",
      phone: "0700000000",
      password,
      role: "admin",
    })
    .returning();

  const [retailerUser1] = await db
    .insert(users)
    .values({
      firstName: "John",
      lastName: "Retailer",
      email: "retailer1@test.com",
      phone: "0711111111",
      password,
      role: "retailer",
    })
    .returning();

  const [retailerUser2] = await db
    .insert(users)
    .values({
      firstName: "Mary",
      lastName: "Retailer",
      email: "retailer2@test.com",
      phone: "0722222222",
      password,
      role: "retailer",
    })
    .returning();

  const [dispatcherUser] = await db
    .insert(users)
    .values({
      firstName: "Peter",
      lastName: "Dispatcher",
      email: "dispatcher@test.com",
      phone: "0733333333",
      password,
      role: "dispatcher",
    })
    .returning();

  const [riderUser1] = await db
    .insert(users)
    .values({
      firstName: "David",
      lastName: "Rider",
      email: "rider1@test.com",
      phone: "0744444444",
      password,
      role: "rider",
    })
    .returning();

  const [riderUser2] = await db
    .insert(users)
    .values({
      firstName: "Brian",
      lastName: "Rider",
      email: "rider2@test.com",
      phone: "0755555555",
      password,
      role: "rider",
    })
    .returning();

  const [riderUser3] = await db
    .insert(users)
    .values({
      firstName: "Kevin",
      lastName: "Rider",
      email: "rider3@test.com",
      phone: "0766666666",
      password,
      role: "rider",
    })
    .returning();

  // RETAILERS

  const [retailer1] = await db
    .insert(retailers)
    .values({
      userId: retailerUser1.id,
      businessName: "Naivas Westlands",
      address: "Westlands Nairobi",
    })
    .returning();

  const [retailer2] = await db
    .insert(retailers)
    .values({
      userId: retailerUser2.id,
      businessName: "QuickMart Kilimani",
      address: "Kilimani Nairobi",
    })
    .returning();

  // DISPATCHER

  const [dispatcher] = await db
    .insert(dispatchers)
    .values({
      userId: dispatcherUser.id,
    })
    .returning();

  // RIDERS

  const [rider1] = await db
    .insert(riders)
    .values({
      userId: riderUser1.id,
      vehicleType: "Motorbike",
      plateNumber: "KMD123A",
      licenseNumber: "DL123456",
      nationalId: "12345678",
    })
    .returning();

  const [rider2] = await db
    .insert(riders)
    .values({
      userId: riderUser2.id,
      vehicleType: "Motorbike",
      plateNumber: "KMD456B",
      licenseNumber: "DL223344",
      nationalId: "22334455",
    })
    .returning();

  const [rider3] = await db
    .insert(riders)
    .values({
      userId: riderUser3.id,
      vehicleType: "Van",
      plateNumber: "KCA789C",
      licenseNumber: "DL998877",
      nationalId: "99887766",
    })
    .returning();

  // RIDER LOCATION

  await db.insert(riderLocations).values({
    riderId: rider1.id,
    latitude: "-1.267564",
    longitude: "36.810231",
    speed: 0,
    heading: 0,
  });

  // DELIVERY REQUESTS

  const [delivery1] = await db
    .insert(deliveryRequests)
    .values({
      retailerId: retailer1.id,
      customerName: "Alice",
      customerPhone: "0701234567",
      deliveryAddress: "Parklands",
      latitude: "-1.255000",
      longitude: "36.800000",
      itemDescription: "Groceries",
      status: "assigned",
    })
    .returning();

  const [delivery2] = await db
    .insert(deliveryRequests)
    .values({
      retailerId: retailer1.id,
      customerName: "Bob",
      customerPhone: "0702345678",
      deliveryAddress: "Kilimani",
      itemDescription: "Electronics",
      status: "open",
    })
    .returning();

  const [delivery3] = await db
    .insert(deliveryRequests)
    .values({
      retailerId: retailer2.id,
      customerName: "Carol",
      customerPhone: "0703456789",
      deliveryAddress: "Lavington",
      itemDescription: "Household Items",
      status: "open",
    })
    .returning();

  // ASSIGNMENT

  await db.insert(deliveryAssignments).values({
    deliveryRequestId: delivery1.id,
    riderId: rider1.id,
    dispatcherId: dispatcher.id,
    status: "accepted",
  });

  // STATUS HISTORY

  await db.insert(deliveryStatusHistory).values([
    {
      deliveryRequestId: delivery1.id,
      status: "open",
      updatedBy: admin.id,
      notes: "Delivery created",
    },
    {
      deliveryRequestId: delivery1.id,
      status: "assigned",
      updatedBy: dispatcherUser.id,
      notes: "Assigned to rider",
    },
  ]);

  console.log(
    "✅ Database seeded successfully"
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });