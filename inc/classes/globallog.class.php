<?php
class GlobalLog {
	function __construct() {
			
	}

	function getMeta($meta){
		if(gettype($meta) == 'string'){
			$meta = array(
				'string' => $meta
			);
		}elseif(gettype($meta) !== 'array'){
			$meta = array();
		}
		$browser = get_browser(null, true);
		$meta['ua'] = $_SERVER['HTTP_USER_AGENT'];
		$meta['ip'] = $_SERVER['REMOTE_ADDR'];
		if(session_id()){
			$meta['sess'] = session_id();
		}
		return $meta;
	}

	function addEntry($text, $type, $meta) {
		global $tc_db;
		$timestamp = time();
		if(is_null($text)) {
			$text = '';
		}else{
			$text = substr($text, 0, 4096);
		}
		if(is_null($type)) {
			$type = '';
		}
		if(is_null($meta)){
			$meta = array();
		}
		$meta = $this->getMeta($meta);
		$meta = json_encode($meta);
		$tc_db->Execute("INSERT INTO `globallog` ( `timestamp` , `type` , `text`, `meta` ) VALUES ( ".$tc_db->qstr($timestamp)." , ".$tc_db->qstr($type)." , ".$tc_db->qstr($text)." , ".$tc_db->qstr($meta)." )");
		if(time() % 10 == 0){
			$this->deleteOld();
		}
	}

	function deleteEntry($id) {
		global $tc_db;
	}
	function deleteOld() {
		global $CONF, $tc_db;
		if(!isset($CONF)){
			include KU_ROOTDIR . 'conf.php';
		}
		$tc_db->Execute("DELETE FROM `" . KU_DBPREFIX . "globallog` WHERE `timestamp` < ".$tc_db->qstr(time() - $CONF['GLOBALLOG_EXPIRE']));
	}
	function selectBetweenTimeStamps($from, $to) {
		global $tc_db;
		$results = $tc_db->GetAll("SELECT HIGH_PRIORITY * FROM `globallog` ORDER BY `id` DESC");
		return $results;
	}

	function getCount(){
		global $tc_db;
		$results = $tc_db->GetOne("SELECT HIGH_PRIORITY COUNT(*) FROM `globallog`");
		return $results;
	}

	function getHTML($results){
		$fst = 0;
		$lst = 0;
		$alltypes = [];
		$r = '<script src="/static/js/src/globallog.js"></script>';
		$r .= 'TOTAL: '.$this->getCount() . '<br>'; 
		$tbl = '<table border="1">';
		foreach ($results as $key => $value) {
			$id = htmlspecialchars($value['id']);
			if($fst === 0){
				$fst = $value['id'];
			}
			$lst = $value['id'];
			$text = htmlspecialchars($value['text']);
			$meta = htmlspecialchars($value['meta']);
			$time = htmlspecialchars(strftime("%d.%m.%Y (%a) %H:%M:%S", $value['timestamp']));
			$type = htmlspecialchars($value['type']);
			if(!in_array($type, array_keys($alltypes))){
				$alltypes[$type] = 1;
			}else{
				$alltypes[$type]++;
			}
			$tbl .= "<tr class=\"globallog-type-$type\">";
			$tbl .= "<td><a href=\"/manage_page.php?action=globallog_delete&id=$id\">[x]</a></td>";
			$tbl .= "<td><a href=\"/manage_page.php?action=globallog_show&id=$id\">$id</a></td>";
			$tbl .= "<td style=\"word-wrap: break-word;max-width: 1000px;\" class=\"globallog-text\">$text</td>";
			$tbl .= "<td class=\"globallog-time\">$time</td>";
			$tbl .= "<td class=\"globallog-type\">$type</td>";
			$tbl .= "<td class=\"globallog-meta-raw\">$meta</td>";
			$tbl .= '</tr>';
		}
		$tbl .= '</table>';
		$r .= $this->getDelAllLink($lst, $fst);
		$r .= $this->getAllTypesHTML($alltypes);
		$r .= $tbl;
		return $r;
	}

	function getDelAllLink($fst, $lst){
		return "<div class=\"fixed-bottom\"><a href=\"/manage_page.php?action=globallog_multidelete&fst=$fst&lst=$lst\">del all on page</a> / " . 			
			"<a href=\"/manage_page.php?action=globallog_deleteall\">del all</a></div>";
	}

	function getAllTypesHTML($alltypes){
		$r = '';
		foreach ($alltypes as $key => $value) {
			$r .= '<span class="ignore-btn" id="ignore-btn-'.$key.'" onclick="toggleIgnoreFilter(\''. $key .'\')">' . $key . "[$value]". '</span><br>';
		}
		return $r;
	}
}