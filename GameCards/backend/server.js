import express from 'express';
import cors from 'cors';
import { askLlama } from './llamaAdapter.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/ai', async (req, res) => {
  const { prompt } = req.body;
  const risposta = await askLlama(prompt);
  res.json({ risposta });
});

app.get("/ping", (req, res)=> {
    res.json({status: "ok", message: "BackEnd AI Attivo"});
});

app.listen(PORT, () => {
  console.log(`🟢 AI server attivo su http://localhost:${PORT}`);
});
