<?php
function anything2color($anything){
	return '#' . substr(md5($anything), 0, 6);
}