"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WelcomeMessage({ message }) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/next"); 
  };

  return (
    <div style={overlayStyle}>
      <p>{message}</p>
      <Button
        onClick={handleClick}
        className="mt-1 bg-black-700 hover:bg-white text-white hover:text-black px-6 py-2 rounded-lg transition-colors duration-300"
      >
        Click Here to proceed
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}

const overlayStyle = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "#ffffff",
  fontSize: "2.5rem",
  fontFamily: "Georgia, Arial, sans-serif",
  textAlign: "center",
  pointerEvents: "auto",
  zIndex: 10,
};
