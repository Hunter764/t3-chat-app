// Runs once when the server starts. Opening the database connection here means the first
// visitor doesn't pay for the Prisma engine start-up and the TLS handshake.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { default: db } = await import("@/lib/db");
  await db.$connect().catch((error) => {
    console.warn("Database warm-up failed (it will retry on first use):", error.message);
  });
}
