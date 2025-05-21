"use client";

import { useState, FormEvent, useRef } from "react";
import emailjs from '@emailjs/browser';
import Navigation from "../../layouts/navigation";
import Footer from "../../layouts/footer";
import "../../globals.css";
import "../../styles/contact.css";

// EmailJS configuration constants
const EMAILJS_SERVICE_ID = 'service_tsegt3z';
const EMAILJS_TEMPLATE_ID = 'template_yq64z3i';
const EMAILJS_PUBLIC_KEY = '6jl4hXL-cfRAhy6fv';
const RECIPIENT_EMAIL = 'sebas.t.nait@gmail.com';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success?: boolean; message?: string} | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.current) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form.current,
        EMAILJS_PUBLIC_KEY
      );

      if (result.text === 'OK') {
        setSubmitStatus({ 
          success: true, 
          message: "Thank you! Your message has been sent successfully." 
        });
        // Reset form
        form.current.reset();
      } else {
        setSubmitStatus({ 
          success: false, 
          message: "Failed to send message. Please try again." 
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus({ 
        success: false, 
        message: "An error occurred. Please try again later." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h3>📧 {RECIPIENT_EMAIL}</h3>
            <h3>📞 +1 (954) 304-7962</h3>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="contact-box">
            <h2 className="contact-title">Contact Me</h2>

            <form className="contact-form" ref={form} onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="from_name"
                placeholder="Your Name" 
                className="input-field" 
                required
              />
              <input 
                type="email" 
                name="from_email"
                placeholder="Your Email" 
                className="input-field" 
                required
              />
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows={4} 
                className="input-field"
                required
              ></textarea>
              
              {/* Hidden field for recipient email */}
              <input 
                type="hidden" 
                name="to_email" 
                value={RECIPIENT_EMAIL}
              />

              <button 
                type="submit" 
                className="send-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "✉️ Send Message"}
              </button>
              
              {submitStatus && (
                <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
