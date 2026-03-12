/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // can add other VITE_ variables here so TS can read it
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
