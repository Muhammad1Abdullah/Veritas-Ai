import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { runVerificationPipeline } from "./server/pipeline/orchestrator.js";
import { SAMPLE_CLAIMS } from "./server/sampleData.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // --------------------------------------------------------------------------
  // API ROUTES
  // --------------------------------------------------------------------------
  
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "Fake News & Misinformation Detector",
      timestamp: new Date().toISOString(),
    });
  });

  // Sample claims for instant testing
  app.get("/api/samples", (_req, res) => {
    res.json({
      samples: SAMPLE_CLAIMS,
    });
  });

  // Multi-stage verification endpoint
  app.post("/api/verify", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({
          error: "Please provide a headline, claim, or article text to verify.",
        });
      }

      if (text.trim().length > 5000) {
        return res.status(400).json({
          error: "Text exceeds maximum character limit of 5,000 characters.",
        });
      }

      const result = await runVerificationPipeline(text.trim());
      return res.json(result);
    } catch (error: any) {
      console.error("Verification pipeline error:", error);
      return res.status(500).json({
        error: error.message || "An unexpected error occurred during the verification pipeline.",
      });
    }
  });

  // --------------------------------------------------------------------------
  // VITE & STATIC SERVING
  // --------------------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fake News Detector Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
