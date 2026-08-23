const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// ======================== MIDDLEWARE ========================
app.use(cors());
app.use(express.json());

// ======================== ROUTE ROOT ========================
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>🦅 AirDroid Clone</title>
        <style>
            body { background: #0a0a1a; color: #fff; font-family: Arial; padding: 40px; text-align: center; }
            .container { max-width: 600px; margin: auto; background: #1a1a2e; padding: 30px; border-radius: 10px; }
            h1 { color: #00ff88; }
            a { color: #00ff88; text-decoration: none; display: inline-block; margin: 10px; padding: 10px 20px; border: 1px solid #00ff88; border-radius: 5px; }
            a:hover { background: #00ff88; color: #000; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
        </head>
        <body>
            <div class="container">
                <h1>🦅 AirDroid Clone</h1>
                <p>✅ Server berjalan dengan baik.</p>
                <p><a href="/admin">🎫 Panel Admin</a></p>
                <p><a href="/api/packages">📦 Lihat Paket</a></p>
                <hr><p class="footer">Backend by Ragnaroks — 2026</p>
            </div>
        </body>
        </html>
    `);
});

// ======================== ROUTE ADMIN ========================
app.get('/admin', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>🦅 AirDroid Clone — Admin Panel</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #0a0a1a; color: #fff; font-family: Arial; padding: 20px; }
            .container { max-width: 800px; margin: auto; }
            h1 { color: #00ff88; margin-bottom: 20px; text-align: center; }
            .card { background: #1a1a2e; padding: 20px; border-radius: 10px; margin: 10px 0; }
            .card h3 { margin-bottom: 10px; color: #00ff88; }
            .btn { background: #00ff88; color: #000; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
            .btn:hover { background: #00cc66; }
            input, select { background: #0d0d1a; color: #fff; padding: 10px; border: 1px solid #333; border-radius: 5px; width: 100%; margin: 5px 0; }
            .result { margin-top: 10px; padding: 10px; border-radius: 5px; }
            .success { color: #00ff88; }
            .error { color: #ff4444; }
            .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
            .package-list { display: flex; flex-wrap: wrap; gap: 10px; }
            .package-item { background: #0d0d1a; padding: 10px 15px; border-radius: 5px; border: 1px solid #333; flex: 1; min-width: 150px; }
            .package-item .price { color: #00ff88; font-weight: bold; }
        </style>
        </head>
        <body>
            <div class="container">
                <h1>🦅 AirDroid Clone — Admin Panel</h1>
                <div class="card">
                    <h3>📦 Daftar Paket</h3>
                    <div id="packages" class="package-list">Loading...</div>
                </div>
                <div class="card">
                    <h3>🎫 Generate Kode Akses</h3>
                    <input id="deviceName" placeholder="Nama Device" value="Device-1">
                    <select id="packageSelect">
                        <option value="3hari">Paket 3 Hari — Rp 35.000</option>
                        <option value="1minggu">Paket 1 Minggu — Rp 55.000</option>
                        <option value="10hari">Paket 10 Hari — Rp 150.000</option>
                        <option value="1bulan">Paket 1 Bulan — Rp 150.000</option>
                    </select>
                    <button class="btn" onclick="generateCode()">🔑 Generate Kode</button>
                    <div id="result" class="result"></div>
                </div>
                <div class="card">
                    <h3>🎁 Generate Kode Gratis (Admin Only)</h3>
                    <input id="freeName" placeholder="Nama Device" value="Gratis-1">
                    <input id="adminKey" placeholder="Admin Key" type="password">
                    <button class="btn" onclick="generateFree()">🎁 Generate Gratis</button>
                    <div id="freeResult" class="result"></div>
                </div>
                <div class="footer">🔐 Gunakan key admin: <strong>LOLO10</strong> untuk generate kode gratis.<br>Backend by Ragnaroks — 2026</div>
            </div>
            <script>
                const API = window.location.origin;
                async function loadPackages() {
                    try {
                        const res = await fetch(API + '/api/packages');
                        const data = await res.json();
                        if (data.success) {
                            document.getElementById('packages').innerHTML = data.packages.map(p =>
                                '<div class="package-item">' + p.name + '<br><span class="price">Rp ' + p.price + '</span> (' + p.duration + ' hari)</div>'
                            ).join('');
                        }
                    } catch(e) {
                        document.getElementById('packages').innerHTML = '❌ Gagal memuat paket';
                    }
                }
                async function generateCode() {
                    const name = document.getElementById('deviceName').value || 'Device';
                    const packageId = document.getElementById('packageSelect').value;
                    const result = document.getElementById('result');
                    result.innerHTML = '⏳ Memproses...';
                    result.className = 'result';
                    try {
                        const res = await fetch(API + '/api/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, packageId })
                        });
                        const data = await res.json();
                        if (data.success) {
                            result.innerHTML = '✅ Kode: <strong>' + data.code + '</strong><br>📦 ' + data.package + '<br>⏳ Expired: ' + new Date(data.expired).toLocaleDateString();
                            result.className = 'result success';
                        } else {
                            result.innerHTML = '❌ ' + data.message;
                            result.className = 'result error';
                        }
                    } catch(e) {
                        result.innerHTML = '❌ Gagal terhubung ke server';
                        result.className = 'result error';
                    }
                }
                async function generateFree() {
                    const name = document.getElementById('freeName').value || 'Gratis';
                    const adminKey = document.getElementById('adminKey').value;
                    const result = document.getElementById('freeResult');
                    result.innerHTML = '⏳ Memproses...';
                    result.className = 'result';
                    try {
                        const res = await fetch(API + '/api/admin/generate-free', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, adminKey })
                        });
                        const data = await res.json();
                        if (data.success) {
                            result.innerHTML = '🎁 Kode Gratis: <strong>' + data.code + '</strong><br>⏳ Expired: ' + new Date(data.expired).toLocaleDateString();
                            result.className = 'result success';
                        } else {
                            result.innerHTML = '❌ ' + data.message;
                            result.className = 'result error';
                        }
                    } catch(e) {
                        result.innerHTML = '❌ Gagal terhubung ke server';
                        result.className = 'result error';
                    }
                }
                loadPackages();
            </script>
        </body>
        </html>
    `);
});

// ======================== DATABASE & API ========================
const DB_FILE = './data.json';

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
        return { 
            codes: [], 
            devices: [], 
            payments: [],
            packages: [
                { id: '3hari', name: 'Paket 3 Hari', price: 35000, duration: 3 },
                { id: '1minggu', name: 'Paket 1 Minggu', price: 55000, duration: 7 },
                { id: '10hari', name: 'Paket 10 Hari', price: 150000, duration: 10 },
                { id: '1bulan', name: 'Paket 1 Bulan', price: 150000, duration: 30 }
            ]
        };
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpiry(durationDays) {
    const now = new Date();
    now.setDate(now.getDate() + durationDays);
    return now.toISOString();
}

// API: Register
app.post('/api/register', (req, res) => {
    const { name, packageId, isFree = false } = req.body;
    const db = readDB();
    const pkg = db.packages.find(p => p.id === packageId);
    if (!pkg && !isFree) {
        return res.json({ success: false, message: 'Paket tidak ditemukan' });
    }
    let duration, price, packageName;
    if (isFree) {
        duration = 3650;
        price = 0;
        packageName = 'Gratis Khusus';
    } else {
        duration = pkg.duration;
        price = pkg.price;
        packageName = pkg.name;
    }
    const code = generateCode();
    const expired = getExpiry(duration);
    db.codes.push({ code, deviceName: name, package: packageName, price, duration, expired, used: false, created: new Date().toISOString() });
    writeDB(db);
    res.json({ success: true, code, package: packageName, expired, price });
});

// API: Validate
app.post('/api/validate', (req, res) => {
    const { code } = req.body;
    const db = readDB();
    const found = db.codes.find(c => c.code === code);
    if (!found) return res.json({ success: false, message: 'Kode tidak ditemukan' });
    if (found.used) return res.json({ success: false, message: 'Kode sudah digunakan' });
    const now = new Date();
    const expiredDate = new Date(found.expired);
    if (expiredDate < now) {
        return res.json({ success: false, message: 'Kode expired!', expired: true });
    }
    found.used = true;
    writeDB(db);
    res.json({ success: true, deviceName: found.deviceName, package: found.package, expired: found.expired, price: found.price });
});

// API: Packages
app.get('/api/packages', (req, res) => {
    const db = readDB();
    res.json({ success: true, packages: db.packages });
});

// API: Admin Generate Free
app.post('/api/admin/generate-free', (req, res) => {
    const { name, adminKey } = req.body;
    if (adminKey !== 'LOLO10') {
        return res.json({ success: false, message: 'Admin key salah!' });
    }
    const db = readDB();
    const code = generateCode();
    const expired = getExpiry(3650);
    db.codes.push({ code, deviceName: name || 'Gratis Khusus', package: 'Gratis Khusus (Lifetime)', price: 0, duration: 3650, expired, used: false, created: new Date().toISOString(), isFree: true });
    writeDB(db);
    res.json({ success: true, code, expired });
});

// ======================== STATIC FILES ========================
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// ======================== START SERVER ========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('🦅 Server berjalan di port ' + PORT);
});
