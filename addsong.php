<?php
session_start();

if (isset($_POST['a']) && isset($_POST['s']) && isset($_POST['mp']) && isset($_POST['im'])) {
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "12345";
    $con =mysqli_connect($dbhost, $dbuser, $dbpass,"thingsboardSongs") or die("Connect failed: %s\n". $con -> error);
    $song = $_POST['s'];
    $artist = $_POST['a'];
    $mp3 = $_POST['mp'];
    $image = $_POST['im'];


    $mp3 = str_replace("'","\'",$mp3);
    $image = str_replace("'","\'",$image);
    $song = str_replace("'","\'",$song);
    $artist = str_replace("'","\'",$artist);
    
    $createsong=mysqli_query($con,"INSERT INTO songs VALUES(NULL,'$song','$artist','$image','$mp3')");
    $check=mysqli_query($con,"SELECT * from songs where song='$song'");
    $arr = array();

    if(mysqli_num_rows($check) > 0){
        $arr[]=0;
    }
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);

}

?>