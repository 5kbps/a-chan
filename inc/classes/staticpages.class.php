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
 * Menu class
 *
 * @package kusaba
 */
class StaticPages {
	function GenerateFAQ() {
		global $tc_db, $dwoo, $dwoo_data, $kusabaxorg;

		require_once KU_ROOTDIR.'lib/dwoo.php';
		require_once KU_ROOTDIR.'/conf.php';
		$dwoo_data->assign('files', $files);
		$dwoo_data->assign('conf', $CONF);
		return $dwoo->get(KU_TEMPLATEDIR . '/faq.tpl', $dwoo_data);
	}
}
?>