<?php
    // session_start();
    header('Content-Type: application/json; charset=UTF-8');
    
    // get input and validate it:
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['documentID']) || !preg_match("/^[a-z0-9_-]+$/i", $input['documentID'])) die('Invalid document ID');
    if(!isset($input['time']) || !preg_match("/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})?$/", $input['time'])) die('Invalid timestamp');
    if(!isset($input['data']) || !is_array($input['data'])) die('Invalid data array');
    if(!isset($input['links']) || !is_array($input['links'])) die('Invalid link array');
    // <-- check permissions, and password if applicable, or die('Access Denied').
    
    // declare variables:
    $documentID = substr($input['documentID'], 0, 50);
    $time = $input['time'];
    $outputData = array();
    $outputLinks = array();
    
    // connect to database, and get current time:
    include 'dbconnect.php'; //  connect to database
    $now = mysql_fetch_array(mysql_query("select now()")); $now = $now[0];
    
    
    // process incoming data:
    foreach ($input['data'] as $key => $value) {
        if (!preg_match("/^\d+,\d+$/", $key) || !preg_match("(.|\xA0)", $value)) die('Invalid data entry');
        $cell = explode(",", $key);
        $value = mysql_real_escape_string($value);
        mysql_query("replace into data values(
            \"$documentID\",
            $cell[0], 
            $cell[1], 
            \"$value\", 
            null)"
        );
    }
    // <-- update the document table in db
    
    
    // process incoming links:
    foreach ($input['links'] as $key => $value) {
        if (!preg_match("/^\d+,\d+$/", $key) || 
            !preg_match("/^(((https?|ftp|mailto):\/\/[a-z0-9\._-]{3,}\.[a-z]{2,3}(\/[a-z0-9\._-]*)*(\?([a-z0-9\.=&_,+-]+))?(#([a-z0-9\.=&_,+-]+))?)|([a-z0-9_-]*(#[0-9]+)?))$/i", $value)) die('Invalid link entry');
        $cell = explode(",", $key);
        $value = mysql_real_escape_string($value);
        mysql_query("replace into links values(
            \"$documentID\",
            $cell[0], 
            $cell[1], 
            \"$value\", 
            null)"
        );
    }
    // <-- update the document table in db
    
    // remove old blank entries from db (which are put in to update 'cleared cells' in realtime):
    mysql_query("delete from data where value = '' and lastModified < now() - interval 10 minute");
    mysql_query("delete from links where url = '' and lastModified < now() - interval 10 minute");
    
    // get newly modified data from db:
    $result = mysql_query("select row, col, value from data where documentID = \"$documentID\" and lastModified >= \"$time\"");
    if(mysql_num_rows($result) > 0) {
        while($cell = mysql_fetch_array($result)) {
            $outputData[$cell['row'] . ',' . $cell['col']] = $cell['value'];
        }
    }
    // <-- update the document table in db
    
    // get newly modified links from db:
    $result = mysql_query("select row, col, url from links where documentID = \"$documentID\" and lastModified >= \"$time\"");
    if(mysql_num_rows($result) > 0) {
        while($cell = mysql_fetch_array($result)) {
            $outputLinks[$cell['row'] . ',' . $cell['col']] = $cell['url'];
        }
    }
    // <-- update the document table in db
    
    // echo the result:
    echo json_encode(array('timestamp' => $now, 'data' => $outputData, 'links' => $outputLinks));



