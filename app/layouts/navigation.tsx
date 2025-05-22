"use client"; // Enables interactivity in Next.js
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../styles/navigation.css";

const Navigation = () => {
  const router = useRouter();

  return (
    <nav>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo" onClick={() => router.push("/")}>
          <Image
            src={process.env.NODE_ENV === "production" ? "/portfolio-v2/favicon.ico" : "/favicon.ico"}
            alt="Logo"
            width={30}
            height={30}
            unoptimized
          />
          <span>Sebastian Torres</span>
        </div>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <button onClick={() => router.push("/pages/about")}>About</button>
          <button onClick={() => router.push("/pages/work")}>Experience</button>
          <button onClick={() => router.push("/pages/contact")}>Contact</button>
          <a 
            href={process.env.NODE_ENV === "production" 
              ? "https://sebas-d-dev.github.io/portfolio-v2/assets/resume.pdf" 
              : "/assets/resume.pdf"}
            target="_blank" 
            rel="noopener noreferrer">
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;