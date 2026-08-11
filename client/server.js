import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use dynamic PORT from environment, fallback to 3000
const PORT = process.env.PORT || 3000;

// Serve the static files from the React dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: Any unhandled request is routed to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Explicitly bind to 0.0.0.0 to ensure external proxy routing works
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening strictly on 0.0.0.0:${PORT}`);
});
