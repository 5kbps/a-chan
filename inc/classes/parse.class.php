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
* A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* kusaba; if not, write to the Free Software Foundation, Inc.,
* 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
* +------------------------------------------------------------------------------+
* Parse class
* +------------------------------------------------------------------------------+
* A post's message text will be passed, which will then be formatted and cleaned
* before being returned.
* +------------------------------------------------------------------------------+
*/

/* Modified by ~a: added Markdown support */
//require_once 'vendor/Michelf/MarkdownExtra.inc.php';
require_once 'geshi/geshi.php';
//require_once 'inc/func/shy.php';
//use \Michelf\MarkdownExtra;

class Parse {
    var $boardtype;
    var $parentid;
    var $id;
    var $boardid;
    var $max_reflinks = 30; // prevent dos
    // remember: every reflink requires one db query
    var $added_reflinks = 0;
    var $code_matches = array();
    function link_board_post($m){
        if($m[7]){
            $real_post_num = $m[7];
        }else{
            $real_post_num = $m[4];
        }
        return '&gt;&gt;/' . $m[3] . '/' . $real_post_num;
    }
    function parse_link($url){
        $parsed_url = parse_url($url);
        if(!$parsed_url['host']){
            return false;
        }
        if (!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i",$url)) {
            return false;//$websiteErr = "Invalid URL";
        }
        $link_text = htmlspecialchars(urldecode(htmlspecialchars_decode($url, ENT_QUOTES)), ENT_QUOTES);
        $link_href = $url;
        if(!$link_text || !$link_href){
            return false;
        }
        return array('text' => $link_text, 'href' => $link_href, 'arr' => $parsed_url);
    }
    function link_auto($m){
        $probably_url = $m[2] . $m[3];
        $parsed_link = $this->parse_link($probably_url);
        if($parsed_link){
            return $m[1] . '<a rel="nofollow noopener noreferrer" target="_blank" class="post-link" href="' . $parsed_link['href'] . '">' . $parsed_link['text'] . '</a>';
        }else{
            return $m[0];
        }
    }
    function link_short_md($m){
        $probably_url = $m[2] . $m[3];
        $parsed_link = $this->parse_link($probably_url);
        if($parsed_link){
            return '<a rel="nofollow noopener noreferrer" target="_blank" class="post-link" href="' . $parsed_link['href'] . '">' . $m[1] . '</a>';
        }else{
            return $m[0];
        }
    }
    function link_remove_domain($m){
        return '/' . $m[3];
    }
    function get_domain_regexp(){
        global $CONF;
        return implode('|', $CONF['BOARD_DOMAINS']);
    }
    function MakeClickable($txt) {
        /* Make http:// urls in posts clickable */
        $txt = ' '.$txt;
        $urlf = '([^(\s<|\[)<>]*)';
        // replace http://a-chan.localdomain/d/res/2064.html#i2065 with >>/d/2065
        $txt = preg_replace_callback('`(http://|https://)(a-chan.org|a-chan.localdomain|kpdqsslspgfwfjpw.onion)/(a|b|cu|d|mov|mu|sp|test|vg)/res/(\\d+)\\.html(\\#(i)?(\\d+))?`is', array(&$this, 'link_board_post'), $txt);// $txt);
        // replace http://google.com with <a> ...
        $txt = preg_replace_callback('#([^(])(http://|https://|ftp://)' . $urlf . '#is', array(&$this, 'link_auto'), $txt);
        // replace [asd](http://google.com/faq.html) with asd
        $txt = preg_replace_callback('#\\[([^/:&)]+?)\\]\\((http://|https://|ftp://)' . $urlf . '\\)#is', array(&$this, 'link_short_md'), $txt);
        // replace http://a-chan.localdomain/faq.html with /faq.html
        $txt = preg_replace_callback('`(http://|https://)(a-chan.org|a-chan.localdomain|kpdqsslspgfwfjpw.onion)/`is', array(&$this, 'link_remove_domain'), $txt);
        //$txt = trim($txt);
        return $txt;
    }

