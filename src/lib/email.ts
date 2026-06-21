"use client";

import emailjs from "@emailjs/browser";

/**
 * Every form on the site sends through EmailJS, as required by the PRD (§6).
 * Set these three values in your .env.local — see README.md.
 *   NEXT_PUBLIC_EMAILJS_SERVICE_ID
 *   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
 *   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
 *
 * Until those are configured, sendEmail() resolves successfully but only
 * logs the payload to the console, so every form can be built and tested
 * end-to-end before EmailJS credentials exist.
 */
export async function sendEmail(templateParams: Record<string, unknown>) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.info("[EmailJS] Identifiants manquants — message simulé :", templateParams);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { simulated: true };
  }

  return emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
