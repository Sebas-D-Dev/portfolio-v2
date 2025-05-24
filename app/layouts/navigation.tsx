"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import DropdownMenu from "@/components/DropdownMenu";
import "../styles/navigation.css";

const NAV_ITEMS = [
  { label: "About", path: "/pages/about" },
  { label: "Experience", path: "/pages/work" },
  { label: "Contact", path: "/pages/contact" },
  {
    label: "Resume",
    path:
      process.env.NODE_ENV === "production"
        ? "https://sebas-d-dev.github.io/portfolio-v2/assets/resume.pdf"
        : "/assets/resume.pdf",
    external: true,
  },
];

const Navigation = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dropdown handler
  const handleDropdownSelect = (item: string) => {
    const nav = NAV_ITEMS.find((navItem) => navItem.label === item);
    if (!nav) return;
    if (nav.external) {
      window.open(nav.path, "_blank", "noopener,noreferrer");
    } else {
      router.push(nav.path);
    }
  };

  return (
    <nav>
      <div className="nav-container" style={isMobile ? { flexDirection: "column", alignItems: "center" } : {}}>
        {/* Logo */}
        <div
          className="logo"
          onClick={() => router.push("/")}
          style={isMobile ? { justifyContent: "center", marginBottom: "0.5rem" } : {}}
        >
          <Image
            src={
              process.env.NODE_ENV === "production"
                ? "/portfolio-v2/favicon.ico"
                : "/favicon.ico"
            }
            alt="Logo"
            width={30}
            height={30}
            unoptimized
          />
          <span>Sebastian Torres</span>
        </div>

        {/* Desktop Nav or Mobile Dropdown */}
        {!isMobile ? (
          <div className="nav-buttons">
            <button onClick={() => router.push("/pages/about")}>About</button>
            <button onClick={() => router.push("/pages/work")}>Experience</button>
            <button onClick={() => router.push("/pages/contact")}>Contact</button>
            <a
              href={
                process.env.NODE_ENV === "production"
                  ? "https://sebas-d-dev.github.io/portfolio-v2/assets/resume.pdf"
                  : "/assets/resume.pdf"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <DropdownMenu
              label="Menu"
              items={NAV_ITEMS.map((item) => item.label)}
              onSelect={handleDropdownSelect}
              open={dropdownOpen}
              setOpen={setDropdownOpen}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;