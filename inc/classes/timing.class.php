<?php

/**
* 
*/
class Timing
{
	function __construct($task='unknown', $obj = null)
	{
		$this->start_time = microtime(true);
		$this->task = $task;
		$this->obj  = $obj;
		$this->check();
	}
	function get_max_time(){
		return 0.1;
	}
	function check()
	{
		$this->end_time = microtime(true);
		$this->time = $this->end_time - $this->start_time;
		if($this->time > $this->get_max_time()){
			$this->new_entry();
		}else{
		}
		$this->new_entry();
	}
	function new_entry()
	{
		global $tc_db;
	    $query = "INSERT HIGH_PRIORITY INTO `" . KU_DBPREFIX . "timing` (`obj`) VALUES (4)";
	    echo $query;
	    $result = $tc_db->Execute($query);
	    echo $result;
	    echo "<";
//	    die();
	}
}