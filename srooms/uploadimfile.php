<?php
    $currentDir = getcwd();
    $uploadDirectory = "./songs/";
    $d="songs/";

    $errors = 0; 

    $fileExtensions = ['jpg','jpeg','png']; 

    $fileName = $_FILES['mymimfile']['name'];
    $fileTmpName  = $_FILES['mymimfile']['tmp_name'];
    $fileType = $_FILES['mymimfile']['type'];
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