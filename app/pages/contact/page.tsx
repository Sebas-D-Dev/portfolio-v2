"use client"; // Enables interactivity in Next.js

import Navigation from "../../layouts/navigation";
import Footer from "../../layouts/footer";
import "../../globals.css";
import "../../styles/contact.css";

export default function Contact() {
  return (
    <main className="relative">
      <Navigation />

      {/* Contact section */}
      <section className="contact-container">
        <div className="contact-content">
          {/* Contact Details (Left Side) */}
          <div className="contact-info">
            <h3 className="info-title">Get in Touch</h3>
            <h3>📍 Boynton Beach, FL</h3>
            <h3>📧 sebas.t.nait@gmail.com</h3>
            <h3>📞 +1 (954) 304-7962</h3>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="contact-box">
            <h2 className="contact-title">Contact Me</h2>

            <form className="contact-form">
              <input type="text" placeholder="Your Name" className="input-field" />
              <input type="email" placeholder="Your Email" className="input-field" />
              <textarea placeholder="Your Message" rows={4} className="input-field"></textarea>

              <button type="submit" className="send-button">
                ✉️ Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}