<?php  
session_start();  
if (!isset($_SESSION['login'])) {  
    header('Location: login.php');  
    exit;  
}  
  
echo "<h2>Dashboard Panel RAT</h2>";  
echo "<p>Selamat datang di panel kontrol.</p>";  
echo "<pre>Server Info: " . shell_exec('uname -a') . "</pre>";  
?>  
