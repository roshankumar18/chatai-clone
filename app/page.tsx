import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";
import Chat from "./chat/page";
import { use } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) {
    redirect("/chat");
  }
  return (
    <div className="w-full h-full flex justify-center bg-gray-700 items-center">
      {!userId ? (
        <div className="border  bg-white font-medium p-4 rounded-md">
          <SignInButton />
        </div>
      ) : (
        <Chat />
      )}
    </div>
  );
}
