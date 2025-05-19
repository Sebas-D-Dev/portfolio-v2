import { useEffect, useState } from "react";
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
          <a href="https://github.com/Sebas-D-Dev" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/sebastian-torres-cs/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://discord.com/users/465700207867330611/" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="https://www.instagram.com/xsea_bassx/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} All rights reserved. Developed by Sebastian Torres.</p>
    </footer>
  );
};

export default Footer;