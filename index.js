const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>🦅 Panel RAT Aktif</h1>
        <p>Selamat datang, Tuan Anzz.</p>
        <p>Server berjalan dengan baik.</p>
        <hr>
        <p><a href="/login">Login</a></p>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
        <h2>🔐 Login Panel</h2>
        <form method="POST" action="/dashboard">
            <input type="text" name="user" placeholder="Username"><br>
            <input type="password" name="pass" placeholder="Password"><br>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/dashboard', (req, res) => {
    res.send('<h2>✅ Dashboard</h2><p>Login berhasil.</p>');
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
