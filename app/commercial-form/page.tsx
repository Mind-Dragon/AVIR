"use client";

import { useState, useCallback } from "react";
import Turnstile from "@/components/forms/Turnstile";
import useContactForm from "@/components/forms/useContactForm";
import FooterCTA from "@/components/layout/FooterCTA";

/* ------------------------------------------------------------------ */
/*  Option data extracted from Webflow HTML                            */
/* ------------------------------------------------------------------ */

const PROJECT_OPTIONS = [
  "I am building a new office space",
  "I am moving into an existing office space",
  "I am remodelling my commercial space",
  "I want to refresh my current system",
];

const TIMEFRAME_OPTIONS = [
  "Within the next 3 months",
  "Within the next 6 months",
  "Within the year",
  "Over 1 year away",
];

const CURRENTLY_HAVE = [
  "I don't have any existing systems",
  "Boardroom/Conference Room Automation",
  "Lighting Control",
  "Shading System",
  "In-ceiling/Room Audio",
  "Distributed Video",
  "Climate Control",
  "Security System",
  "IT Networking",
  "Video Surveillance",
];

const LEARN_MORE = [
  "Boardroom/Conference Room Automation",
  "Video Wall or Projection Systems",
  "Lighting Control",
  "Automated Window Shades",
  "In-Ceiling Lobby/Office Audio",
  "Distributed Video",
  "Security System",
  "Video Surveillance",
  "IT Networking",
  "Media Room",
];

const BUDGET_OPTIONS = [
  { label: "Select budget...", value: "" },
  { label: "$15,000 - $40,000", value: "$15,000 - $40,000" },
  { label: "$40,000 - $120,000", value: "$40,000 - $120,000" },
  { label: "$120,000 - $400,000", value: "$120,000 - $400,000" },
  { label: "$400,000 - $700,000", value: "$400,000 - $700,000" },
  { label: "$700,000 - $1million+", value: "$700,000 - $1million+" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CommercialFormPage() {
  const { status, errorMessage, setTurnstileToken, handleSubmit, reset } =
    useContactForm();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutProject, setAboutProject] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [currentlyHave, setCurrentlyHave] = useState<string[]>([]);
  const [learnMore, setLearnMore] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [anythingElse, setAnythingElse] = useState("");

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
      handleSubmit("Commercial Inquiry", {
        firstName,
        lastName,
        companyName,
        email,
        phone,
        aboutProject,
        timeframe,
        currentlyHave,
        learnMore,
        budget,
        anythingElse,
      });
    },
    [
      handleSubmit,
      firstName,
      lastName,
      companyName,
      email,
      phone,
      aboutProject,
      timeframe,
      currentlyHave,
      learnMore,
      budget,
      anythingElse,
    ]
  );

  return (
    <>
      <section className="section" data-wf-class="section">
        <div className="form-page__container">
          <h2 className="form-page__heading">
            Planning an upcoming commercial project?&#8203;
          </h2>
          <p className="form-page__subtext">
            Fill out the form below, with at least your email, and we will
            contact you at your convenience.
          </p>

          {status === "success" ? (
            <div className="form__success" data-wf-class="w-form-done">
              <p>Thank you! Your submission has been received!</p>
              <a href="/portfolio" className="button is--outline is--dark">
                Back to the Portfolio
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="form__wrapper">
              <div className="form__row">
                <div className="form__field-third">
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
                <div className="form__field-third">
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
                <div className="form__field-third">
                  <label className="form__label">Company Name</label>
                  <input
                    className="form__input"
                    type="text"
                    name="Company-Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
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
                  <label className="form__label">About the Project</label>
                  <select
                    className="form__select"
                    name="About-the-project"
                    value={aboutProject}
                    onChange={(e) => setAboutProject(e.target.value)}
                  >
                    <option value="">Select one...</option>
                    {PROJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form__field-half">
                  <label className="form__label">Timeframe</label>
                  <select
                    className="form__select"
                    name="When-is-the-planned-start"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <option value="">Select one...</option>
                    {TIMEFRAME_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Currently have checkboxes */}
              <label className="form__label" style={{ marginTop: "24px" }}>
                I currently have the following systems in my business:
              </label>
              <div className="form__checkbox-grid">
                {CURRENTLY_HAVE.map((item) => (
                  <label key={item} className="form__checkbox-label">
                    <input
                      type="checkbox"
                      className="form__checkbox"
                      checked={currentlyHave.includes(item)}
                      onChange={() =>
                        toggleCheckbox(currentlyHave, setCurrentlyHave, item)
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Learn more checkboxes */}
              <label className="form__label" style={{ marginTop: "24px" }}>
                I would like to learn more about the following for my business:
              </label>
              <div className="form__checkbox-grid">
                {LEARN_MORE.map((item) => (
                  <label key={item} className="form__checkbox-label">
                    <input
                      type="checkbox"
                      className="form__checkbox"
                      checked={learnMore.includes(item)}
                      onChange={() =>
                        toggleCheckbox(learnMore, setLearnMore, item)
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Budget */}
              <div style={{ marginTop: "24px" }}>
                <label className="form__label">
                  What is your budget for the project?
                </label>
                <select
                  className="form__select"
                  name="Project-Budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Anything else */}
              <div style={{ marginTop: "24px" }}>
                <label className="form__label">Anything else to tell us?</label>
                <textarea
                  className="form__textarea"
                  name="Anything-else"
                  value={anythingElse}
                  onChange={(e) => setAnythingElse(e.target.value)}
                />
              </div>

              {/* Turnstile + Submit */}
              <Turnstile onVerify={setTurnstileToken} />

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
                    onClick={reset}
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
