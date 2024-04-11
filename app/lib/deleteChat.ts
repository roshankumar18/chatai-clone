"use server";

import { auth } from "@clerk/nextjs";
import { db } from "../db";
import { chats } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteChat(chatId: string) {
  const { userId } = auth();
  if (!userId) {
    return { message: "no user found" };
  }
  try {
    await db.delete(chats).where(eq(chats.chatId, chatId));
    return {
      message: "success",
    };
  } catch (err) {
    console.log(err);
    return {
      message: "something went wrong",
    };
  }
  revalidatePath("/chat");
}
