/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_FORM_ENDPOINT_LEADS?: string;
  readonly VITE_FORM_ENDPOINT_CLIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
