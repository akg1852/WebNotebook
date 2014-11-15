<?php 
     // Connects to database
     
    $dbHost = "localhost";
    $dbUser = "root";
    $dbPass = "";
    $dbDatabase = "webnotebook";
     
     mysql_connect($dbHost, $dbUser, $dbPass) or die(mysql_error());
     mysql_set_charset ('utf8');
     
     mysql_query("CREATE DATABASE IF NOT EXISTS $dbDatabase") or die(mysql_error());
     
     mysql_select_db($dbDatabase) or die(mysql_error());
     
     mysql_query("
        CREATE TABLE IF NOT EXISTS `data` (
            `documentID` text NOT NULL,
            `row` bigint(20) unsigned NOT NULL,
            `col` int(10) unsigned NOT NULL,
            `value` char(1) NOT NULL,
            `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`documentID`(50),`row`,`col`),
            KEY `value` (`value`,`lastModified`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
    ") or die(mysql_error());
    
    mysql_query("
        CREATE TABLE IF NOT EXISTS `links` (
              `documentID` text NOT NULL,
              `row` bigint(20) unsigned NOT NULL,
              `col` int(10) unsigned NOT NULL,
              `url` text NOT NULL,
              `lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`documentID`(50),`row`,`col`),
              KEY `lastModified` (`lastModified`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
    ") or die(mysql_error());
    
    // <-- find a way to periodically back up the database
     
 ?> 
