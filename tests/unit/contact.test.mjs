import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactFields, CONTACT_LIMITS } from '../../lib/contact-validation.mjs';
const valid = { name: 'Visitor', email: 'visitor@example.invalid', message: 'Hello' };
test('contact fields are trimmed without stripping legitimate code', () => {
  const code = '<script>alert("example")</script>\nif (a < b) { console.log("code"); }';
  const result = validateContactFields({ name: '  Visitor  ', email: ' visitor@example.invalid ', message: `  ${code}\n` });
  assert.deepEqual(result, { ok: true, values: { ...valid, message: code } });
});
test('blank and non-string contact values are rejected', () => {
  for (const [field, value] of [['name', '   '], ['message', '\n\t '], ['email', ''], ['name', null], ['email', {}], ['message', ['test']]]) assert.equal(validateContactFields({ ...valid, [field]: value }).ok, false);
});
test('limits are checked in the handler, not only via HTML attributes', () => {
  for (const field of ['name', 'email', 'message']) assert.equal(validateContactFields({ ...valid, [field]: 'x'.repeat(CONTACT_LIMITS[field] + 1) }).ok, false);
  assert.equal(validateContactFields({ ...valid, name: 'x'.repeat(100), message: 'x'.repeat(5000) }).ok, true);
  const maxEmail = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(61)}`;
  assert.equal(maxEmail.length, 254);
  assert.equal(validateContactFields({ ...valid, email: maxEmail }).ok, true);
  assert.equal(validateContactFields({ ...valid, email: `${maxEmail}e` }).ok, false);
});
test('header-like fields reject CR LF and control characters before trimming', () => {
  for (const field of ['name', 'email']) for (const control of ['\r', '\n', '\t', '\u0000', '\u001f', '\u007f', '\u0085', '\u2028', '\u2029']) {
    assert.equal(validateContactFields({ ...valid, [field]: `${valid[field]}${control}Bcc: other@example.invalid` }).ok, false);
    assert.equal(validateContactFields({ ...valid, [field]: `${control}${valid[field]}` }).ok, false);
  }
});
test('malformed and multiple-address email input is rejected', () => {
  for (const email of ['not-an-email', 'a@@example.invalid', 'a@b c', 'a@b, c@d']) assert.equal(validateContactFields({ ...valid, email }).ok, false);
});
