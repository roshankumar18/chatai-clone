"use server";

import { auth } from "@clerk/nextjs";
import { db } from "../db";
import { chats } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createChat() {
  const { userId } = auth();
  if (!userId) {
    return { message: "no user found" };
  }
  try {
    const chat = await db
      .insert(chats)
      .values({
        chatId: uuidv4(),
        userId: userId,
        createdAt: new Date(),
      })
      .returning({
        chatId: chats.chatId,
      });
    return chat[0];
  } catch (err) {
    console.log(err);
  }
  revalidatePath("/chat");
}
