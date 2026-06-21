import { config } from "dotenv";
config();

async function main() {
  const { createClient } = await import("@libsql/client");
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const res = await db.execute("SELECT id, email, password_hash, name FROM admin_users");
  console.log(JSON.stringify(res.rows, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erreur:", err);
    process.exit(1);
  });