"use client";
import React, { use, useEffect, useState } from "react";
import { createuser } from "../lib/createUser";
import { useRouter } from "next/navigation";
import { createChat } from "../lib/createChat";

const Chat = () => {
  const router = useRouter();
  async function createuserInDb() {
    const user = await createuser();
  }
  useEffect(() => {
    createuserInDb();
  }, []);

  async function createNewChat() {
    try {
      const result = await createChat();
      if ("chatId" in result!) {
        const chatId = result.chatId;
        console.log(chatId);
        router.push(`chat/${chatId}`);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="flex-1 h-full flex flex-col p-2">
      <div className="flex-1 flex flex-col justify-center gap-4 text-white items-center">
        <p className="text-4xl">How can I help you today?</p>
        <button onClick={createNewChat} className="border-2 p-2  bg-white text-gray-900 font-medium rounded-md">
          Start a new Conversation
        </button>
      </div>
    </div>
  );
};

export default Chat;
