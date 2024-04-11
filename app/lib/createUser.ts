"use server";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "../db";
import { profile } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createuser() {
  const { userId } = auth();
  const currentUserData = await currentUser();
  if (!currentUserData || !userId) {
    return { message: "no user found" };
  }
  const { firstName } = currentUserData;

  const users = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, userId));
  if (users.length === 0) {
    return await db
      .insert(profile)
      .values({
        userId: userId,
        name: firstName,
      })
      .returning({
        userId: profile.userId,
      });
  }
  return users[0].userId;
}
