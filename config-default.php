<?php
global $CONF;
$CONF = array(
    'MESSAGE_MAX_LENGTH' => 8192,
    'STYLES' => array(
        'Muon',
        'Neutron',
        'Photon',
        'Gentoo',
        'Achaba',
        'Futaba',
        'Burichan'
        ),
    // maximum length of [code]
    'CODE_HIGHLIGHTING_MAX_LENGTH' => 8192,
    // list of languages
    'CODE_HIGHLIGHTING_LANGUAGES'  => array(),
    // list of abbrs (abbr => name)
    'CODE_HIGHLIGHTING_LANGUAGE_ABBRS' => array(),
    // real names (name => text)
    'CODE_HIGHLIGHTING_LANGUAGE_NAMES' => array(),
    // board domains
    'BOARD_DOMAINS' => array(),
    'SECURITY_SECRET' => 'THIS IS A SECRET',
    // deprecated
    'SECURITY_SECRET_CAPTCHA_SIGN' => 'THIS IS A SECRET (captcha sign)',
    // maximum passed captchas
    'ANTIWIPE_CAPTCHA_MAX_PASSED' => 3,
    // maximum ttl for captcha
    'ANTIWIPE_CAPTCHA_MAX_AGE' => 300,
    // maximum ttl for passed captcha
    'ANTIWIPE_PASSED_CAPTCHA_MAX_AGE' => 2000,
    // maximum captcha codes alive at a time
    'ANTIWIPE_CAPTCHA_MAX_CODES' => 3,
    // config for captcha class
    'ANTIWIPE_CAPTCHA_CONFIG' => array('min_length' => 1,
        'max_length' => 1,
        'characters' => 'qwertyuiopasdfghjklzxcvbnm',
        'fonts' => array('alba.ttf'),
        'min_font_size' => 30,
        'max_font_size' => 40,
        'color' => '#666',
        'angle_min' => 0,
        'angle_max' => 10,
        'shadow' => true,
        'shadow_color' => '#333',
        'shadow_offset_x' => -1,
        'shadow_offset_y' => 1),
    // captcha after ? panicindex
    'ANTIWIPE_CAPTCHA_AFTER' => 10,
    // no more than ANTIWIPE_POSTING_TIME_LIMIT_POSTS_MAX per ANTIWIPE_POSTING_TIME_LIMIT
    'ANTIWIPE_POSTING_TIME_LIMIT' => 100,
    'ANTIWIPE_POSTING_TIME_LIMIT_POSTS_MAX' => 3,
    'ANTIWIPE_POWANDCAPTCHA_AFTER' => 0,
    'ANTIWIPE_POW_PANICINDEX_K' => 1,
    'GLOBALLOG_EXPIRE' => 5184000
);
?>