    function hidden_callback($m){
        return '<div class="fspoiler"><span class="fspoilertitle"  onclick="toggleSpoiler(this);">' . trim($m[1]) . '</span><div class="fspoilertext">' . $this->RemoveExtraNewlines(trim($m[2])) . '</div></div>';
    }

    function BBCode($string){
        $patterns = array(
            '`\[b\](.+?)\[/b\]`is',
            '`\[i\](.+?)\[/i\]`is',
            '`\[u\](.+?)\[/u\]`is',
            '`\[s\](.+?)\[/s\]`is',
            '`\[spoiler\](.+?)\[/spoiler\]`is',
            '`\[red\](.+?)\[/red\]`is',
        );
        $replaces =  array(
            '<strong>\\1</strong>',
            '<em>\\1</em>',
            '<span style="border-bottom: 1px solid">\\1</span>',
            '<strike>\\1</strike>',
            '<span class="spoiler">\\1</span>',
            '<span class="red-sign">\\1</span>',
        );
        $string = preg_replace($patterns, $replaces , $string);
        $string = preg_replace_callback('`\\[hidden=([^/:&]+?)\\](.+?)\\[/hidden\\]`si', array(&$this, 'hidden_callback'), $string);
        return $string;
    }

    function WakabaMark($string){
        $patterns = array(
            '`\*\*(.+?)\*\*`is',
            '`\*(.+?)\*`is',
            '`~~(.+?)~~`is',
            '`%%(.+?)%%`is',
        );
        $replaces =  array(
            '<strong>\\1</strong>',
            '<em>\\1</em>',
            '<strike>\\1</strike>',
            '<span class="spoiler">\\1</span>',
        );
        $string = preg_replace($patterns, $replaces , $string);
        return $string;
    }

    function ModTags($string){
        return $string;
    }
    function Other($string){
        $patterns = array(
            '/(\\s)--(\\s)/',
            '/(\\s)-&gt;(\\s)/',
            '/(\\s)&lt;-(\\s)/',
            '/(\\s)&lt;&lt;(.+?)&gt;&gt;(\\s)/s',
            '/(\\s)&lt;\\=&gt;(\\s)/',
            '/(\\s)\\=&gt;(\\s)/',
            '/(\\s)&lt;\\=(\\s)/',
            '/\\(c\\)/'
        );
        $replaces =  array(
            '\\1&#8212;\\2',
            '\\1&#8594;\\2',
            '\\1&#8592;\\2',
            '\\1&#171;\\2&#187;\\3',
            '\\1&#8660;\\2',
            '\\1&#8658;\\2',
            '\\1&#8656;\\2',
            '&#169;'
        );
        $string = preg_replace($patterns, $replaces , $string);
        return $string;
    }

    function ColoredQuote($buffer, $boardtype) {
        /* Add a \n to keep regular expressions happy */
        $newline_added = false;
        $lines = explode("\n", $buffer);
        foreach($lines as $i => $line){
            $t_line = ltrim($line);
            if(substr($t_line, 0, 4) == '&gt;'){
                if(substr($t_line, 4, 1) != ' '){
                    $t_line = '&gt; ' . substr($t_line, 4);
                }
                $lines[$i] = '<span class="unkfunc">' . $t_line . '</span>';
            }
        }
        return join("\n", $lines);
    }

    function ClickableQuote($buffer, $board, $boardtype, $parentid, $boardid, $ispage = false) {
        global $thread_board_return;
        $thread_board_return = $board;
        $thread_board_id = $boardid;
        // Add html for links to posts in the board the post was made
        $buffer = preg_replace_callback('/&gt;&gt;(\d+)/', array(&$this, 'InterthreadQuoteCheck'), $buffer);
        //Add html for links to posts made in a different board
        $buffer = preg_replace_callback('/&gt;&gt;\/([a-z]+)\/(\d+)/', array(&$this, 'InterboardQuoteCheck'), $buffer);
        return $buffer;
    }

