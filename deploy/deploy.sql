DROP TABLE IF EXISTS timing;
CREATE TABLE if NOT EXISTS antiwipe (
	`id` smallint(5) unsigned NOT NULL,
	`name` varchar(75) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
	`timefilter` TINYINT(1) DEFAULT 0,
	`timefiltervalue` INT NOT NULL DEFAULT 15,
	`timethreadfilter` TINYINT(1) DEFAULT 0,
	`timethreadfiltervalue` INT NOT NULL DEFAULT 300,
	`wipefilter` TINYINT(1) DEFAULT 0,
	`logall` TINYINT(1) DEFAULT 1,
	`jscheck` TINYINT(1) DEFAULT 0,
	`pow` TINYINT(1) DEFAULT 0,
	`powvalue` smallint(100) unsigned DEFAULT 0,
	`powafter` INT DEFAULT 20,
	`confirmation` TINYINT(1) DEFAULT 0,
	`confirmationafter` INT DEFAULT 10,
	`fullauto` TINYINT(1) DEFAULT 1,
	`panicindex` INT DEFAULT 0,
	`panicindextimeout` INT default 1000,
	PRIMARY KEY (`id`)
);

CREATE TABLE if NOT EXISTS timing (
	`id` INT unsigned NOT NULL AUTO_INCREMENT,
	`task` TEXT,
	`timestamp` int(20) unsigned NOT NULL,
	`obj` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE if NOT EXISTS postevents (
	`id` INT unsigned NOT NULL AUTO_INCREMENT,
	`type` varchar(75) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unknown',
	`success` TINYINT(1) DEFAULT 0,
	`no_success_reason` text,
	`useragent` text,
	`message` text NOT NULL,
	`boardid` smallint(5) unsigned NOT NULL,
  	`parentid` int(10) unsigned NOT NULL DEFAULT '0',
  	`name` varchar(255) NOT NULL,
  	`tripcode` varchar(30) NOT NULL,
  	`email` varchar(255) NOT NULL,
  	`subject` varchar(255) NOT NULL,
  	`password` varchar(255) NOT NULL,
	`timestamp` int(20) unsigned NOT NULL,
  	`file` varchar(50) NOT NULL,
	`file_md5` char(32) NOT NULL,
	`file_type` varchar(20) NOT NULL,
	`file_original` varchar(255) NOT NULL,
	`file_size` int(20) NOT NULL DEFAULT '0',
	`file_size_formatted` varchar(75) NOT NULL,
	`image_w` smallint(5) NOT NULL DEFAULT '0',
	`image_h` smallint(5) NOT NULL DEFAULT '0',
	`thumb_w` smallint(5) unsigned NOT NULL DEFAULT '0',
	`thumb_h` smallint(5) unsigned NOT NULL DEFAULT '0',
	`ip` varchar(75) NOT NULL,
	`ipmd5` char(32) NOT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS posthashes;
CREATE TABLE if NOT EXISTS posthashes (
	`timestamp` int(20) unsigned NOT NULL,
  	`hash` char(32) NOT NULL,
	PRIMARY KEY (`hash`)
);
DROP TABLE IF EXISTS globallog;
CREATE TABLE if NOT EXISTS globallog (
	`id` INT unsigned NOT NULL AUTO_INCREMENT,
	`timestamp` int(20) unsigned NOT NULL,
	`type` char(32) NOT NULL,
	`text` TEXT DEFAULT NULL,
	`meta` TEXT DEFAULT NULL,
	PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS sessions;
CREATE TABLE IF NOT EXISTS sessions (
	`session` TEXT NOT NULL,
	`timestamp` int(20) unsigned NOT NULL,
	`id` INT unsigned NOT NULL AUTO_INCREMENT,
	`type` int(5) unsigned NOT NULL,
	PRIMARY KEY (`id`)
);
ALTER TABLE banlist ADD session TEXT DEFAULT NULL after ip;
ALTER TABLE posts ADD session TEXT DEFAULT NULL after ip;

