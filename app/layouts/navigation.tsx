"use client"; // Enables interactivity in Next.js

import { useRouter } from "next/navigation";
import Image from "next/image";

const Navigation = () => {
  const router = useRouter(); // Initialize the router instance

  return (
    <nav className="fixed top-0 left-0 w-full bg-black shadow-md z-50 px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/portfolio-v2/favicon.ico" alt="Logo" width={30} height={30} unoptimized />
          <span className="font-bold text-xl">Sebastian Torres</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-6">
          <button onClick={() => router.push("/pages/about")} className="hover:text-gray-600">About</button>
          <button onClick={() => router.push("/pages/work")} className="hover:text-gray-600">Work</button>
          <button onClick={() => router.push("/pages/contact")} className="hover:text-gray-600">Contact</button>
          <button onClick={() => router.push("./resume.pdf")} className="hover:text-gray-600">Resume</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;