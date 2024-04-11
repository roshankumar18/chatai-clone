"use server";

import { auth } from "@clerk/nextjs";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { chats } from "../db/schema";

export async function getChats() {
  const { userId } = auth();
  if (!userId) {
    return { message: "no user found" };
  }
  try {
    const allChat = await db.query.chats.findMany({
      where: eq(chats.userId, userId),
    });
    return allChat.sort((a, b) => b.id - a.id);
  } catch (err) {
    console.log(err);
    return { message: "something went wrong" };
  }
}
