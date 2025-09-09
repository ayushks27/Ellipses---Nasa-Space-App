"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WelcomeMessage from "@/components/welcome";
import ThreeScene from "@/components/main.js";
import Sidebar from "@/components/sidebar";
import SearchBar from "@/components/searchbar";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/auth/sign-in");
    }
  }, [isSignedIn, router]);

  return (
    <div className="relative h-screen w-screen">
      {/* User profile in top-right corner */}
      <SignedIn>
        <div className="absolute top-4 right-4 z-50">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>

      {/* Your existing layout/components */}
      <Sidebar />
      <SearchBar />
      <ThreeScene />
      <WelcomeMessage message="Welcome to the Nasa Space App!" />
    </div>
  );
}
