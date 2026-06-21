import { config } from "dotenv";
const result = config();
console.log("Erreur dotenv:", result.error);
console.log("TURSO_DATABASE_URL =", process.env.TURSO_DATABASE_URL);
