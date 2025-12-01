import { readFile } from 'fs/promises';
import { join } from 'path';

// Vercel serverless function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // Health check
  if (pathname === '/api/health') {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
    return;
  }

  // Get cuper data
  if (pathname === '/api/cuper') {
    try {
      const dataPath = join(process.cwd(), 'cuper_2026_data.json');
      const data = await readFile(dataPath, 'utf-8');
      const cuper = JSON.parse(data);
      res.status(200).json(cuper);
    } catch (error) {
      console.error('Fel vid läsning av data:', error);
      res.status(500).json({ error: 'Kunde inte läsa cupdata' });
    }
    return;
  }

  // 404 for other routes
  res.status(404).json({ error: 'Not found' });
}
