'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
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

  // Social media icons - Next.js automatically adds basePath from next.config.ts
  const socialLinks = [
    { 
      name: "GitHub", 
      url: "https://github.com/Sebas-D-Dev", 
      icon: "/assets/github.svg"
    },
    { 
      name: "LinkedIn", 
      url: "https://www.linkedin.com/in/sebastian-torres-cs/", 
      icon: "/assets/linkedin.svg"
    },
    { 
      name: "Discord", 
      url: "https://discord.com/users/1373891287392194620/", 
      icon: "/assets/discord.svg"
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/xsea_bassx/", 
      icon: "/assets/instagram.svg"
    },
  ];

  return (
    <footer className={`footer ${isVisible ? "visible" : ""}`}>
      <div className="topSection">
        <div className="socials">
          {socialLinks.map((social) => (
            <a 
              key={social.name} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Image 
                src={social.icon} 
                alt={social.name} 
                width={24} 
                height={24} 
                className="social-icon" 
              /> 
              {social.name}
            </a>
          ))}
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} All rights reserved. Developed by Sebastian Torres.</p>
    </footer>
  );
};

export default Footer;
