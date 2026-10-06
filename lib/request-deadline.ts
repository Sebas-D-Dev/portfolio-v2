// Avoid AbortSignal.any/timeout so the static site still works on older Safari.
export function requestDeadline(parent: AbortSignal, milliseconds: number) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, milliseconds);
  if (parent.aborted) abort();
  else parent.addEventListener('abort', abort, { once: true });
  return {
    signal: controller.signal,
    dispose: () => { clearTimeout(timer); parent.removeEventListener('abort', abort); },
  };
}
