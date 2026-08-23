// ============================================
// SERVER NODE.JS — GRATIS (Render/Railway)
// ============================================
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Database memory (gratis, pake JSON file)
const fs = require('fs');
const DB_FILE = './data.json';

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch { return { devices: [], codes: [] }; }
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generate kode akses 6 digit
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// API: Register device (buat kode akses baru)
app.post('/api/register', (req, res) => {
    const { name } = req.body;
    const db = readDB();
    const code = generateCode();
    db.devices.push({ name, code, ip: req.ip, created: new Date() });
    db.codes.push({ code, used: false });
    writeDB(db);
    res.json({ success: true, code });
});

// API: Validasi kode akses
app.post('/api/validate', (req, res) => {
    const { code } = req.body;
    const db = readDB();
    const found = db.codes.find(c => c.code === code && !c.used);
    if (found) {
        found.used = true;
        writeDB(db);
        res.json({ success: true, device: db.devices.find(d => d.code === code) });
    } else {
        res.json({ success: false });
    }
});

// API: Daftar perangkat
app.get('/api/devices', (req, res) => {
    const db = readDB();
    res.json({ devices: db.devices });
});

// WebSocket
wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        wss.clients.forEach(c => {
            if (c !== ws && c.readyState === WebSocket.OPEN) c.send(msg);
        });
    });
});

// Static files
app.use(express.static('public'));

server.listen(process.env.PORT || 8080, () => {
    console.log('🦅 Server gratis berjalan di port', process.env.PORT || 8080);
});
