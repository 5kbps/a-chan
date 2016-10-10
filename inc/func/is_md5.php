<?php
if(!function_exists('is_md5')){
	function is_md5($txt){
		return preg_match('/^[0-9a-fA-F]{32}$/', $txt);
	}
}