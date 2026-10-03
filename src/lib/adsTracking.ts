import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void }
}

export const STORAGE_KEY = "cookie_consent";
export const CONSENT_RECORD_KEY = "cookie_consent_record";
export const CONSENT_NOTICE_VERSION = "2026-10-02-v1";
const ADS_ID = "AW-18490094209";
const LEAD_SEND_TO = "AW-18490094209/rYnaCObSg44dEIHl4fBE";
const CONSENT_COUNTRIES = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH','CA'];
let consentRegion: Promise<boolean> | undefined;

export function isConsentRequiredRegion(): Promise<boolean> {
  return consentRegion ??= lookupConsentRegion();
}

async function lookupConsentRegion(): Promise<boolean> {
  try {
    const res = await fetch("/cdn-cgi/trace", { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return true;
    const country = (await res.text()).match(/^loc=([A-Z0-9]{2})$/m)?.[1];
    if (!country || country === "XX" || country === "T1") return true;
    return CONSENT_COUNTRIES.includes(country);
  } catch {
    return true;
  }
}

export async function hasAdConsent(): Promise<boolean> {
  return localStorage.getItem(STORAGE_KEY) === "granted";
}

export async function canTrackAds(): Promise<boolean> {
  const choice = localStorage.getItem(STORAGE_KEY);
  if (choice !== null) return choice === "granted";
  const required = await isConsentRequiredRegion();
  const latest = localStorage.getItem(STORAGE_KEY);
  return latest !== null ? latest === "granted" : !required;
}

export function updateConsent(decision: "granted" | "denied") {
  if (decision === "denied") window.gtag?.("set", "user_data", null);
  window.gtag?.("consent", "update", {
    ad_storage: decision,
    ad_user_data: decision,
    ad_personalization: decision,
  });
}

/** Persist the visitor's choice plus evidence of what they were shown. */
export function saveConsentChoice(decision: "granted" | "denied") {
  const prev = JSON.parse(localStorage.getItem(CONSENT_RECORD_KEY) || "[]");
  const record = {
    decision,
    at: new Date().toISOString(),
    notice_version: CONSENT_NOTICE_VERSION,
    purposes: ["Google Ads-måling av annonseresultater (kontaktskjema sendt)"],
    recipient: "Google Ireland Ltd. (Google Ads)",
  };
  localStorage.setItem(CONSENT_RECORD_KEY, JSON.stringify([...prev, record].slice(-10)));
  localStorage.setItem(STORAGE_KEY, decision);
  updateConsent(decision);
  if (decision === "granted") void loadGoogleAds();
  window.dispatchEvent(new Event("avargo-consent-changed"));
}

export async function loadGoogleAds() {
  const allowed = await canTrackAds();
  if (!allowed) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  updateConsent("granted");
  if (document.querySelector("script[data-google-ads]")) return;
  window.gtag("js", new Date());
  window.gtag("config", ADS_ID);
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  script.async = true;
  script.dataset.googleAds = "";
  document.head.appendChild(script);
}

export async function reportLeadConversion() {
  await loadGoogleAds();
  if (await canTrackAds()) {
    window.gtag?.("event", "conversion", { send_to: LEAD_SEND_TO });
  }
}

let installed = false;
/**
 * Every public contact/offer form submits through the "contact-submit" function.
 * Report one conversion whenever that call succeeds.
 */
export function installLeadTracking() {
  if (installed) return;
  installed = true;
  // supabase.functions returns a fresh client per access, so wrapping
  // invoke() does not stick. Watch fetch instead: every public form posts
  // to the "contact-submit" function — report a conversion on success.
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await originalFetch(input, init);
    try {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/functions/v1/contact-submit") && res.ok) void reportLeadConversion();
    } catch {
      /* never break the form */
    }
    return res;
  };
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === "granted" || e.newValue === "denied")) {
      updateConsent(e.newValue);
      if (e.newValue === "granted") void loadGoogleAds();
      window.dispatchEvent(new Event("avargo-consent-changed"));
    }
  });
  void loadGoogleAds();
}
