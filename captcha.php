<?php
/*
 * This file is part of kusaba.
 *
 * kusaba is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * kusaba is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * kusaba; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */
/**
 * Captcha display
 *
 * Generates a random word and stores it in a session variable, which is later used as a verification that the poster is in fact a human
 *
 * @package kusaba
 */

/**
 * Start the session
 */
session_start();
/**
 * Require the configuration file
 */
require_once 'config.php';
require_once 'conf.php';
require_once 'inc/captcha/captcha.php';

$captcha = new Captcha($CONF['ANTIWIPE_CAPTCHA_CONFIG']);
switch ($_GET['action']) {
	case 'check':
		global $CONF;
		$result = $captcha->check_pass($_GET['token'], $_GET['code']);
		if($result){
			echo json_encode(array(
				'status' => 'OK',
				'ttl' => $CONF['ANTIWIPE_PASSED_CAPTCHA_MAX_AGE'],
				'token' => $_GET['token']));
		}else{
			echo json_encode(array(
				'status' => 'FAIL',
				'token' => $_GET['token']));
		}
		die();
		break;
	case 'get_image':
		if($_GET['token']){
			$captcha->get_image($_GET['token']);
		}
		break;
	case 'show_image':
		if(!isset($_GET['board'])) die();
		require_once 'inc/classes/antiwipe.class.php';
		require_once 'inc/func/calculations.php';
		$boardid = boarddir_to_id($_GET['board']);
		if(!$boardid) die('Incorrect board!');
		$antiwipe_class = new Antiwipe($boardid, array());
		if($antiwipe_class->requiredPOWorCaptcha()){
			$captcha = new Captcha($CONF['ANTIWIPE_CAPTCHA_CONFIG']);
			$captcha_id = $captcha->add_captcha();
			$captcha->get_image($captcha_id);
		}else{
			header('Location: /static/img/hidamari/1.png');
		}
		break;
	default:
		$captcha = new Captcha($CONF['ANTIWIPE_CAPTCHA_CONFIG']);
		$captcha_id = $captcha->add_captcha();
		$captcha->get_image($captcha_id);
		break;
}