import { initDatabase } from "@/lib/db";

async function main() {
  await initDatabase();
  console.log("✅ Base Turso initialisée et seedée avec succès");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Erreur lors de l'initialisation :", err);
    process.exit(1);
  });