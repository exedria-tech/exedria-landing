// Cloudflare Turnstile for the contact form. Only active when VITE_TURNSTILE_SITE_KEY is set at build time;
// api/contact.ts checks the token once TURNSTILE_SECRET_KEY is set in Vercel.
import { useEffect, useRef, useState } from 'react';

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

let scriptPromise: Promise<Turnstile> | null = null;

function loadTurnstile() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error('turnstile failed to load'));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Renders the widget into the returned ref (invisible unless Cloudflare wants an interaction) and tracks its token. */
export function useTurnstile(lang: string) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !ref.current) return;
        widget.current = ts.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: 'interaction-only',
          language: lang,
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [lang]);

  // Tokens are single-use, so ask for a fresh one after every submission.
  const reset = () => {
    setToken('');
    if (widget.current) window.turnstile?.reset(widget.current);
  };

  return { ref, token, reset, enabled: Boolean(TURNSTILE_SITE_KEY) };
}
