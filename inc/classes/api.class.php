<?php

class Api {
	function GetLastPost($board_name){
		global $tc_db;
		$avaliable_boards = $tc_db->GetAll('SELECT `name`, `id` FROM `'.KU_DBPREFIX.'boards` WHERE `section` != 0');
		foreach ($avaliable_boards as $board) {
			if($board['name'] == $board_name){
				$lastpost = $tc_db->GetAll('SELECT `id` FROM `'.KU_DBPREFIX.'posts` WHERE `boardid` = '. $board['id'] .' AND `IS_DELETED` = 0  AND NOT `email` = "sage" ORDER BY `id` DESC LIMIT 1');
				return $lastpost[0][0];
			}
		}
		return false;
	}
	function GetLastPostsJSON(){
		global $tc_db;
		$r = [];
		$boards = $tc_db->GetAll('SELECT `name`, `id` FROM `'.KU_DBPREFIX.'boards` WHERE `section` != 0');
		foreach ($boards as $board) {
			$lastpost = $tc_db->GetAll('SELECT `id` FROM `'.KU_DBPREFIX.'posts` WHERE `boardid` = '. $board['id'] .' AND `IS_DELETED` = 0 AND NOT `email` = "sage" ORDER BY `id` DESC LIMIT 1');
			$r[$board['name']] = $lastpost[0][0]*1;
		}
		return json_encode($r, JSON_UNESCAPED_UNICODE);
	}
	function FormatMessage($message, $board, $thread, $markup_wakabamark=false, $markup_bbcode=false, $markup_other=false){
		global $tc_db;
		require_once KU_ROOTDIR . 'inc/classes/parse.class.php';
		include 'conf.php';
		$meslen = strlen($message);
        if($meslen > $CONF['MESSAGE_MAX_LENGTH']){
            return sprintf('Извините, сообщение слишком длинное. %d символов при лимите в %d.', $meslen, $CONF['MESSAGE_MAX_LENGTH']);
        }

		$parse_class = new Parse();
		$result = $tc_db->GetAll('SELECT `id`, `type` FROM `'.KU_DBPREFIX.'boards` WHERE `name` = '. $tc_db->qstr($board));
		if(!count($result)){
			return '';
		}
		$id = $result[0]['id'];
		//$parse_class->boardid = $id;
		$type = $result[0]['type'];
		$html = $parse_class->ParsePost($message, $board, $type, $thread_replyto, $id, $ispage=false, $markup_wakabamark=$markup_wakabamark, $markup_bbcode=$markup_bbcode, $markup_other=$markup_other);

		return  $html;
	}
	function GetDescription(){
		http_response_code(501);
		echo "You are doing something wrong. Check out /api.html for more info.";
	}
	function ReadThread($board, $thread, $lastpost){
		global $tc_db;
		if(!is_int($lastpost) || !is_int($thread)){
			die();
		}
		$boardid = $tc_db->GetOne('SELECT `id` FROM `'.KU_DBPREFIX.'boards` WHERE `name` = '. $tc_db->qstr($board));
		$_posts = $tc_db->GetAll('SELECT `id`, `name`, `tripcode`, `email`, `subject`, `message`, `file`, `file_type`, `file_size`, `file_size_formatted`, `image_w`, `image_h`, `thumb_w`,`thumb_h`, `timestamp` FROM `'.KU_DBPREFIX.'posts` WHERE `boardid` = ' . $tc_db->qstr($boardid) . '  AND `IS_DELETED` = 0 AND `id` > ' . $tc_db->qstr($lastpost) . ' AND ((`parentid` = '. $tc_db->qstr($thread) . ' ) OR (`parentid` = 0 AND `id` = ' .  $tc_db->qstr($thread) . '))');
		$posts = [];
		foreach ($_posts as $_post) {
			$post = [];
			foreach ($_post as $key => $value) {
				if(!is_numeric($key)){
					$post[$key] = $value;
				}
			}
			$posts[] = $post;
		}
		return  json_encode($posts, JSON_UNESCAPED_UNICODE);
	}
	function ThreadHTML($board, $thread, $lastpost){
		global $tc_db;
		
		if(!is_int($lastpost) || !is_int($thread)){
			die();
		}

		require_once 'config.php';
		require_once KU_ROOTDIR . 'inc/functions.php';
		require_once KU_ROOTDIR . 'inc/classes/board-post.class.php';
		
		$boardid = $tc_db->GetOne('SELECT `id` FROM `'.KU_DBPREFIX.'boards` WHERE `name` = '. $tc_db->qstr($board));
		$_posts = $tc_db->GetAll('SELECT * FROM `'.KU_DBPREFIX.'posts` WHERE `boardid` = ' . $tc_db->qstr($boardid) . '  AND `IS_DELETED` = 0 AND `id` > ' . $tc_db->qstr($lastpost) . ' AND ((`parentid` = '. $tc_db->qstr($thread) . ' ) OR (`parentid` = 0 AND `id` = ' .  $tc_db->qstr($thread) . '))');
		$board_class = new Board($board);
		$results = [];
		foreach ($_posts as $key=>$post) {
			$results[$key] = $board_class->BuildPost($post, false);
		}
		$board_class->InitializeDwoo();
		$board_class->dwoo_data->assign('board', $board_class->board);
		$board_class->dwoo_data->assign('isread', true);
		$board_class->dwoo_data->assign('file_path', getCLBoardPath($board_class->board['name'], $board_class->board['loadbalanceurl_formatted'], ''));
		$board_class->dwoo_data->assign('posts', $results);
		$r = [];
		$r['count'] = count($results);
		$r['html']  = $board_class->dwoo->get(KU_TEMPLATEDIR . '/img_thread.tpl', $board_class->dwoo_data);
		return json_encode($r, JSON_UNESCAPED_UNICODE);
	}
	function CheckPosting($board){
		global $tc_db, $CONF;
		require_once 'config.php';
		require_once 'conf.php';
		require_once KU_ROOTDIR . 'inc/functions.php';
		require_once KU_ROOTDIR . 'inc/classes/antiwipe.class.php';
		$r = array(
			'token' => '',
			'captcha_min_length' => $CONF['ANTIWIPE_CAPTCHA_CONFIG']['min_length'],
			'powvalue' => 0,
			'timeout' => 0,
			'ttl' => 0
		);
		if(!$_REQUEST['board'] || strlen($_REQUEST['board']) > 10){
			echo json_encode($r, JSON_UNESCAPED_UNICODE);
			die();
		}
		
		$boardid = $tc_db->GetOne('SELECT `id` FROM `'.KU_DBPREFIX.'boards` WHERE `name` = '. $tc_db->qstr($board));
		
		$antiwipe = new AntiWipe($boardid, null);
		$antiwipe->readConfig();
		
		// time filters check
		$antiwipe->CheckReplyTime();
		if($_REQUEST['replythread'] == 0){
			// new_ thread
			$antiwipe->TimeThreadFilter();
		}else{
			$antiwipe->TimeFilter();
		}
		
		if($antiwipe->requiredPOWorCaptcha(false)){
	        session_start();
    	    require_once('inc/captcha/captcha.php');
    	    $captcha = new Captcha($CONF['ANTIWIPE_CAPTCHA_CONFIG']);
    	    $captcha_id = $captcha->add_captcha();
    	    $r['token'] = $captcha_id;
        	$r['powvalue'] = $antiwipe->config['powvalue'];
        	$r['ttl'] = $CONF['ANTIWIPE_CAPTCHA_MAX_AGE'];
    	    // $_SESSION['captcha'] = simple_php_captcha($antiwipe->CaptchaConfig());
        	// $r['captcha'] =  "/inc/" . explode("/inc/", $_SESSION['captcha']['image_src'])[1];
		}
    	$r['timeout'] = $antiwipe->results['timeout'];
		return $r;
	}
}
