"use client";
import { useEffect, useState } from "react";
import "../styles/navigation.css";

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "News", id: "news" },
  { label: "Contact", id: "contact" },
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
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.filter((item) => item.id).map((item) => item.id!);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.side-nav') && !target.closest('.nav-toggle-btn')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleNavClick = (item: typeof NAV_ITEMS[number]) => {
    if (item.external) {
      window.open(item.path, "_blank", "noopener,noreferrer");
      setIsOpen(false);
    } else if (item.id) {
      scrollToSection(item.id);
    }
  };

  return (
    <>
      {/* Hamburger Menu Button - Fixed Top Right */}
      <button
        className="nav-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Overlay */}
      <div 
        className={`nav-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Navigation Drawer */}
      <nav className={`side-nav ${isOpen ? 'open' : ''}`}>
        <div className="side-nav-items" style={{ paddingTop: '3rem' }}>
          {NAV_ITEMS.map((item) => (
            item.external ? (
              <a
                key={item.label}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="side-nav-link"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`side-nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;