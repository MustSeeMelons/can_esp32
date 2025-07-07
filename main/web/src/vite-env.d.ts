/// <reference types="vite/client" />

// Dissalow unkniwn types
interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_FAKE_MESSAGES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
