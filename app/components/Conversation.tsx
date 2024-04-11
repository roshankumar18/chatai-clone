import { CircleUser, LoaderCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

type Props = {
  conversation: { content: string; role: string }[];
  loading: Boolean;
};

const Conversation = ({ conversation, loading }: Props) => {
  const scrollToRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToRef.current]);
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  return (
    <div className="w-full h-full">
      {conversation.length === 0 ? (
        <div className="flex w-full h-full text-white font-semibold text-xl bg-gray-700 justify-center items-center">
          Start Conversation
        </div>
      ) : (
        <div className="mx-auto">
          {conversation.map((item, index) => (
            <div
              key={index}
              className={`p-4 flex gap-2 flex-col text-white ${item.role === "user" ? "bg-gray-900" : "bg-gray-800"}`}
            >
              <div className="flex gap-2">
                {item.role === "user" ? (
                  <div>
                    <CircleUser />
                  </div>
                ) : (
                  <div>
                    <Image
                      className="object-contain"
                      src={"/chatgpt-icon.png"}
                      alt="chatgpt-icon"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <p className="font-bold">
                  {item.role === "user" ? "You" : "ChatGpt"}
                </p>
              </div>
              <div>{item.content}</div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center justify-center w-full p-4">
              <LoaderCircle className="animate-spin" stroke="white" />
            </div>
          )}
          <div ref={scrollToRef} />
        </div>
      )}
    </div>
  );
};

export default Conversation;
