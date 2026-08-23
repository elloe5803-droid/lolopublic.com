const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

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

// REGISTER
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

// VALIDATE
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

// PACKAGES
app.get('/api/packages', (req, res) => {
    const db = readDB();
    res.json({ success: true, packages: db.packages });
});

// ADMIN: GENERATE FREE CODE
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

app.use(express.static('public'));
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.listen(PORT, () => console.log(`🦅 Server di port ${PORT}`));
