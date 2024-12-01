import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
const __dirname = path.resolve();
app.use(express.json());

// Proxy route for popular movies
app.get("/api/movies/popular", async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/movie/popular?api_key=${process.env.API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data.results);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

// Proxy route for searching movies
app.get("/api/movies/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/search/movie?api_key=${
        process.env.API_KEY
      }&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    res.status(200).json(data.results);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({ error: "Failed to search movies" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
