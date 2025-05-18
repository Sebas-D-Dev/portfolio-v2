"use client"; // Enables interactivity in Next.js

import Navigation from "../../layouts/navigation";
import "../../styles/work.css";

export default function Work() {
  return (
    <main className="relative">
      {/* Navigation Bar */}
      <Navigation /> {/* Using the reusable component */}
      
      {/* Work section */}
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
          {/* Add your vertical timeline here */}
          <p>This is the Work section with my career timeline.</p>
        </div>
      </section>
    </main>
  );
}