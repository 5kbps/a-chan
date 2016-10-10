<?php
function add_unvisible_hypjens($text){
	$wordlen = 0;
	$result = '';
	for($i = 0; $i < strlen($text); $i++){
		$c = $text[$i];
		$result .= $c;
		if($c == ' ' || $c == '\n'){
			$wordlen = 0;
		}else{
			if($wordlen > 150){
				$wordlen = 0;
				$result .= '&shy;';
			}else{
				$wordlen++;
			}
		}
	}
}