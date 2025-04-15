import { Express } from "express";
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

export function serveStatic(req: any, res: any, next: any) {
  const staticPath = path.resolve("client/dist");
  const filePath = path.join(staticPath, req.url);

  // If the file exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }

  // Otherwise, serve the index.html for client-side routing
  if (!req.url.startsWith("/api")) {
    return res.sendFile(path.join(staticPath, "index.html"));
  }

  next();
}

export function log(message: string) {
  console.log(`[server] ${message}`);
}
