"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

/**
 * Cloudflare-provided test site key that always passes validation.
 * @see https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(
  function Turnstile({ onVerify, onExpire, onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const scriptLoadedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current !== null) return;

      const siteKey =
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || TURNSTILE_TEST_SITE_KEY;
      if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && typeof window !== "undefined") {
        console.warn(
          "NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set — using Cloudflare test key. " +
          "Set this env var in your deployment for real bot protection."
        );
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onError,
        theme: "light",
      });
    }, [onVerify, onExpire, onError]);

    useEffect(() => {
      let loadHandler: (() => void) | null = null;
      let loadTarget: Element | null = null;

      if (scriptLoadedRef.current) {
        renderWidget();
      } else {
        /* Check if script already exists */
        const existing = document.querySelector(
          'script[src*="challenges.cloudflare.com/turnstile"]'
        );

        if (existing) {
          if (window.turnstile) {
            scriptLoadedRef.current = true;
            renderWidget();
          } else {
            /* Script tag exists but hasn't finished loading yet */
            loadHandler = () => {
              scriptLoadedRef.current = true;
              renderWidget();
            };
            loadTarget = existing;
            existing.addEventListener("load", loadHandler);
          }
        } else {
          const script = document.createElement("script");
          script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
          script.async = true;
          script.onload = () => {
            scriptLoadedRef.current = true;
            renderWidget();
          };
          document.head.appendChild(script);
        }
      }

      return () => {
        if (loadHandler && loadTarget) {
          loadTarget.removeEventListener("load", loadHandler);
        }
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, [renderWidget]);

    return <div ref={containerRef} style={{ marginTop: "16px", marginBottom: "8px" }} />;
  }
);

export default Turnstile;
