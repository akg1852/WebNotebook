<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>WebNotebook</title>

<link rel="stylesheet" type="text/css" href="style.css" title="style">
<script src="/jquery.js" type="text/javascript"></script>
</head>

<body>

<h1>WebNotebook</h1>

<div id="content">
<p>Enter the name of a document:</p>
<form id="document" autocomplete="off">
<input type="text" id="id"><input type="submit" id="submit" value="Go">
</form>
<p>For instructions on use, please visit the <a href="help">help</a> page.</p>
</div>

<script type="text/javascript">
    $('#document').submit(function(e){
        var id     = $('#id').val(),
            regexp = /^[a-z0-9_-]*(#[0-9]+)?$/i;
        if (regexp.test(id)) {
            location.href = id;
        }
        else {
            $('#id').val('')
        }
        e.preventDefault();
    });
</script>
</body>
</html>
