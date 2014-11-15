<?php 
// session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>WebNotebook</title>

<link rel="stylesheet" type="text/css" href="document.css" title="document style">
<script src="/jquery.js" type="text/javascript"></script>
</head>

<body>

<?php
if (isset($_GET['id']) && preg_match("/^[a-z0-9_-]+$/i", $_GET['id'])) { // id is a valid document id
    
?>

<!-- begin document -->
    <script src="document.js" type="text/javascript"></script>
    
    <div id="page" tabindex=0>
        <h1 id="documentID"><?php echo $_GET['id'] ?></h1>
        <div id="content"></div>
    </div>
    
    <div id="loading">Loading...</div>
    
    <div id="createLink">
        Enter url for link:
        <input type="text" id="createLink-url" value="http://"><br>
        <input type="button" id="createLink-cancel" value="Cancel">
        <input type="button" id="createLink-ok" value="OK"><br>
    </div>
    
    <div id="followLink">
        <a id="followLink-url" href="">Link</a>:<br><br>
        <input type="button" id="followLink-cancel" value="Cancel">
        <input type="button" id="removeLink-ok" value="Remove Link">
        <input type="button" id="followLink-ok" value="Follow Link"><br>
    </div>
    
<!-- end document -->

<?php
}
else {
?>

<!-- begin invalid document -->
    <p>Invalid document. Try again.</p>
<!-- end invalid document -->

<?php
}
?>

</body>
</html>
