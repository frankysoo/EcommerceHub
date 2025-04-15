import express, { Express } from "express";
import { createServer } from "vite";
import path from "path";
import fs from "fs";

export async function setupVite(app: Express) {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // If the request is for an API route, skip
      if (url.startsWith("/api")) {
        return next();
      }

      // Read index.html
      let template = fs.readFileSync(
        path.resolve("client/index.html"),
        "utf-8"
      );

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      // Send the transformed HTML back
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const staticPath = path.resolve("client/dist");

  app.use(express.static(staticPath));

  app.use("*", (req, res, next) => {
    // If the request is for an API route, skip
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }

    // Otherwise, serve the index.html for client-side routing
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

export function log(message: string) {
  console.log(`[server] ${message}`);
}
