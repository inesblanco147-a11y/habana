/// <reference types="vite/client" />

// Declaración global de gtag (Google Ads / Analytics)
interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
}
