const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// URL de tu Web App de Google Apps Script
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyGFVbo_FHi9YWavcwQsWVFocyFROvkgdN6bv7OixsD5NGZs5HsrK_95g60NWMfLN08/exec';

// Ruta Puente (Proxy API) para conectar la app web con Google Sheets
app.post('/api/execute', async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error de comunicación con Google Sheets:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno en el proxy de conexión' });
  }
});

// Redirigir cualquier otra solicitud al frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});