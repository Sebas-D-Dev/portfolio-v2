import { useEffect, useState } from "react";
import "../globals.css";
import "../styles/footer.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector(".footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsVisible(rect.top < window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className={`footer ${isVisible ? "visible" : ""}`}>
      <div className="topSection">
        <div className="socials">
          {/* Social Media Links with Icons */}
          <a href="https://github.com/Sebas-D-Dev" target="_blank" rel="noopener noreferrer">
            <img src="/assets/github.svg" alt="GitHub" className="social-icon" /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/sebastian-torres-cs/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/linkedin.svg" alt="LinkedIn" className="social-icon" /> LinkedIn
          </a>
          <a href="https://discord.com/users/1373891287392194620/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/discord.svg" alt="Discord" className="social-icon" /> Discord
          </a>
          <a href="https://www.instagram.com/xsea_bassx/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/instagram.svg" alt="Instagram" className="social-icon" /> Instagram
          </a>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} All rights reserved. Developed by Sebastian Torres.</p>
    </footer>
  );
};

export default Footer;