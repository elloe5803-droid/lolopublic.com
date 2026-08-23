<?php  
$user = 'admin';  
$pass = '123456';  
  
if ($_POST['username'] == $user && $_POST['password'] == $pass) {  
    session_start();  
    $_SESSION['login'] = true;  
    header('Location: dashboard.php');  
    exit;  
}  
?>  
<!DOCTYPE html>  
<html>  
<head><title>Login Panel</title></head>  
<body>  
    <h2>Login Panel RAT</h2>  
    <form method="POST">  
        <input type="text" name="username" placeholder="Username"><br>  
        <input type="password" name="password" placeholder="Password"><br>  
        <button type="submit">Login</button>  
    </form>  
</body>  
</html>  
