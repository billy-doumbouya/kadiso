import { config } from "dotenv";
config();

async function main() {
  const { initDatabase } = await import("../src/lib/db");
  await initDatabase();
  console.log("Base Turso initialisee et seedee avec succes");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erreur lors de l'initialisation :", err);
    process.exit(1);
  });