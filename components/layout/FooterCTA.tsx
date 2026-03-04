"use client";

import { useState, useCallback } from "react";

interface FooterCTAProps {
  variant?: "standard" | "lander";
}

function StandardCTA() {
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Placeholder — form submission logic will be added in a future phase
      setFormState("success");
    },
    []
  );

  return (
    <section style={{ padding: "80px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="call-to-action" data-wf-class="call-to-action">
          <h2 className="cta__heading" data-wf-class="cta__heading">
            Engage the experts
          </h2>

          {formState === "idle" && (
            <form onSubmit={handleSubmit} data-wf-class="w-form">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0 40px" }}>
                <div style={{ flex: "1", minWidth: "250px" }}>
                  <input
                    className="field"
                    data-wf-class="field w-input"
                    maxLength={256}
                    name="name"
                    placeholder="Your name"
                    type="text"
                    id="name"
                    required
                  />
                  <input
                    className="field"
                    data-wf-class="field w-input"
                    maxLength={256}
                    name="project-type"
                    placeholder="Project type"
                    type="text"
                    id="project-type"
                  />
                </div>
                <div style={{ flex: "1", minWidth: "250px" }}>
                  <input
                    className="field"
                    data-wf-class="field w-input"
                    maxLength={256}
                    name="email-address"
                    placeholder="Your email address"
                    type="email"
                    id="email-address"
                    required
                  />
                  <input
                    className="field"
                    data-wf-class="field w-input"
                    maxLength={256}
                    name="budget"
                    placeholder="Budget"
                    type="text"
                    id="budget"
                  />
                </div>
                <button
                  type="submit"
                  className="button is--outline form-submit"
                  data-wf-class="button is--outline form-submit w-button"
                >
                  Let&apos;s go
                </button>
              </div>
            </form>
          )}

          {formState === "success" && (
            <div data-wf-class="w-form-done">
              <div>Thank you! Your submission has been received!</div>
            </div>
          )}

          {formState === "error" && (
            <div data-wf-class="w-form-fail">
              <div>
                Oops! Something went wrong while submitting the form.
              </div>
            </div>
          )}

          <p className="cta__small-text" data-wf-class="cta__small-text">
            We will never share your information with third parties and will
            only contact you about information relating to your home technology.
          </p>
        </div>
      </div>
    </section>
  );
}

function LanderCTA() {
  return (
    <div className="lander__cta" data-wf-class="lander__cta">
      <h2>Schedule a professional consultation</h2>
      <p className="lander__cta-text" data-wf-class="lander__cta-text">
        Schedule a 15 minute phone consultation with one of our design experts
        at:
      </p>
      <h3>(760) 779-0881</h3>
    </div>
  );
}

export default function FooterCTA({ variant = "standard" }: FooterCTAProps) {
  if (variant === "lander") {
    return <LanderCTA />;
  }
  return <StandardCTA />;
}
