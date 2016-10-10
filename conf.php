<?php
include 'config-default.php';
include 'config-user.php';
foreach($user_board_config as $key => $value){
    $CONF[$key] = $value;
}

?>
