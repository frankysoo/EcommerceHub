import * as schema from "./schema";

// This is a mock implementation that doesn't actually use PostgreSQL
// We're using the in-memory storage from storage.ts instead

// Create a dummy db object that won't be used
export const db = {
  query: async () => { throw new Error('Using in-memory storage instead of PostgreSQL'); },
  // Add other methods as needed
};

// No need for a real pool
export const pool = {
  end: async () => {}
};
