<?php      
    session_start();

    $act = $_POST['act'];
    $arr = array();

    if($act=='0'){
    $_SESSION['token'] = $_POST['token'];
    $_SESSION['rtoken'] = $_POST['rtoken'];
    $_SESSION['uid'] = $_POST['uid'];
    $_SESSION['uauth'] = $_POST['uauth'];
    }
    else{
    $arr[]=$_SESSION['token'];
    $arr[]=$_SESSION['rtoken'];
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }

?>  