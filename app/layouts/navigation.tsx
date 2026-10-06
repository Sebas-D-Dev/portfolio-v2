'use client';

import { useEffect, useRef, useState } from 'react';
import { resumeUrl } from '@/lib/site';
import '../styles/navigation.css';

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'Projects', id: 'projects' },
  { label: 'About & Experience', id: 'about' },
  { label: 'News', id: 'news' },
  { label: 'Contact', id: 'contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Vertical rootMargin percentages use width, so derive pixels from height.
    let observer: IntersectionObserver;
    const observeSections = () => {
      observer?.disconnect();
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      }, { rootMargin: `-${window.innerHeight * 0.15}px 0px -${window.innerHeight * 0.65}px 0px`, threshold: 0 });
      NAV_ITEMS.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    };
    observeSections();
    window.addEventListener('resize', observeSections);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', observeSections);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!isOpen) {
      dialog.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" className="nav-toggle-btn" onClick={() => setIsOpen(true)} aria-label="Open navigation menu" aria-expanded={isOpen} aria-controls="navigation-dialog">
        <span className="hamburger" aria-hidden="true"><span /><span /><span /></span>
      </button>
      <dialog
        ref={dialogRef}
        id="navigation-dialog"
        className="side-nav"
        aria-label="Navigation menu"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) setIsOpen(false);
        }}
      >
        <button type="button" className="nav-close-btn" onClick={() => setIsOpen(false)} aria-label="Close navigation menu">✕</button>
        <nav aria-label="Main navigation" className="side-nav-items">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setIsOpen(false)} aria-current={activeSection === item.id ? 'location' : undefined} className={`side-nav-link ${activeSection === item.id ? 'active' : ''}`}>
              {item.label}
            </a>
          ))}
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="side-nav-link" onClick={() => setIsOpen(false)}>Resume</a>
        </nav>
      </dialog>
    </>
  );
}
