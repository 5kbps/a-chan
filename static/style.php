<?php
header('Content-type: text/css');
if(isset($_REQUEST['noscript'])){
	readfile("css/noscript.css");
	exit();
}
// styles
$default = 'Muon';
$styles = ['Burichan','Futaba','Gentoo','Muon','Neutron','Photon'];
if(!isset($_COOKIE['style'])){
	$style = $default;
}else{
	$style = $_COOKIE['style'];
}
if(!in_array($style, $styles)){
	$style = $default;
}
echo "/* $style */\n";
readfile("css/style/" . $style . ".css");
echo "\n.logo-image{\n\tbackground-image: url('/static/logo/$style.svg');\n}";

if(isset($_GET['menu'])){
//	readfile("css/menu.css");
}

if(isset($_COOKIE['center_posts']) && $_COOKIE['center_posts'] == 'true'){
	readfile('css/center.css');
}