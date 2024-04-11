"use server";

import { auth } from "@clerk/nextjs";
import { db } from "../db";
import { conversations } from "../db/schema";
import OpenAI from "openai";
import { eq } from "drizzle-orm";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createConversation(chatId: string, message: string) {
  const { userId } = auth();
  if (!userId) {
    return { message: "no user found" };
  }
  try {
    await db.insert(conversations).values({
      chatId: chatId,
      createdAt: new Date(),
      message: message,
      role: "user",
    });
    const allConversation = (await getConveration(
      chatId,
    )) as ChatCompletionMessageParam[];
    if (allConversation.length === 0) return;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: allConversation,
    });
    const generatedText = completion.choices[0]?.message?.content;
    if (generatedText) {
      await db.insert(conversations).values({
        chatId: chatId,
        createdAt: new Date(),
        message: generatedText,
        role: "assistant",
      });
    }
    return {
      generatedText,
    };
  } catch (err) {
    return { message: "something went wrong" };
  }
}

export async function getConveration(chatId: string) {
  try {
    const allConversation = await db.query.conversations.findMany({
      where: eq(conversations.chatId, chatId),
    });
    return allConversation
      .sort((a, b) => a.id - b.id)
      .map(({ message, role }) => {
        return {
          content: message,
          role,
        };
      });
  } catch (err) {
    return { message: "something went wrong" };
  }
}
