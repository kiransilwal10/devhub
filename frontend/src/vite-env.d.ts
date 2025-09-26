/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string; // make it optional so the fallback "/api" is valid
  // add other VITE_* vars here if you need them later
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


