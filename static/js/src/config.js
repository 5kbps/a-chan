
var config = {
	'hide_posts_mouse_move_delta':100,
	'op_reflist_on_top':false,
	'reply_reflist_on_top':false,
	'reflink_prefix':'>>',
	'reflink_op_postfix':'[OP]',
	'reflink_self_postfix':'[GET]',
	'post_reflink_text':'No. ',
	'highlight_timeout':5000,
	'clearreplyto_text':'[x]',
	'min_update_interval':20000,
	'highlighted_post_delay':150,
	'default_style':'Muon',
	'style_path':'/static/style.php',
	'board_path':'board.php',
	'reply_like_class':'reply-like',
	'loaded_post_class':'loaded-post',
	'highlighted_post_class':'highlighted-post',
	'outlined_post_class':'outlined-post',
	'delform_id':'del-form',
	'new_post_class':'new-post',
	'underlined_link_id':'underlined-link',
	'board_link_counter_class':'board-link-counter',
	'favicon_path':'/favicon.ico',
	'cpuboiler_path':'/static/js/src/cpuboiler.js',
	'captcha_min_length':1,
	'pow_allowed':true,
	'api_path':'api.php',
	'is_mobile':(typeof isMobile == 'function')?isMobile():false,
	'snow-delay':2,
	'snow-speed':1,
	'max_script_execution_time':3000,
}
function initConfig(){
	config.board = byName('board')[0].value
}

if(typeof getWindowSize != 'undefined'){
	config = collect({
		'loaded_post_min_width':300,
		'loaded_post_max_width':(getWindowSize().x > 1000)?1000:getWindowSize().x-10,
	},config)
}
var DefaultSettings = {
	'time_formatting': false,
	'time_format': 'dd.MM.yyyy (ddd) <b>HH:mm</b>:ss',
	'time_format_i': 1,
	'highlight_posts':false,
	'title_format': 'counter /boarddir/ - subject text boardname',
	'update': false,
	'autoupdate': true,
	'updateinterval': 40,
	'language': 'ru',
	'reflinks': true,
	'youtube': true,
	'max_youtube': 1,
	'youtube_info': true,
	'center_posts': false,
	'ignored_boards': '',
	'hidden_boards': '',
	'expandspoilers': false,
	'saveimages': true,
	'noinit': false,
	'unsafe_init':false,
	'reflist_on_top': false,
	'tab_notification': true,
	'ajax_post_send': false,
	'preference': 'pow',
	'hidden': {},
	'last_posts': {},
	'password': (typeof genPassword == 'function')?genPassword():'',
	'debug': false,
}
var Ref, flags = {
	'mouseposition': {
		'x':0,
		'y':0,
	},
}
var cache = {
	posts:{

	},
	requests:{

	},
	youtube:{

	},
	new_posts:{

	},
	check_passed: false,
	pow_status: 0,
	// 0 - not added
	// 1 - added
	// 2 - calculating
	// 3 - solved
	captcha_status: 0,
	// 0 - not added
	// 1 - added
	// 2 - expired
	// 3 - typed in
	// 4 - checking
	// 5 - checked
	timeout_status: 0,
	// 0 - not set
	// 1 - wait
	// 2 - ready
	last_check: 0,
	last_check_content: ''

}
var Settings
