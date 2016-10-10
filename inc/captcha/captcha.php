<?php

class Captcha {
	function __construct($config = array()){
		// Check for GD library
		if(!function_exists('gd_info')){
			throw new Exception('Required GD library is missing');
		}
		$bg_path = dirname(__FILE__) . '/backgrounds/';
		$font_path = dirname(__FILE__) . '/fonts/';
		// Default values
		$captcha_config = array(
			'code' => '',
			'min_length' => 5,
			'max_length' => 5,
			'backgrounds' => array(
				$bg_path . '45-degree-fabric.png',
				$bg_path . 'cloth-alike.png',
				$bg_path . 'grey-sandbag.png',
				$bg_path . 'kinda-jean.png',
				$bg_path . 'polyester-lite.png',
				$bg_path . 'stitched-wool.png',
				$bg_path . 'white-carbon.png',
				$bg_path . 'white-wave.png'
			),
			'fonts' => array(
				'times_new_yorker.ttf'
			),
			'characters' => 'ABCDEFGHJKLMNPRSTUVWXYZabcdefghjkmnprstuvwxyz23456789',
			'min_font_size' => 28,
			'max_font_size' => 28,
			'color' => '#666',
			'angle_min' => 0,
			'angle_max' => 10,
			'shadow' => true,
			'shadow_color' => '#fff',
			'shadow_offset_x' => -1,
			'shadow_offset_y' => 1,
			'font_path' => $font_path
		);
		// Overwrite defaults with custom config values
		if(is_array($config)){
			foreach($config as $key => $value) 
				$captcha_config[$key] = $value;
		}
		// fix font paths
		foreach($captcha_config['fonts'] as $t_k => $t_v){
			$captcha_config['fonts'][$t_k] = $captcha_config['font_path'] . $t_v;
		}
		$this->config = $captcha_config;
		$this->load_session();	
	}
	// function get_captcha_id($captcha_code){
	// 	$random_chars = substr(md5(microtime()), 0, 8);
	// 	$captcha_hash = md5($random_chars . $captcha_code)
	// 	$captcha_id = $random_chars . substr($captcha_hash, 0, 24);
	// }
	function add_captcha(){
		global $CONF;
		$captcha_code = '';
		$length = mt_rand($this->config['min_length'], $this->config['max_length']);
		while(strlen($captcha_code) < $length){
			$captcha_code .= substr($this->config['characters'], mt_rand() % (strlen($this->config['characters'])), 1);
		}
		//$captcha_id = $this->get_captcha_id($captcha_code)





		if(count($this->captcha_codes) >= $CONF['ANTIWIPE_CAPTCHA_MAX_CODES']){
			$new_captcha_codes = array();
			foreach(array_reverse($this->captcha_codes) as $key => $value){
				if(count($new_captcha_codes) < $CONF['ANTIWIPE_CAPTCHA_MAX_CODES'] - 1){
					$new_captcha_codes[$key] = $value;
					//echo microtime() . '<br>';
				}
			}
			$this->captcha_codes = array_reverse($new_captcha_codes);
			/*$min_captcha_id = 0;
			$min_captcha_time = time();
			foreach ($this->captcha_codes as $captcha_id => $array) {
				if($min_captcha_time > $array['time']){
					$min_captcha_id = $captcha_id;
					$min_captcha_time = $array['time'];
				}
			}
			if($min_captcha_id != 0){
				unset($this->captcha_codes[$min_captcha_id]);
				$this->save_session();
			}*/
		}
		$captcha_id = md5($CONF['SECURITY_SECRET'] . microtime());
		$this->captcha_codes[$captcha_id] = array(
			'code' => $captcha_code,
			'time' => time(),
			'shown' => false
		);
		$this->save_session();
		return $captcha_id;
	}
	function load_session(){
		if(isset($_SESSION['_CAPTCHA']['codes'])){
			$this->captcha_codes = unserialize($_SESSION['_CAPTCHA']['codes']);
		}else{
			$this->captcha_codes = array();
		}
		if(isset($_SESSION['_CAPTCHA']['passed'])){
			$this->passed = unserialize($_SESSION['_CAPTCHA']['passed']);
		}else{
			$this->passed = array();
		}
		$this->flush_old();
	}
	function save_session(){
		$_SESSION['_CAPTCHA']['codes'] = serialize($this->captcha_codes);
		$_SESSION['_CAPTCHA']['passed'] = serialize($this->passed);
	}
	function flush_old(){
		global $CONF;
		foreach($this->captcha_codes as $key => $captcha){
			if($captcha['time'] < time() - $CONF['ANTIWIPE_CAPTCHA_MAX_AGE']){
				unset($this->captcha_codes[$key]);
			}
		}
		foreach($this->passed as $key => $captcha){
			if($captcha < time() - $CONF['ANTIWIPE_CAPTCHA_MAX_AGE']){
				unset($this->passed[$key]);
			}
		}
	}
	function get_image($captcha_id){
		if(!isset($this->captcha_codes[$captcha_id]) ||
			!is_array($this->captcha_codes[$captcha_id]) ||
			$this->captcha_codes[$captcha_id]['shown'] == true ){
				$background = $this->config['backgrounds'][mt_rand(0, count($this->config['backgrounds']) -1)];
				list($bg_width, $bg_height, $bg_type, $bg_attr) = getimagesize($background);
				die('Error: captcha reusing');
		}
		function toText($text){
			return $text;
			# detect if the string was passed in as unicode
			$text_encoding = mb_detect_encoding($text, 'UTF-8, ISO-8859-1');
			# make sure it's in unicode
			if ($text_encoding != 'UTF-8') {
			    $text = mb_convert_encoding($text, 'UTF-8', $text_encoding);
			}

			# html numerically-escape everything (&#[dec];)
			$text = mb_encode_numericentity($text,
			    array (0x0, 0xffff, 0, 0xffff), 'UTF-8');
    	}
		// Pick random background, get info, and start captcha
		$background = $this->config['backgrounds'][mt_rand(0, count($this->config['backgrounds']) -1)];
		list($bg_width, $bg_height, $bg_type, $bg_attr) = getimagesize($background);

		$captcha = imagecreatefrompng($background);

		$color = $this->hex2rgb($this->config['color']);
		$color = imagecolorallocate($captcha, $color['r'], $color['g'], $color['b']);

		// Determine text angle
		$angle = mt_rand( $this->config['angle_min'], $this->config['angle_max']) * (mt_rand(0, 1) == 1 ? -1 : 1);

		// Select font randomly
		$font = $this->config['fonts'][mt_rand(0, count($this->config['fonts']) - 1)];

		// Verify font file exists
		if(!file_exists($font) ) throw new Exception('Font file not found: ' . $font);
		$code_text = toText($this->captcha_codes[$captcha_id]['code']);
		//Set the font size.
		$font_size = mt_rand($this->config['min_font_size'], $this->config['max_font_size']);
		$text_box_size = imagettfbbox($font_size, $angle, $font, $code_text);

		// Determine text position
		$box_width = abs($text_box_size[6] - $text_box_size[2]);
		$box_height = abs($text_box_size[5] - $text_box_size[1]);
		$text_pos_x_min = 0;
		$text_pos_x_max = ($bg_width) - ($box_width);
		$text_pos_x = ($text_pos_x_max - $text_pos_x_min) / 2;
		$text_pos_y_min = $box_height;
		$text_pos_y_max = ($bg_height) - ($box_height / 2);
		if ($text_pos_y_min > $text_pos_y_max) {
			$temp_text_pos_y = $text_pos_y_min;
			$text_pos_y_min = $text_pos_y_max;
			$text_pos_y_max = $temp_text_pos_y;
		}
		$text_pos_y = $text_pos_y_min + ($text_pos_y_max - $text_pos_y_min) / 2;

		// Draw shadow
		if($this->config['shadow']){
			$shadow_color = $this->hex2rgb($this->config['shadow_color']);
			$shadow_color = imagecolorallocate($captcha, $shadow_color['r'], $shadow_color['g'], $shadow_color['b']);
			imagettftext($captcha, $font_size, $angle, $text_pos_x + $this->config['shadow_offset_x'], $text_pos_y + $this->config['shadow_offset_y'], $shadow_color, $font, $code_text);
		}
		// Draw text
		imagettftext($captcha, $font_size, $angle, $text_pos_x, $text_pos_y, $color, $font, $code_text);
		$this->captcha_codes[$captcha_id]['shown'] = true;
		$this->save_session();
		// Output image
		header("Content-type: image/png");
		imagepng($captcha);

	}
	function check($captcha_id, $captcha_code){
		if(isset($this->captcha_codes[$captcha_id]) &&
		is_array($this->captcha_codes[$captcha_id]) &&
		isset($this->captcha_codes[$captcha_id]['code'])){
			if($this->captcha_codes[$captcha_id]['code'] == $captcha_code){
				$r = true;
			}else{
				$r = false;
			}
			unset($this->captcha_codes[$captcha_id]);
			$this->save_session();
			return $r;
		}
		return false;
	}
	function check_code($captcha_code){
		$captcha_id = $this->id_by_code($captcha_code);
		return $this->check($captcha_id, $captcha_code);
	}
	function check_pass($captcha_id, $captcha_code){
		global $CONF;
		$r = false;
		if($this->check($captcha_id, $captcha_code)){
			$r = true;
			if($CONF['ANTIWIPE_CAPTCHA_MAX_PASSED'] > count($this->passed)){
				$this->passed[$captcha_id] = time();
				$this->save_session();
			}	
		}
		return $r;
	}
	function has_passes(){
		return count($this->passed) > 0;
	}
	function use_pass($captcha_id){
		global $CONF;
		$r = false;
		if(!$this->has_passes()){
			return false;
		}
		if(!isset($captcha_id)){
			return false;
		}
		if(!isset($this->passed[$captcha_id])){
			return false;
		}
		if($this->passed[$captcha_id] < time() - $CONF['ANTIWIPE_PASSED_CAPTCHA_MAX_AGE']){
			unset($this->passed[$captcha_id]);
			$this->save_session();
			return false;
		}else{
			unset($this->passed[$captcha_id]);
			$this->save_session();
			return true;
		}
		return $r;
	}
	function id_by_code($captcha_code){
		foreach ($this->captcha_codes as $captcha_id => $array) {
			if($this->captcha_codes[$captcha_id]['code'] == $captcha_code){
				return $captcha_id;
			}
		}
		return '';
	}
	function add_pass(){
		global $CONF;

	}
	function sign_code($captcha_code){
		$captcha_id = $this->id_by_code($captcha_code);
		return $this->sign($captcha_id, $captcha_code);
	}
	function sign($captcha_id, $captcha_code){
		$check = $this->check($captcha_id, $captcha_code);
		if(!$check) return false;
		return $this->getsign($captcha_id);
	}
	function getsign($captcha_id){
		global $CONF;
		return md5($captcha_id . $CONF['SECURITY_SECRET_CAPTCHA_SIGN']);
	}
	function checksign($captcha_id, $sign){
		return $sign == $this->getsign($captcha_id);
	}
	function hex2rgb($hex_str, $return_string = false, $separator = ',') {
		$hex_str = preg_replace("/[^0-9A-Fa-f]/", '', $hex_str); // Gets a proper hex string
		$rgb_array = array();
		if(strlen($hex_str) == 6){
			$color_val = hexdec($hex_str);
			$rgb_array['r'] = 0xFF & ($color_val >> 0x10);
			$rgb_array['g'] = 0xFF & ($color_val >> 0x8);
			$rgb_array['b'] = 0xFF & $color_val;
		} elseif(strlen($hex_str) == 3){
			$rgb_array['r'] = hexdec(str_repeat(substr($hex_str, 0, 1), 2));
			$rgb_array['g'] = hexdec(str_repeat(substr($hex_str, 1, 1), 2));
			$rgb_array['b'] = hexdec(str_repeat(substr($hex_str, 2, 1), 2));
		} else {
			return false;
		}
		return $return_string ? implode($separator, $rgb_array) : $rgb_array;
	}
}