    function getPostThreadId($postid){
        global $tc_db, $ispage, $thread_board_return, $thread_board_id;
        if ($this->boardtype != 1 && is_numeric($postid)) {
            $query = "SELECT `parentid`, `id` FROM `".KU_DBPREFIX."posts` WHERE `boardid` = " . $this->boardid . " AND `id` = ".$tc_db->qstr($postid);
            $result = $tc_db->GetAll($query);
            $found  = $result[0]['id'] != '';
            $result = $result[0]['parentid'];
            if ($result !== '' && $found) {
                if ($result == 0) {
                    $realid = $postid;
                } else {
                    $realid = $result;
                }
            } else {
                return false; //return $matches[0];
            }
        }else{
            return false;
        }
    }
    function InterthreadQuoteCheck($matches) {
        global $tc_db, $ispage, $thread_board_return, $thread_board_id;
        if($this->added_reflinks >= $this->max_reflinks){
            return $matches[0];
        }
        $lastchar = '';
        if (is_numeric($matches[1])) {
            $query = "SELECT `parentid`, `id` FROM `".KU_DBPREFIX."posts` WHERE `boardid` = " . $this->boardid . " AND `id` = ".$tc_db->qstr($matches[1]);
            $this->added_reflinks++;
            $result = $tc_db->GetAll($query);
            $found  = $result[0]['id'] != '';
            $result = $result[0]['parentid'];
            if ($result !== '' && $found) {
                if ($result == 0) {
                    $realid = $matches[1];
                } else {
                    $realid = $result;
                }
            } else {
                return $matches[0];
            }
            $return = '<a href="'.KU_BOARDSFOLDER.$thread_board_return.'/res/'.$realid.'.html#'.$matches[1].'" onclick="return highlight(\'' . $matches[1] . '\', true);" class="ref|' . $thread_board_return . '|' .$realid . '|' . $matches[1] . '">'.$matches[0].'</a>'.$lastchar;
        }
        return $return;
    }

    function InterboardQuoteCheck($matches) {
        global $tc_db;
        if($this->added_reflinks >= $this->max_reflinks){
            return $matches[0];
        }
        $result = $tc_db->GetAll("SELECT `id`, `type` FROM `".KU_DBPREFIX."boards` WHERE `name` = ".$tc_db->qstr($matches[1])."");
        $this->added_reflinks++;
        if ($result[0]["type"] != '') {
            $result2 = $tc_db->GetOne("SELECT `parentid` FROM `".KU_DBPREFIX."posts` WHERE `boardid` = " . $result[0]['id'] . " AND `id` = ".$tc_db->qstr($matches[2])."");
            if ($result2 != '') {
                if ($result2 == 0) {
                    $realid = $matches[2];
                } else {
                    if ($result[0]['type'] != 1) {
                        $realid = $result2;
                    }
                }
                if ($result[0]["type"] != 1) {
                    return '<a href="'.KU_BOARDSFOLDER.$matches[1].'/res/'.$realid.'.html#'.$matches[2].'" class="ref|' . $matches[1] . '|' . $realid . '|' . $matches[2] . '">'.$matches[0].'</a>';
                } else {
                    return '<a href="'.KU_BOARDSFOLDER.$matches[1].'/res/'.$realid.'.html" class="ref|' . $matches[1] . '|' . $realid . '|' . $realid . '">'.$matches[0].'</a>';
                }
            }
        }
        return $matches[0];
    }

