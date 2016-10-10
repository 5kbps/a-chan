<?php
require 'config.php';
require KU_ROOTDIR . 'lib/dwoo.php';
require_once KU_ROOTDIR.'/conf.php';
global $tc_db, $dwoo, $dwoo_data, $kusabaxorg;
$all_langs = array_merge(array_keys($CONF['CODE_HIGHLIGHTING_LANGUAGE_ABBRS']), 
	$CONF['CODE_HIGHLIGHTING_LANGUAGES']);
sort($all_langs);
$dwoo_data->assign('conf', $CONF);
$dwoo_data->assign('langs', $all_langs);
$dwoo_data->assign('posting_time_limit', $CONF['ANTIWIPE_POSTING_TIME_LIMIT']);
$dwoo_data->assign('posts_max', $CONF['ANTIWIPE_POSTING_TIME_LIMIT_POSTS_MAX']);
echo $dwoo->get(KU_TEMPLATEDIR . '/faq.tpl', $dwoo_data);
