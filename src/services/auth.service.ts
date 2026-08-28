import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db";
import {
  users,
  retailers,
  dispatchers,
  riders,
} from "../db/schema";

import { generateToken } from "../utils/jwt";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: "retailer" | "dispatcher" | "rider";
};

export const registerUser = async (
  data: RegisterInput
) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
    
  }


  const hashedPassword =
    await bcrypt.hash(
      data.password,
      10
    );

  const [user] = await db
    .insert(users)
    .values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
    })
    .returning();

  if (data.role === "retailer") {
    await db.insert(retailers).values({
      userId: user.id,
      businessName:
        `${user.firstName}'s Store`,
    });
  }

  if (data.role === "dispatcher") {
    await db.insert(dispatchers).values({
      userId: user.id,
    });
  }

  if (data.role === "rider") {
    await db.insert(riders).values({
      userId: user.id,
    });
  }

  return user;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user =
    await db.query.users.findFirst({
      where: eq(users.email, email),
    });

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token = generateToken(
    user.id,
    user.role
  );
  console.log("TOKEN PAYLOAD:", {
  id: user.id,
  role: user.role,
});
  return {
    token,
    user,
  };
};

