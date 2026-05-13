import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database Connection Configuration
  // Note: These should be provided via environment variables in AI Studio Secrets
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cars_db',
  };

  let connection: mysql.Connection | null = null;

  async function getDb() {
    if (!connection) {
      try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL");
        
        // Initialize table if it doesn't exist for demo purposes
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS cars (
            id INT AUTO_INCREMENT PRIMARY KEY,
            make VARCHAR(255) NOT NULL,
            model VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            description TEXT,
            image_url VARCHAR(500)
          )
        `);

        // Check if empty and seed some data if so
        const [rows]: any = await connection.execute("SELECT COUNT(*) as count FROM cars");
        if (rows[0].count === 0) {
          await connection.execute(`
            INSERT INTO cars (make, model, year, description, image_url) VALUES 
            ('Tesla', 'Model 3', 2024, 'All-electric sedan with cutting-edge technology.', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'),
            ('Porsche', '911 Carrera', 2024, 'The iconic sports car that defines precision handling.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'),
            ('BMW', 'i4', 2024, 'The ultimate electric driving machine.', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800')
          `);
        }
      } catch (err) {
        console.error("Database connection failed. Falling back to mock data for preview.", err);
      }
    }
    return connection;
  }

  // API Routes
  app.get("/api/cars", async (req, res) => {
    try {
      const db = await getDb();
      if (db) {
        const [rows] = await db.execute("SELECT * FROM cars");
        res.json(rows);
      } else {
        // Fallback mock data if DB isn't configured/reachable in this environment
        res.json([
          { id: 1, make: 'Tesla', model: 'Model 3', year: 2024, description: 'Mock: All-electric sedan.', image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800' },
          { id: 2, make: 'Porsche', model: '911 Carrera', year: 2024, description: 'Mock: The iconic sports car.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800' }
        ]);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cars" });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
