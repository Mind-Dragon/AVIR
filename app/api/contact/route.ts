import { NextRequest, NextResponse } from "next/server";
import { ServerClient } from "postmark";

/* ------------------------------------------------------------------ */
/*  Cloudflare Turnstile verification                                  */
/* ------------------------------------------------------------------ */

/**
 * Cloudflare-provided test secret key that always passes validation.
 * @see https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
const TURNSTILE_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret =
    process.env.TURNSTILE_SECRET_KEY || TURNSTILE_TEST_SECRET_KEY;
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn(
      "TURNSTILE_SECRET_KEY is not set — using Cloudflare test secret. " +
      "Set this env var in your deployment for real bot protection."
    );
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  );

  const data = (await res.json()) as { success: boolean };
  return data.success;
}

/* ------------------------------------------------------------------ */
/*  Build a clean, readable email body from the submitted fields       */
/* ------------------------------------------------------------------ */

function formatEmailBody(
  formType: string,
  fields: Record<string, unknown>
): string {
  const lines: string[] = [`Form: ${formType}`, ""];

  for (const [key, value] of Object.entries(fields)) {
    /* Skip internal / meta fields */
    if (key === "formType" || key === "turnstileToken") continue;

    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

    if (Array.isArray(value)) {
      lines.push(`${label}: ${value.join(", ")}`);
    } else if (value !== undefined && value !== null && value !== "") {
      lines.push(`${label}: ${String(value)}`);
    }
  }

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                       */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const {
      formType,
      turnstileToken,
      firstName,
      lastName,
    } = body as Record<string, string>;

    /* --- Validate required fields --------------------------------- */
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Bot verification is required." },
        { status: 400 }
      );
    }

    if (!formType) {
      return NextResponse.json(
        { error: "Form type is required." },
        { status: 400 }
      );
    }

    /* --- Verify Turnstile token ----------------------------------- */
    const valid = await verifyTurnstile(turnstileToken);
    if (!valid) {
      return NextResponse.json(
        { error: "Bot verification failed. Please try again." },
        { status: 400 }
      );
    }

    /* --- Send email via Postmark ---------------------------------- */
    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
    if (!postmarkToken) {
      console.error("POSTMARK_SERVER_TOKEN is not configured");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const client = new ServerClient(postmarkToken);

    const name = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";
    const subject = `[${formType}] — New Inquiry from ${name}`;
    const textBody = formatEmailBody(formType, body);

    await client.sendEmail({
      From: "noreply@avir.com",
      To: "service@avir.com",
      Subject: subject,
      TextBody: textBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
