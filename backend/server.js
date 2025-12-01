import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GET /api/cuper - Hämta alla cuper
app.get('/api/cuper', async (req, res) => {
  try {
    const dataPath = join(__dirname, '..', 'cuper_2026_data.json');
    const data = await readFile(dataPath, 'utf-8');
    const cuper = JSON.parse(data);
    res.json(cuper);
  } catch (error) {
    console.error('Fel vid läsning av data:', error);
    res.status(500).json({ error: 'Kunde inte läsa cupdata' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API:t körs på http://localhost:${PORT}`);
  console.log(`📊 Testa: http://localhost:${PORT}/api/cuper`);
});
