declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_USER_NAME: string;
      DB_PASSWORD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
