const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// ======================== DATABASE (JSON) ========================
const fs = require('fs');
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

// ======================== GENERATE KODE ========================
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpiry(durationDays) {
    const now = new Date();
    now.setDate(now.getDate() + durationDays);
    return now.toISOString();
}

// ======================== API: REGISTER (BUAT KODE BARU) ========================
app.post('/api/register', (req, res) => {
    const { name, packageId, isFree = false } = req.body;
    const db = readDB();
    
    // Cari paket
    const pkg = db.packages.find(p => p.id === packageId);
    if (!pkg && !isFree) {
        return res.json({ success: false, message: 'Paket tidak ditemukan' });
    }

    let duration, price, packageName;
    if (isFree) {
        duration = 3650; // 10 tahun gratis
        price = 0;
        packageName = 'Gratis Khusus';
    } else {
        duration = pkg.duration;
        price = pkg.price;
        packageName = pkg.name;
    }

    const code = generateCode();
    const expired = getExpiry(duration);

    // Simpan kode
    db.codes.push({
        code,
        deviceName: name,
        package: packageName,
        price,
        duration,
        expired,
        used: false,
        created: new Date().toISOString()
    });
    writeDB(db);

    res.json({
        success: true,
        code,
        package: packageName,
        expired,
        price
    });
});

// ======================== API: VALIDASI KODE ========================
app.post('/api/validate', (req, res) => {
    const { code } = req.body;
    const db = readDB();
    
    const found = db.codes.find(c => c.code === code);
    if (!found) {
        return res.json({ success: false, message: 'Kode tidak ditemukan' });
    }
    
    if (found.used) {
        return res.json({ success: false, message: 'Kode sudah digunakan' });
    }

    // Cek expired
    const now = new Date();
    const expiredDate = new Date(found.expired);
    if (expiredDate < now) {
        return res.json({ 
            success: false, 
            message: 'Kode expired! Silakan beli paket baru.',
            expired: true
        });
    }

    // Tandai digunakan
    found.used = true;
    writeDB(db);

    res.json({
        success: true,
        deviceName: found.deviceName,
        package: found.package,
        expired: found.expired,
        price: found.price
    });
});

// ======================== API: LIST PAKET ========================
app.get('/api/packages', (req, res) => {
    const db = readDB();
    res.json({ packages: db.packages });
});

// ======================== API: CEK STATUS KODE (UNTUK RENEW) ========================
app.post('/api/check-code', (req, res) => {
    const { code } = req.body;
    const db = readDB();
    const found = db.codes.find(c => c.code === code);
    if (!found) {
        return res.json({ success: false, message: 'Kode tidak ditemukan' });
    }
    const now = new Date();
    const expiredDate = new Date(found.expired);
    const isExpired = expiredDate < now;
    res.json({
        success: true,
        code: found.code,
        package: found.package,
        expired: found.expired,
        isExpired,
        used: found.used
    });
});

// ======================== API: GENERATE KODE GRATIS (ADMIN) ========================
app.post('/api/admin/generate-free', (req, res) => {
    const { name, adminKey } = req.body;
    if (adminKey !== 'LOLO10') {
        return res.json({ success: false, message: 'Admin key salah!' });
    }
    const db = readDB();
    const code = generateCode();
    const expired = getExpiry(3650); // 10 tahun
    db.codes.push({
        code,
        deviceName: name || 'Gratis Khusus',
        package: 'Gratis Khusus (Lifetime)',
        price: 0,
        duration: 3650,
        expired,
        used: false,
        created: new Date().toISOString(),
        isFree: true
    });
    writeDB(db);
    res.json({ success: true, code, expired });
});

// ======================== API: RIWAYAT PEMBAYARAN (UNTUK ADMIN) ========================
app.get('/api/admin/payments', (req, res) => {
    const db = readDB();
    res.json({ payments: db.payments || [] });
});

// ======================== STATIC FILES ========================
app.use(express.static('public'));

// ======================== START SERVER ========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🦅 Server berjalan di port ${PORT}`);
});
