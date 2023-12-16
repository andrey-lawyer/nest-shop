export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number | string;
      API_HOST: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT_DB: number;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB: string;
      PRIVATE_KEY: string;
      MAIL_HOST: string;
      MAIL_USER: string;
      MAIL_PASSWORD: string;
      BASE_URL_FRONT: string;
      PORT_SMTP: string;
    }
  }
}