    function Wordfilter($buffer, $board) {
        /*
        global $tc_db;
        $query = "SELECT * FROM `".KU_DBPREFIX."wordfilter`";
        $results = $tc_db->GetAll($query);
        foreach($results AS $line) {
            $array_boards = explode('|', $line['boards']);
            if (in_array($board, $array_boards)) {
                $replace_word = $line['word'];
                $replace_replacedby = $line['replacedby'];

                $buffer = ($line['regex'] == 1) ? preg_replace($replace_word, $replace_replacedby, $buffer) : str_ireplace($replace_word, $replace_replacedby, $buffer);
            }
        }
        */
        return $buffer;
    }
    function RemoveExtraNewlines($text){
        $lines = preg_split('/<br>/', $text);
        $r     = array();
        $flag  = false;
        foreach($lines as $line){
            $empty = strlen(($line)) == 0;
            if ($flag == false) {
                if ($empty)
                    $flag = true;
                $r[] = $line;
            } else {
                if (!$empty){
                    $r[] = $line;
                    $flag = false;
                }
            }
        }
        return implode('<br>', $r);
    }
    function CheckNotEmpty($buffer) {
        $buffer_temp = str_replace("\n", "", $buffer);
        $buffer_temp = str_replace("<br>", "", $buffer_temp);
        $buffer_temp = str_replace("<br/>", "", $buffer_temp);
        $buffer_temp = str_replace("<br />", "", $buffer_temp);

        $buffer_temp = str_replace(" ", "", $buffer_temp);

        if ($buffer_temp=="") {
            return "";
        } else {
            return $buffer;
        }
    }

