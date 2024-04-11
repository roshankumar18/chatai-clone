"use client";

import { redirect, useParams, useRouter } from "next/navigation";
import { createChat } from "../lib/createChat";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getChats } from "../lib/getChats";
import { CirclePlus, Delete, LogOut, Trash } from "lucide-react";
import { deleteChat } from "../lib/deleteChat";
import { toast } from "react-toastify";
import { useMediaQuery } from "usehooks-ts";

type ChatType = {
  chatId: string;
};
export default function Sidebar() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showNav, setShowNav] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function getAllChats() {
      const chats = (await getChats()) as ChatType[];
      setChats(chats);
    }
    getAllChats();
  }, [id]);

  async function newChatHandler() {
    try {
      const result = await createChat();
      if ("chatId" in result!) {
        const chat: ChatType = result;
        setChats((prev) => [chat, ...prev]);
        console.log(chat.chatId);
        router.push(`/chat/${chat.chatId}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteHanlder(e:React.MouseEvent<HTMLButtonElement,MouseEvent>, chatId: string) {
    e.stopPropagation();
    try {
      const res = await deleteChat(chatId);
      if (res.message === "success") {
        setChats((chats) => chats.filter((chat) => chat.chatId !== chatId));
        toast.success("Deleted");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
    if (chatId === id) router.push("/chat");
  }
  return (
    <div className="bg-gray-800">
      <button
        data-drawer-target="default-sidebar"
        onClick={() => setShowNav((prev) => !prev)}
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="absolute inline-flex items-center p-2 mt-1 ms-3 text-sm  rounded-lg sm:hidden  focus:outline-none focus:ring-2   text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {(!isMobile || showNav) && (
        <aside
          className=" max-h-screen  top-0 left-0 z-40 w-64   sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="max-h-screen px-3 py-4 flex flex-col  ">
            <div
              className=" justify-between items-center font-medium flex rounded-lg text-white  hover:bg-gray-700 group p-2 cursor-pointer"
              onClick={newChatHandler}
            >
              <p>New Chat</p>
              <CirclePlus />
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="text-gray-200  text-sm flex rounded-lg  p-2 ">
                {" "}
                Chats
              </div>
              <ul className="space-y-2 font-medium">
                {chats.length > 0 &&
                  chats.map(({ chatId }) => (
                    <li
                      key={chatId}
                      onClick={() => router.push(`/chat/${chatId}`)}
                      className={`items-center relative group/item cursor-pointer text-sm px-4 overflow-hidden text-nowrap text-ellipsis p-2  rounded-lg text-white  hover:bg-gray-700 group ${id === chatId ? "bg-gray-700" : ""}`}
                    >
                      {chatId}
                      <button
                        onClick={(e) => deleteHanlder(e, chatId)}
                        className="opacity-0 absolute right-4 bottom-1.5 group-hover/item:opacity-100 bg-gray-700"
                      >
                        <Trash />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            <SignOutButton signOutCallback={() => router.push("/")}>
              <div className="flex items-center justify-between rounded-lg text-white hover:bg-gray-700 group p-2 cursor-pointer">
                <p>Sign Out</p>
                <LogOut />
              </div>
            </SignOutButton>
          </div>
        </aside>
      )}
    </div>
  );
}
