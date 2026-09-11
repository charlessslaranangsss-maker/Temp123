import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, relative, isAbsolute } from "node:path";
const root = resolve("dist");
const { redirects = [] } = JSON.parse(await readFile("vercel.json", "utf8"));
http
  .createServer(async (req, res) => {
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const redirect = redirects.find((rule) => rule.source === path);
    if (redirect) {
      res
        .writeHead(308, {
          Location:
            redirect.destination + new URL(req.url, "http://localhost").search,
        })
        .end();
      return;
    }
    if (path.startsWith("/api/")) {
      res
        .writeHead(503, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        })
        .end(
          JSON.stringify({
            error:
              "Local static preview. Run Vercel dev with staging credentials for inquiries.",
          }),
        );
      return;
    }
    const file = resolve(root, "." + path),
      within = relative(root, file);
    if (
      within === ".." ||
      within.startsWith("..\\") ||
      within.startsWith("../") ||
      isAbsolute(within)
    ) {
      res.writeHead(403).end();
      return;
    }
    try {
      const info = await stat(file);
      if (info.isDirectory() && !path.endsWith("/")) {
        res.writeHead(308, { Location: path + "/" }).end();
        return;
      }
      const target = info.isDirectory() ? file + "/index.html" : file;
      const data = await readFile(target);
      const types = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".svg": "image/svg+xml",
        ".xml": "application/xml",
        ".txt": "text/plain",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".webp": "image/webp",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
      };
      res
        .writeHead(200, {
          "Content-Type": types[extname(target)] || "application/octet-stream",
        })
        .end(data);
    } catch {
      res
        .writeHead(404, { "Content-Type": "text/html" })
        .end(await readFile(root + "/404.html"));
    }
  })
  .listen(4173, "0.0.0.0", () => console.log("Preview: http://localhost:4173"));
