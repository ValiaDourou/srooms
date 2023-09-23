<?php
session_start();

$arr = array();
if (isset($_SESSION['uid'])){
    $arr[] = 0;
}else{
    $arr[] = 1;
}

echo json_encode($arr, JSON_UNESCAPED_UNICODE);

?>