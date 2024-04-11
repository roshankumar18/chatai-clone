"use client";
import Conversation from "@/app/components/Conversation";
import {
  createConversation,
  getConveration,
} from "@/app/lib/createConversation";
import { LoaderCircle, SendHorizontal, ShieldAlert } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type ConversationType = {
  content: string;
  role: string;
};

const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState<ConversationType[]>([]);
  const { id }: { id: string } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState<number>(2);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    async function getMessages() {
      const allConverstion = await getConveration(id);
      setConversation(allConverstion as ConversationType[]);
    }
    getMessages();
  }, [id]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        Math.min(textAreaRef.current.scrollHeight, 300) + "px";
    }
  }, [textAreaRef.current, prompt]);

  async function sendPrompt() {
    if (loading) return;
    setLoading(true);
    setError(false);
    const message = prompt;
    setPrompt("");
    setConversation((prev) => [...prev, { content: message, role: "user" }]);
    try {
      const assistantMessage = await createConversation(id, message);
      if (!assistantMessage?.generatedText) {
        setError(true);
        return;
      }
      setConversation((prev) => [
        ...prev,
        { content: assistantMessage?.generatedText!, role: "assistant" },
      ]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }
  return (
    <div className="flex-1 flex overflow-auto flex-col bg-gray-800 mt-8  md:mt-0">
      <div className="overflow-y-auto flex-1 ">
        <Conversation conversation={conversation} loading={loading} />
      </div>

      {error && (
        <div className="flex justify-center p-4 bg-red-600 text-white">
          <ShieldAlert />
          Something Went Wrong
        </div>
      )}
      <div className="border p-1 border-black rounded-lg bg-white flex items-center ">
        <textarea
          className="w-full overflow-y-auto  outline-none resize-none"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Enter a prompt"
          rows={1}
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              sendPrompt();
            }
          }}
          autoFocus
        />
        {!loading ? (
          <button className="p-2" onClick={sendPrompt}>
            <SendHorizontal />
          </button>
        ) : (
          <button className="p-2" disabled>
            <LoaderCircle className="animate-spin" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Page;
