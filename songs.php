<?php
session_start();
 $dbhost = "localhost";
 $dbuser = "root";
 $dbpass = "12345";
 $con =mysqli_connect($dbhost, $dbuser, $dbpass,"thingsboardSongs") or die("Connect failed: %s\n". $con -> error);

 $songs = mysqli_query($con, "SELECT * FROM songs");
 $arr = array();
 if (mysqli_num_rows($songs) > 0) {
    while ($h = mysqli_fetch_assoc($songs)) {
        $arr[]=$h;
    }
 }

 echo json_encode($arr, JSON_UNESCAPED_UNICODE);

   
?>