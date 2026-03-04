"use client";

import { useState, useCallback } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface UseContactFormReturn {
  status: FormStatus;
  errorMessage: string;
  turnstileToken: string;
  setTurnstileToken: (token: string) => void;
  handleSubmit: (formType: string, data: Record<string, unknown>) => Promise<void>;
  reset: (resetTurnstile?: () => void) => void;
}

export default function useContactForm(): UseContactFormReturn {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = useCallback(
    async (formType: string, data: Record<string, unknown>) => {
      if (!turnstileToken) {
        setErrorMessage("Please complete the bot verification.");
        setStatus("error");
        return;
      }

      setStatus("submitting");
      setErrorMessage("");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, formType, turnstileToken }),
        });

        if (!res.ok) {
          const json = (await res.json()) as { error?: string };
          throw new Error(json.error || "Something went wrong.");
        }

        setStatus("success");
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Something went wrong."
        );
        setStatus("error");
      }
    },
    [turnstileToken]
  );

  const reset = useCallback(
    (resetTurnstile?: () => void) => {
      setStatus("idle");
      setErrorMessage("");
      setTurnstileToken("");
      if (resetTurnstile) resetTurnstile();
    },
    []
  );

  return {
    status,
    errorMessage,
    turnstileToken,
    setTurnstileToken,
    handleSubmit,
    reset,
  };
}
