"use client";

import { useState, useCallback } from "react";

interface CareerApplicationFormProps {
  positionTitle: string;
}

export default function CareerApplicationForm({
  positionTitle,
}: CareerApplicationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Placeholder — form submission logic will be added in a future phase (HEI-251 pattern)
      setFormState("success");
    },
    []
  );

  return (
    <>
      {/* Apply CTA Section */}
      <div className="section" data-wf-class="section">
        <div className="container">
          <h2>Apply</h2>
          <p className="is--spaced-around">
            Apply online for this position now.
          </p>
          <button
            type="button"
            className="button"
            data-wf-class="button w-button"
            onClick={handleOpen}
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {isOpen && (
        <div
          className="career-modal-wrap is--visible"
          data-wf-class="career-modal-wrap"
        >
          <div
            className="modal-outer-close"
            onClick={handleClose}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleClose();
            }}
          />
          <div className="model-box">
            <button
              type="button"
              className="modal-close"
              onClick={handleClose}
              aria-label="Close application form"
            />
            <h2 className="is--inline-2">Apply for </h2>
            <h2 className="is--inline-2">{positionTitle}</h2>

            {formState === "idle" && (
              <form
                name="career-form"
                className="career-form"
                onSubmit={handleSubmit}
              >
                <div className="col-wrapper-2">
                  <div className="col-50-2">
                    <input
                      type="hidden"
                      name="position-applied-for"
                      value={positionTitle}
                    />
                    <label htmlFor="career-first-name">First name*</label>
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="First-Name"
                      type="text"
                      id="career-first-name"
                      required
                    />
                    <label htmlFor="career-last-name">Last name*</label>
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="Last-Name"
                      type="text"
                      id="career-last-name"
                      required
                    />
                    <label htmlFor="career-email">Email address*</label>
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="email"
                      type="email"
                      id="career-email"
                      required
                    />
                    <label htmlFor="career-phone-code">Phone number*</label>
                    <div className="col-wrapper-2 tablet-switch is--tight">
                      <div className="col-25-2">
                        <div className="small-descriptor">Area code</div>
                        <input
                          className="form-input is--inline is--countrycode"
                          data-wf-class="form-input is--inline is--countrycode w-input"
                          maxLength={256}
                          name="Phone-Country-Code"
                          placeholder="(213)"
                          type="text"
                          id="career-phone-code"
                          required
                        />
                      </div>
                      <div className="col-75">
                        <div className="small-descriptor">Number</div>
                        <input
                          className="form-input is--inline"
                          data-wf-class="form-input is--inline w-input"
                          maxLength={256}
                          name="Mobile-Number"
                          placeholder="321-1234"
                          type="text"
                          id="career-phone-number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-50-2">
                    <label htmlFor="career-address">Address*</label>
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="Street-Address"
                      placeholder="Street Address"
                      type="text"
                      id="career-address"
                      required
                    />
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="Address-Line-2"
                      placeholder="Address Line 2"
                      type="text"
                      id="career-address-2"
                    />
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="City"
                      placeholder="City"
                      type="text"
                      id="career-city"
                      required
                    />
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="Post-Code"
                      placeholder="Zip Code"
                      type="text"
                      id="career-zip"
                      required
                    />
                    <label htmlFor="career-start-date">
                      Available start date*
                    </label>
                    <input
                      className="form-input"
                      data-wf-class="form-input w-input"
                      maxLength={256}
                      name="Available-From"
                      type="date"
                      id="career-start-date"
                      required
                    />
                    <label htmlFor="career-cv">CV Upload*</label>
                    <div className="cv-upload-wrap">
                      <input
                        className="cv-upload"
                        accept=".ai,.doc,.docx,.indd,.key,.numbers,.pps,.ppt,.pptx,.psd,.ods,.odt,.odp,.pages,.pdf,.txt,.xls,.xlsx"
                        name="File-cv"
                        type="file"
                        id="career-cv"
                        required
                      />
                      <div className="cv-upload-label">Upload File</div>
                      <div className="small-descriptor">
                        Max file size 10MB.
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="button career-form__submit"
                  data-wf-class="button w-button"
                >
                  Submit Application
                </button>
              </form>
            )}

            {formState === "success" && (
              <div className="career-form__success" data-wf-class="w-form-done">
                <div>
                  We thank you for your application and your interest shown in
                  our Company.
                  <br />
                  <br />
                  Your application will be reviewed and should your experience
                  and qualifications match our requirements then someone from our
                  recruitment team will contact you.
                  <br />
                  <br />
                  Please note we hold your file on our systems for 6 months. A
                  copy of our Privacy policy can be found here.
                </div>
              </div>
            )}

            {formState === "error" && (
              <div className="career-form__error" data-wf-class="w-form-fail">
                <div>
                  Oops! Something went wrong while submitting the form.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
