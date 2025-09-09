"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, Info, Compass, Mail } from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-2.5 left-6 z-50 p-2 bg-black/70 text-white rounded-lg hover:bg-gray-100 hover:text-black transition"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black/90 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Brand / Logo */}
        <div className="pl-18 px-6 py-4 text-2xl font-2rem text-[#ffffff] border-b border-gray-700">
            Ellipses
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col mt-6 space-y-6 px-6 text-lg">
          <Link href="/" className="flex items-center gap-3 hover:text-[#a9dbf1] transition">
            <Home size={20} /> Home
          </Link>
          <Link href="/about" className="flex items-center gap-3 hover:text-[#a9dbf1] transition">
            <Info size={20} /> About
          </Link>
          <Link href="/explore" className="flex items-center gap-3 hover:text-[#a9dbf1] transition">
            <Compass size={20} /> Explore
          </Link>
          <Link href="/contact" className="flex items-center gap-3 hover:text-[#a9dbf1] transition">
            <Mail size={20} /> Contact
          </Link>
        </nav>
      </div>
    </>
  )
}