    function CutWord($txt, $where) {
        $txt_split_primary = preg_split('/\n/', $txt);
        $txt_processed = '';
        $usemb = (function_exists('mb_substr') && function_exists('mb_strlen')) ? true : false;
        foreach ($txt_split_primary as $txt_split) {
            $txt_split_secondary = preg_split('/ /', $txt_split);
            foreach ($txt_split_secondary as $txt_segment) {
                $segment_length = ($usemb) ? mb_strlen($txt_segment) : strlen($txt_segment);
                while ($segment_length > $where) {
                    if ($usemb) {
                        $txt_processed .= mb_substr($txt_segment, 0, $where) . "\n";
                        $txt_segment = mb_substr($txt_segment, $where);
                        $segment_length = mb_strlen($txt_segment);
                    } else {
                        $txt_processed .= substr($txt_segment, 0, $where) . "\n";
                        $txt_segment = substr($txt_segment, $where);
                        $segment_length = strlen($txt_segment);
                    }
                }
                $txt_processed .= $txt_segment . ' ';
            }
            $txt_processed = ($usemb) ? mb_substr($txt_processed, 0, -1) : substr($txt_processed, 0, -1);
            $txt_processed .= "\n";
        }
        return $txt_processed;
    }
    function add_code($m){
        $this->code_matches[] = $m;
    }
    function real_code_language_name($short_language_name){
        // TODO
        return $short_language_name;
    }
    function process_code($code_match){
        require 'conf.php';
        $code = $code_match[3];
        $code_len = strlen($code);
        $language_name_html = '';
        $code_language_unknown = false;

        $lines_real_count = count(preg_split('/\n/', $code));
        if(!trim($code, "\n\r\0") || strlen($code) == 2){
            return $code_match[0];
        }
        // trim newlines but leave spaces
        $code = trim($code, "\n\r\0");
        // detect code language
        $code_lang = strtolower($code_match[2]);
        if(!$code_lang){
            $code_language_unknown = true;
            if($lines_real_count < 2){
                $code_lang = 'text';
            }else{
                $code_lang = 'c';
            }
        }else{
            if(!in_array($code_lang, $CONF['CODE_HIGHLIGHTING_LANGUAGES'])){
                if(array_key_exists($code_lang, $CONF['CODE_HIGHLIGHTING_LANGUAGE_ABBRS'])){
                    $code_lang = $CONF['CODE_HIGHLIGHTING_LANGUAGE_ABBRS'][$code_lang];
                }else{
                    $code_lang = 'text';
                }
            }
        }
        if($code_len >= $CONF['CODE_HIGHLIGHTING_MAX_LENGTH']){
            $code_lang = 'text';
        }

        // detect code block class based on line count
        if($lines_real_count < 2){
            $class_name = 'code-inline';
            $tag_name   = 'span';
        }else{
            $class_name = 'code-block';
            $tag_name   = 'div';
            if(!$code_language_unknown){
                if(array_key_exists($code_lang, $CONF['CODE_HIGHLIGHTING_LANGUAGE_NAMES'])){
                    $language_name_html = $CONF['CODE_HIGHLIGHTING_LANGUAGE_NAMES'][$code_lang];
                }else{
                    $language_name_html = $code_lang;
                }
            }else{
                $language_name_html = '';
            }
            $language_name_html = strtoupper(substr($language_name_html, 0, 1)) .
                substr($language_name_html, 1);
            $language_name_html = '<span class="code-language-name">' . $language_name_html . '</span>';
        }
        $class_name .= " $code_lang";
        $raw_code   = htmlspecialchars_decode($code, ENT_QUOTES);
        $geshi = new GeSHi($raw_code, $code_lang);
        $geshi->enable_classes();
        $geshi->enable_keyword_links(false);
        $geshi->set_header_type(GESHI_HEADER_NONE);
        $highlighted_code = $geshi->parse_code();
        return $language_name_html . '<' . $tag_name . ' class="' . $class_name . '">'
       . $highlighted_code .
       '</' . $tag_name . '>';
    }
    function get_code_lang_regexp() {
        require 'conf.php';
        return implode('|', array_merge(array_keys($CONF['CODE_HIGHLIGHTING_LANGUAGE_ABBRS']), $CONF['CODE_HIGHLIGHTING_LANGUAGES']));
    }
    function ParsePost($message, $board, $boardtype, $parentid, $boardid, $ispage = false, $markup_wakabamark = false, $markup_bbcode = false, $markup_other = false) {
        require_once 'conf.php';
        $this->boardtype = $boardtype;
        $this->parentid = $parentid;
        $this->boardid = $boardid;
        // вернул trim 03.07.16
        $message = trim($message);
        $message = $this->CutWord($message, (KU_LINELENGTH / 15));
        $message = htmlspecialchars($message, ENT_QUOTES);
        // code highlighting
        $code_regexp = '`\[code(\\s)?(' . $this->get_code_lang_regexp() . ')?\](.+?)\[/code\]`is';
        $tohighlight = preg_split($code_regexp, $message);
        $codeblocks  = preg_replace_callback($code_regexp, array(&$this, 'add_code'), $message);
        $r = '';
        $code_blocks_added = 0;
        foreach($tohighlight as $textblock){
            $message = $textblock;
            if (KU_MAKELINKS) {
                $message = $this->MakeClickable($message);
            }
            $message = $this->ClickableQuote($message, $board, $boardtype, $parentid, $boardid, $ispage);
            $message = $this->ColoredQuote($message, $boardtype);
            /*if (KU_MARKDOWN) {
            require KU_ROOTDIR . 'lib/markdown/markdown.php';
            $message = Markdown($message);}*/
            $message = $this->ModTags($message);
            if($markup_bbcode){
                $message = $this->BBCode($message);
            }
            if($markup_wakabamark){
                $message = $this->WakabaMark($message);
            }
            if($markup_other){
                $message = $this->Other($message);
            }
            $message =  str_replace("\n", '<br>', $message);
            $message = $this->Wordfilter($message, $board);
            $message = $this->CheckNotEmpty($message);
            $message = $this->RemoveExtraNewlines($message);
            $r .= $message;
            if($code_blocks_added < count($this->code_matches)){
                $r .= $this->process_code($this->code_matches[$code_blocks_added]);
                $code_blocks_added++;
            }
        }
        return $r;
    }
}
?>
