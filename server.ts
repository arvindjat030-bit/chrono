import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Stripe Payment Intent (Mock for now, requires STRIPE_SECRET_KEY)
  app.post("/api/create-payment-intent", async (req, res) => {
    const { amount, currency } = req.body;
    try {
      // In a real app, use stripe.paymentIntents.create
      // const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
      // res.send({ clientSecret: paymentIntent.client_secret });
      
      // Mocking for demo purposes if key is missing
      res.json({ clientSecret: "mock_secret_" + Math.random().toString(36).substring(7) });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ChronoLux Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
