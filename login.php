<?php
session_start();

$user = 'admin';
$pass = '123456';

if ($_POST['username'] == $user && $_POST['password'] == $pass) {
    $_SESSION['login'] = true;
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login Panel RAT</title>
    <style>
        body { font-family: Arial; background: #0d1117; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .box { background: #161b22; padding: 40px; border-radius: 10px; width: 300px; }
        input { width: 100%; padding: 10px; margin: 10px 0; background: #0d1117; border: 1px solid #30363d; color: #fff; border-radius: 5px; }
        button { width: 100%; padding: 10px; background: #238636; border: none; color: #fff; border-radius: 5px; cursor: pointer; }
        h2 { text-align: center; }
    </style>
</head>
<body>
    <div class="box">
        <h2>🔐 Login Panel</h2>
        <form method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>
