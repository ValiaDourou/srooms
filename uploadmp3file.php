<?php
    $currentDir = getcwd();
    $uploadDirectory = "./songs/";
    $d='songs/';

    $errors = 0; 

    $fileExtensions = ['mp3']; 

    $fileName = $_FILES['mymp3file']['name'];
    $fileTmpName  = $_FILES['mymp3file']['tmp_name'];
    $fileType = $_FILES['mymp3file']['type'];
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

    $uploadPath = $currentDir . $uploadDirectory . basename($fileName); 

$arr = array();

if (isset($fileName)) {

    if (! in_array($fileExtension,$fileExtensions)) {
    }
    else{
        $didUpload = move_uploaded_file($fileTmpName, $uploadPath);
        if ($didUpload) {
         $arr[] = $d . basename($fileName); 
        } 
   }
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
}
    
?>