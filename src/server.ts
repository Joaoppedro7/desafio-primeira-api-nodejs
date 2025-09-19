import { server } from "./app.ts";
import { execSync } from "child_process";

// Run migrations on startup
async function runMigrations() {
  try {
    console.log("Running database migrations...");
    execSync("npx drizzle-kit migrate", { stdio: "inherit" });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    // Don't exit the process, let the app start anyway
    console.log("Continuing without migrations...");
  }
}

// Run migrations and then start the server
runMigrations().then(() => {
  server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
    console.log("HTTP Server running!");
  });
});
