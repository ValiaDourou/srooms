<?php      
    session_start();

    $act = $_POST['act'];
    $arr = array();

    if($act==0){
    $_SESSION['token'] = $_POST['token'];
    $_SESSION['rtoken'] = $_POST['rtoken'];
    $_SESSION['uid'] = $_POST['uid'];
    $_SESSION['uauth'] = $_POST['uauth'];
    $_SESSION['user'] = $_POST['user'];
    $_SESSION['pswrd'] = $_POST['pswrd'];
    }
    else if($act==1){
    $arr[]=$_SESSION['token'];
    $arr[]=$_SESSION['rtoken'];
    $arr[]=$_SESSION['uid'];
    $arr[]=$_SESSION['uauth'];
    $arr[]=$_SESSION['user'];
    $arr[]=$_SESSION['pswrd'];

    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    else if($act==2){
    $_SESSION['dtype'] = $_POST['dtype'];
    $_SESSION['did'] = $_POST['did'];
    $_SESSION['dname'] = $_POST['dname'];
    }
    else if($act==3){
    $arr[]=$_SESSION['token'];
    $arr[]=$_SESSION['rtoken'];
    $arr[]=$_SESSION['uid'];
    $arr[]=$_SESSION['uauth'];
    $arr[]=$_SESSION['dtype'];
    $arr[]=$_SESSION['did'];
    $arr[]=$_SESSION['dname'];
    $arr[]=$_SESSION['user'];
    $arr[]=$_SESSION['pswrd'];

    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    else{
    $_SESSION['token'] = $_POST['token'];
    $_SESSION['rtoken'] = $_POST['rtoken'];
    }

?>  