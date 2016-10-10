<?php

function hexbin($hex){
	$bin='';
	for($i=0;$i<strlen($hex);$i++)
	$bin.=str_pad(decbin(hexdec($hex[$i])),4,'0',STR_PAD_LEFT);
	return substr($bin, strpos($bin, '1'));
}

class AntiWipe {
	var $config;
	var $boardid;
	var $results;

	function __construct($boardid, $request = array()){
		global $CONF;
		require_once 'inc/captcha/captcha.php';
		$this->captcha = new Captcha($CONF['ANTIWIPE_CAPTCHA_CONFIG']);
		$this->boardid = $boardid;
		$this->request = $request;
		$this->readConfig();
		$this->UpdatePanicIndex();
		$this->results = array(
			'confirmation' => 0,
			'timeout' => 0,
			'pow'     => 0,
			'captcha' => 0,
			'skip_confirmation' => false,
			'skip_pow' => false,
			'pow_is_valid' => false,
			'captcha_is_valid' => false
		);
	}

	function readConfig(){
		global $tc_db, $CONF;
		$results = $tc_db->GetAll("SELECT * FROM `" . KU_DBPREFIX . "antiwipe` WHERE `id` = " . $tc_db->qstr($this->boardid));
		$this->config = $results[0];
		$this->config['powvalue'] = ceil($this->config['powvalue'] + $CONF['ANTIWIPE_POW_PANICINDEX_K'] * $this->config['panicindex']);
	}

	function UpdatePanicIndex(){
		global $tc_db;
		$t = time() - $this->config['panicindextimeout'];
		$posts = $tc_db->GetAll("SELECT HIGH_PRIORITY `id` FROM `" . KU_DBPREFIX . "posts` WHERE `boardid` = " . $tc_db->qstr($this->boardid) . " AND `timestamp` > ".$tc_db->qstr($t));
		$newvalue  = count($posts);
		$tc_db->Execute("UPDATE `".KU_DBPREFIX."antiwipe` SET `panicindex`=".$tc_db->qstr($newvalue)." WHERE `id`=".$tc_db->qstr($this->boardid));
	}

	function CheckAll(){
		if($this->results['filename'] != ''){
			$this->results['file'] = true;
		}
		foreach (['captcha', 'confirmation','timeout','pow'] as $value) {
			if($this->results[$value]){
				exitWithConfirmationForm($this->results);
			}
		}
	}

	/* JS check */
	function CheckJS(){
		global $tc_db;
		exitWithErrorForm(":(");
	}

	/* Post check */
	function CheckUnique() {
		global $tc_db, $board_class, $CONF;

	}

	/* Reply time check (imported from kusaba) */
	function CheckReplyTime() {
		global $tc_db, $board_class, $CONF;
		$time_limit = $CONF['ANTIWIPE_POSTING_TIME_LIMIT'];
		/* Get the timestamp of the last time a reply was made by this IP address */
		$results = $tc_db->GetAll("SELECT timestamp FROM `" . KU_DBPREFIX . "posts` WHERE `ipmd5` = '" . md5($_SERVER['REMOTE_ADDR']) . "' AND `timestamp` > " . (time() - $time_limit));
		/* If they have posted before and it was recorded... */
		if (count($results) > $CONF['ANTIWIPE_POSTING_TIME_LIMIT_POSTS_MAX']) {
			$first = time();
			foreach($results as $result){
				if($result[0] < $first){
					$first = $result[0];
				}
			}
			if (time() - $first <= $time_limit) {
				$this->results['timeout'] = max($time_limit - time() + $first, $this->results['timeout']);
			}
		}
	}

	/* POW or captcha */
	function checkPOWorCaptcha(){
		global $CONF;
		if($this->requiredPOWorCaptcha()){
			if(!$this->ValidatePOW() && !$this->ValidateCaptcha()){
				// if(!$this->captcha->use_pass($_REQUEST['captchatoken'])){
					$this->AddPOW();
					$this->AddCaptcha();
				// }
			}
		}
	}
	function requiredPOWorCaptcha($use = true){
		return ($this->config['pow'] || $this->config['powafter'] <= $this->config['panicindex']);
	}

	/* POW */
	function ValidatePOW(){
		if($this->results['skip_pow']){
			return true;
		}
		if(!$this->request['powvalue'] || !$this->request['powtimestamp']){
			return false;
		}
		$timestamp = $this->request['powtimestamp']*1/1000;
		if($timestamp < time() - 1000 || $timestamp > time() + 1000){
			return false;
		}
		$pow_value = $this->request['powvalue'];
		$post_content = $this->stringifyPost();
		$p1 = (md5($pow_value . $post_content));
		$p2 = (md5($post_content . $pow_value));
		$g1 = hexbin($p1);
		$g2 = hexbin($p2);
		if(substr($g1, 0, $this->config['powvalue']) == substr($g2, 0, $this->config['powvalue'])){   
			if($this->isUniquePostHash($p1)){
				$this->rememberPostHash($p1);
				return true;
			}
		}
		return false;
	}

