'use client';

import { useState, FormEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { personalInfo } from '@/app/data/content';

const emailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  userMessageTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_USER_MESSAGE,
  autoReplyTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_AUTO_REPLY,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};
// An optional confirmation template must not disable delivery to the owner.
const isConfigured = Boolean(emailConfig.serviceId && emailConfig.userMessageTemplateId && emailConfig.publicKey);

export default function ContactSection() {
  const form = useRef<HTMLFormElement>(null);
  const submissionInFlight = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.current || submissionInFlight.current || !isConfigured) return;

    submissionInFlight.current = true;

    setIsSubmitting(true);
    setSubmitStatus(null);

    let ownerMessageSent = false;
    try {
      // Validate environment variables are configured
      const { serviceId, userMessageTemplateId, autoReplyTemplateId, publicKey } = emailConfig;
      if (!serviceId || !userMessageTemplateId || !publicKey) return;

      // Get form data
      const formData = new FormData(form.current);
      const userName = formData.get('from_name') as string;
      const userEmail = formData.get('from_email') as string;
      const message = formData.get('message') as string;
      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      });

      // Send notification email to portfolio owner
      const ownerEmailParams = {
        name: userName,
        from_name: userName,
        from_email: userEmail,
        reply_to: userEmail,
        to_email: personalInfo.email,
        message: message,
        time: timestamp,
      };

      const ownerResult = await emailjs.send(
        serviceId,
        userMessageTemplateId,
        ownerEmailParams,
        publicKey
      );

      if (ownerResult.text !== 'OK') {
        throw new Error('Failed to send notification email');
      }

      ownerMessageSent = true;

      // Send auto-reply email to user
      const autoReplyParams = {
        to_name: userName,
        to_email: userEmail,
        from_name: personalInfo.name,
        reply_to: personalInfo.email,
        time: timestamp,
      };

      if (autoReplyTemplateId) {
        // EmailJS limits send requests to one per second. Keep the optional
        // confirmation separate from the already-delivered owner message.
        await new Promise(resolve => setTimeout(resolve, 1100));
        await emailjs.send(serviceId, autoReplyTemplateId, autoReplyParams, publicKey);
      }

      // The owner message succeeded; confirmation is optional.
      setSubmitStatus({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
      });
      form.current.reset();
    } catch {
      // A failed auto-reply must not invite duplicate messages to the owner.
      setSubmitStatus({
        success: ownerMessageSent,
        message: ownerMessageSent
          ? 'Your message was sent, but the confirmation email could not be delivered.'
          : 'Your message could not be sent. Please try again or use the email link.',
      });
      if (ownerMessageSent) form.current?.reset();
    } finally {
      submissionInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-x-clip bg-dark-950 py-18 pb-32">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 id="contact-heading" className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Get In Touch
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-400"></div>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-w-0 space-y-6"
          >
            <div>
              <h3 className="mb-8 text-3xl font-semibold text-white">
                Let&apos;s Connect
              </h3>
              <p className="mb-8 text-gray-400">
                Feel free to reach out for collaborations, opportunities, or just a friendly chat!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Location</h4>
                  <p className="text-gray-400">{personalInfo.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <a href={`mailto:${personalInfo.email}`} className="break-all text-primary-400 hover:text-primary-300">
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <p className="text-gray-400">{personalInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <h4 className="mb-4 font-semibold text-white">Follow Me</h4>
              <div className="flex gap-4">
                {personalInfo.social.github && (
                  <a
                    aria-label="GitHub"
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400 transition-colors hover:bg-primary-500 hover:text-white"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {personalInfo.social.linkedin && (
                  <a
                    aria-label="LinkedIn"
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400 transition-colors hover:bg-primary-500 hover:text-white"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-w-0 rounded-xl border border-primary-500/20 bg-dark-800/50 p-6 backdrop-blur-sm sm:p-10"
          >
            {!isConfigured && (
              <p role="status" className="mb-6 rounded-lg border border-primary-400/30 bg-primary-500/10 p-4 text-sm text-gray-200">
                The contact form is currently unavailable. Please <a className="text-primary-300 underline" href={`mailto:${personalInfo.email}`}>email me directly</a> instead.
              </p>
            )}
            <form ref={form} onSubmit={handleSubmit} className="space-y-7" aria-busy={isSubmitting}>
              <div>
                <label htmlFor="from_name" className="mb-3 block text-sm font-semibold text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  required
                  className="min-w-0 w-full rounded-lg border border-primary-500/20 bg-dark-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="from_email" className="mb-3 block text-sm font-semibold text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="from_email"
                  name="from_email"
                  required
                  className="min-w-0 w-full rounded-lg border border-primary-500/20 bg-dark-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-3 block text-sm font-semibold text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="min-w-0 w-full rounded-lg border border-primary-500/20 bg-dark-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isConfigured}
                className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 py-4 font-semibold text-white shadow-lg shadow-primary-500/30 transition-colors duration-150 hover:from-primary-700 hover:to-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!isConfigured ? 'Form unavailable' : isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-4 text-center ${
                    submitStatus.success
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {submitStatus.message}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
