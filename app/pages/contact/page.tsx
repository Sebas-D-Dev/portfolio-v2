"use client"; // Enables interactivity in Next.js

import Navigation from "../../layouts/navigation";
import "../../styles/contact.css";

export default function Contact() {
  return (
    <main className="relative">
      {/* Navigation Bar */}
      <Navigation /> {/* Using the reusable component */}
      
      {/* Contact section */}
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Me</h2>
          {/* Add your contact form or information here */}
          <p>This is the Contact section with my contact information.</p>
        </div>
      </section>
    </main>
  );
}