	function isUniquePostHash($postHash){
		//return true;
		global $tc_db, $CONF;
		$isIn = $tc_db->GetOne("SELECT `timestamp` FROM `posthashes` WHERE `hash` = ".$tc_db->qstr($postHash));
		if($isIn == null){
			return true;
		}else{
			die('Attempt to reuse POW value. Please, report if you are reading this.');
		}
	}

	function rememberPostHash($postHash){
		global $tc_db;
		$query = "INSERT INTO `".KU_DBPREFIX."posthashes` ( `timestamp` , `hash`) VALUES ( " . time() . "," . $tc_db->qstr($postHash).")";
		$tc_db->Execute($query);
	}

	function AddPOW(){
		$this->results['pow'] = $this->config['powvalue'];
		$this->results['confirm_token'] = $this->GetConfirmationToken($message);
	}

	function CheckPOW(){
	}
	function stringifyPost(){
		return $this->request['message'] . $this->request['powtimestamp'];
	}

	/* Confirmation */
	function GetConfirmationToken(){
		$confirm_token = md5(KU_RANDOMSEED . $this->request['message'] . KU_RANDOMSEED);
		return $confirm_token;
	}
	function ValidateConfirmaion(){
		return ($this->GetConfirmationToken() == $this->request['confirmation'] || $this->results['skip_confirmation']);
	}
	function CheckConfirmation(){
		$message      = $this->request['message'];
		$confirmation = $this->request['confirmation'];
		if(($this->config['fullauto'] &&
		$this->config['confirmationafter'] < $this->config['panicindex']) ||
		$this->config['confirmation']){
			$this->results['confirm_token'] = $this->GetConfirmationToken();
			if(!$this->ValidateConfirmaion()){
				$this->results['confirmation'] = true;
			}
		}
	}

	/* Time filters */
	function TimeThreadFilter(){
		global $tc_db;
		if($this->config['timethreadfilter']){
			$timenow = time();
			$wait    = 0;
			$threads = $tc_db->GetAll("SELECT HIGH_PRIORITY `timestamp` FROM `" . KU_DBPREFIX . "posts` WHERE `boardid` = " . $tc_db->qstr($this->boardid) . " AND `parentid` = 0 AND `timestamp` > ". ($timenow-$this->config['timethreadfiltervalue']));
			if(count($threads)){
				foreach ($threads as $thread) {
					if($timenow - $thread['timestamp'] < $this->config['timethreadfiltervalue'] - $wait){
						$wait = $this->config['timethreadfiltervalue'] - ($timenow - $thread['timestamp']);
					}
				}
				$this->results['timeout'] = max($wait, $this->results['timeout']);
			}
		}
	}

	function TimeFilter(){
		global $tc_db;
		if($this->config['timefilter']){
			$timenow = time();
			$wait    = 0;
			$posts = $tc_db->GetAll("SELECT HIGH_PRIORITY `timestamp` FROM `" . KU_DBPREFIX . "posts` WHERE `boardid` = " . $tc_db->qstr($this->boardid) . " AND `timestamp` > ". ($timenow-$this->config['timefiltervalue']));
			if(count($posts)){
				foreach ($posts as $thread) {
					if($timenow - $thread['timestamp'] < $this->config['timefiltervalue'] - $wait){
						$wait = $this->config['timefiltervalue'] - ($timenow - $thread['timestamp']);
					}
				}
			}
			$this->results['timeout'] = max($wait, $this->results['timeout']);
		}
	}

	/* Captcha */
	function CaptchaReplaceCyrillic($str){
		$cyr = array(
			'й' => 'q',
			'ц' => 'w',
			'у' => 'e',
			'к' => 'r',
			'е' => 't',
			'н' => 'y',
			'г' => 'u',
			'ш' => 'i',
			'щ' => 'o',
			'з' => 'p',
			'ф' => 'a',
			'ы' => 's',
			'в' => 'd',
			'а' => 'f',
			'п' => 'g',
			'р' => 'h',
			'о' => 'j',
			'л' => 'k',
			'д' => 'l',
			'я' => 'z',
			'ч' => 'x',
			'с' => 'c',
			'м' => 'v',
			'и' => 'b',
			'т' => 'n',
			'ь' => 'm',
		);
		foreach($cyr as $cyrch => $ch){
			$str = str_replace($cyrch, $ch, $str);
		}
		return $str;
	}
	function AddCaptcha(){
		global $CONF;
		session_start();
		require_once('inc/captcha/captcha.php');
		$captcha = new Captcha($CONF['ANTIWIPE_CAPTCHA_CONFIG']);
		$this->results['captcha'] = $captcha->add_captcha();
	}
	function RemoveSession(){
		$_SESSION = array();
	}
	function ValidateCaptcha(){
		require_once 'inc/captcha/captcha.php';
		$captcha = new Captcha();
		if($this->request['captchatoken']){
			return $captcha->use_pass($this->request['captchatoken']);
		}elseif(isset($this->request['captcha'])){
			$captcha_result =  $this->CaptchaReplaceCyrillic(strtolower($this->request['captcha']));
			$r = $captcha->check_code($captcha_result);
			return $r;
		}
		return false;
	}

	function CaptchaConfig(){
		global $CONF;
		$captcha_config = $CONF['ANTIWIPE_CAPTCHA_CONFIG'];
		return $captcha_config;
	}
}
