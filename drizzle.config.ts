import { defineConfig } from "drizzle-kit";

// Using a dummy URL since we're using in-memory storage
const dummyDbUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dummyDbUrl,
  },
});
