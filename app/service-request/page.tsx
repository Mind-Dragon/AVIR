"use client";

import { useState, useCallback, useRef } from "react";
import Turnstile, { type TurnstileHandle } from "@/components/forms/Turnstile";
import useContactForm from "@/components/forms/useContactForm";
import FooterCTA from "@/components/layout/FooterCTA";

/* ------------------------------------------------------------------ */
/*  Option data extracted from Webflow HTML                            */
/* ------------------------------------------------------------------ */

const RESIDENCE_OPTIONS = ["Full-time", "Seasonally"];

const SERVICE_CATEGORIES = [
  "Networking",
  "Automation",
  "Video",
  "Audio",
  "Telephone",
  "Security",
  "Lighting",
  "Cable/Satellite",
  "Intercom/Gate",
  "Shades",
  "Software Updates",
  "Equipment Upgrades",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ServiceRequestPage() {
  const { status, errorMessage, setTurnstileToken, handleSubmit, reset } =
    useContactForm();
  const turnstileRef = useRef<TurnstileHandle>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [residenceType, setResidenceType] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const toggleCheckbox = useCallback(
    (list: string[], setList: (v: string[]) => void, item: string) => {
      setList(
        list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
      );
    },
    []
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit("Service Request", {
        firstName,
        lastName,
        email,
        phone,
        residenceType,
        requestedDate,
        serviceCategories,
        description,
      });
    },
    [
      handleSubmit,
      firstName,
      lastName,
      email,
      phone,
      residenceType,
      requestedDate,
      serviceCategories,
      description,
    ]
  );

  return (
    <>
      <section className="section" data-wf-class="section">
        <div className="form-page__container">
          <h2 className="form-page__heading">Service Call</h2>
          <p className="form-page__subtext">
            Are you an Existing Client and need one of our technicians to stop
            by your home or business? Fill out the form below to schedule a
            visit.
          </p>

          {status === "success" ? (
            <div className="form__success" data-wf-class="w-form-done">
              <p>Thank you! Your submission has been received!</p>
              <a href="/" className="button is--outline is--dark">
                Back to the homepage
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="form__wrapper">
              {/* About you */}
              <h3 className="form__section-heading">About you</h3>

              <div className="form__row">
                <div className="form__field-half">
                  <label className="form__label">First Name</label>
                  <input
                    className="form__input"
                    type="text"
                    name="First-Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={256}
                  />
                </div>
                <div className="form__field-half">
                  <label className="form__label">Last Name</label>
                  <input
                    className="form__input"
                    type="text"
                    name="Last-Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={256}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__field-half">
                  <label className="form__label">Email Address</label>
                  <input
                    className="form__input"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="address@email.com"
                    required
                    maxLength={256}
                  />
                </div>
                <div className="form__field-half">
                  <label className="form__label">Phone Number</label>
                  <input
                    className="form__input"
                    type="tel"
                    name="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(213) 123-4567"
                    maxLength={256}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__field-half">
                  <label className="form__label">I live here...</label>
                  <select
                    className="form__select"
                    name="I-live-here"
                    value={residenceType}
                    onChange={(e) => setResidenceType(e.target.value)}
                  >
                    <option value="">Select one...</option>
                    {RESIDENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form__field-half">
                  <label className="form__label">
                    If seasonally, please request a date:
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    name="Requested-date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    placeholder="11/20/2022"
                    maxLength={256}
                  />
                </div>
              </div>

              {/* Service categories */}
              <label className="form__label" style={{ marginTop: "24px" }}>
                What can we fix for you?
              </label>
              <div className="form__checkbox-grid">
                {SERVICE_CATEGORIES.map((item) => (
                  <label key={item} className="form__checkbox-label">
                    <input
                      type="checkbox"
                      className="form__checkbox"
                      checked={serviceCategories.includes(item)}
                      onChange={() =>
                        toggleCheckbox(
                          serviceCategories,
                          setServiceCategories,
                          item
                        )
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Description */}
              <div style={{ marginTop: "24px" }}>
                <label className="form__label">
                  Please give us a brief description about the service needed:
                </label>
                <textarea
                  className="form__textarea"
                  name="Anything-else"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Turnstile + Submit */}
              <Turnstile ref={turnstileRef} onVerify={setTurnstileToken} />

              <button
                type="submit"
                className="button is--outline is--dark form-submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Submitting..." : "Submit"}
              </button>

              {status === "error" && (
                <div className="form__error" data-wf-class="w-form-fail">
                  <p>
                    {errorMessage ||
                      "Oops! Something went wrong while submitting the form."}
                  </p>
                  <button
                    type="button"
                    className="button is--outline is--dark"
                    onClick={() => reset(() => turnstileRef.current?.reset())}
                    style={{ marginTop: "12px" }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
