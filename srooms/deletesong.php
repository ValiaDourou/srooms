<?php
session_start();
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "12345";
$con =mysqli_connect($dbhost, $dbuser, $dbpass,"thingsboardSongs") or die("Connect failed: %s\n". $con -> error);

$s = $_POST['s'];
$shop = mysqli_query($con, "DELETE FROM songs WHERE id=$s");


?>