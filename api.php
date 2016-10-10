<?php
require 'config.php';
require 'inc/classes/api.class.php';
$api_class = new Api();
$action = $_REQUEST['action'];
header('Content-Type: text/plain; charset=UTF-8');
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

switch($action){
	case 'lastpost':
		if($_REQUEST['board'] == 'all'){
			echo $api_class->GetLastPostsJSON();
		}else{
			$result = $api_class->GetLastPost($_REQUEST['board']);
			echo $result;
		}
		break;
	case 'postpreview':
		$markup_bbcode     = isset($_REQUEST['bbcode']);
		$markup_wakabamark = isset($_REQUEST['wakabamark']);
		$markup_other      = isset($_REQUEST['other']);
		$message    = $_REQUEST['message'];
		$board      = $_REQUEST['board'];
		$thread     = (int)$_REQUEST['thread'];
		echo $api_class->FormatMessage($message, $board, $thread, $markup_wakabamark=$markup_wakabamark, $markup_bbcode=$markup_bbcode, $markup_other=$markup_other);
		break;
	case 'readthread':
		$board  = $_REQUEST['board'];
		$thread = (int)$_REQUEST['thread'];
		$lastpost = (int)$_REQUEST['lastpost'];
		echo $api_class->ThreadHTML($board, $thread, $lastpost);
		break;
	case 'jsonthread':
		$board  = $_REQUEST['board'];
		$thread = (int)$_REQUEST['thread'];
		$lastpost = (int)$_REQUEST['lastpost'];
		echo $api_class->ReadThread($board, $thread, $lastpost);
		break;
	case 'check_posting':
		$r = $api_class->CheckPosting($_REQUEST['board']);
		echo json_encode($r);
		break;
	case 'setstyle':
		// styles
		$styles = ['Burichan','Futaba','Gentoo','Muon','Neutron','Photon'];
		$style = $_REQUEST['style'];
		$default = 'Muon';
		if(!in_array($style, $styles)){
			$style = $default;
		}
		// posts
		$center = ($_REQUEST['center_posts'] == 'on');
		if($center){
			setcookie("center_posts", 'true', time() + 8640000, "/");
		}else{
			setcookie("center_posts", 'false', time() + 8640000, "/");
		}
		setcookie("style", $style,time() + 8640000, "/");
		echo 'Стиль сохранён: ' . htmlspecialchars($style);
		header('Location: /settings.html');
		break;
	default:
		$api_class->GetDescription();
}
