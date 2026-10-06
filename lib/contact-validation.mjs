// Client-side input hygiene improves feedback; it is not an anti-abuse boundary.
// EmailJS clients can be called directly, so provider protections still matter.
export const CONTACT_LIMITS = Object.freeze({ name: 100, email: 254, message: 5000 });
const headerControls = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;

/**
 * @param {{name: unknown, email: unknown, message: unknown}} input
 * @returns {{ok: true, values: {name: string, email: string, message: string}} | {ok: false, error: string}}
 */
export function validateContactFields(input) {
  if (typeof input.name !== 'string' || typeof input.email !== 'string' || typeof input.message !== 'string') {
    return { ok: false, error: 'Please complete all contact fields.' };
  }
  if (headerControls.test(input.name) || headerControls.test(input.email)) {
    return { ok: false, error: 'Name and email cannot contain line breaks or control characters.' };
  }
  const values = { name: input.name.trim(), email: input.email.trim(), message: input.message.trim() };
  if (!values.name) return { ok: false, error: 'Please enter your name.' };
  if (!values.message) return { ok: false, error: 'Please enter a message.' };
  if (values.name.length > CONTACT_LIMITS.name) return { ok: false, error: 'Keep your name to 100 characters or fewer.' };
  if (values.email.length > CONTACT_LIMITS.email) return { ok: false, error: 'Keep your email address to 254 characters or fewer.' };
  if (values.message.length > CONTACT_LIMITS.message) return { ok: false, error: 'Keep your message to 5,000 characters or fewer.' };
  // Native type=email validation also runs in the form handler. This simple
  // shape check keeps whitespace/multiple-address input out of template fields.
  if (!/^[^\s@]+@[^\s@]+$/.test(values.email)) return { ok: false, error: 'Enter a valid email address.' };
  // Preserve legitimate code and angle brackets. The EmailJS templates must use
  // escaped {{message}} interpolation, never unescaped HTML or a dynamic href.
  return { ok: true, values };
}
