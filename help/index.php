<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>WebNotebook - Help</title>
<link rel="stylesheet" type="text/css" href="style.css" title="style">
</head>

<body>

<h1>WebNotebook Help</h1>

<p>WebNotebook is an online public notebook. It is designed to resemble a physical notebook. This means:</p>
<ul>
<li>You can click anywhere on a page, and start typing there immediately.</li>
<li>Words don't wrap - characters stay exactly where you choose to type them.</li>
<li>The document is 'saved' automatically, in real time.</li>
</ul>
<p>WebNotebook is still in early development and testing stages.</p>


<h2>Pages</h2>

<p>To go to / create a page, type a <em>pageName</em> into the box on the <a href="../">home page</a>, or add the <em>pageName</em> to the end of the address.
For example, to load the page called <a href="../foo">foo</a>, add /foo to the end of the address.
To go to a specific line on a page, enter #<em>lineNumber</em> after the <em>pageName</em>.
For example: <a href="../foo#10">foo#10</a></p>

<p>When a page is loaded, the caret (cursor: <span class="caret">&nbsp;</span>) begins at the top left of the page, but it can be set to anywhere on the page by clicking.
Text can then be typed in directly at that location.</p>

<p>The page is saved automatically, in realtime, and any changes made by other users also appear on the page in realtime.</p>


<h2>Keys</h2>

<p>The following keys are available:</p>
<ul>
    <li>Input keys (characters, numbers, punctuation, backspace, delete, return).</li>
    <li>Arrow keys (up / down / left / right), to move the caret around on the page.</li>
    <li>Home / End keys.</li>
    <li>F1: Load the help page (this page).</li>
    <li>F2: Go to the address of the current line (the line the caret is on).</li>
    <li>F3: Create a link.</li>
</ul>


<h2>Links</h2>

<p>Links can be added to individual character 'cells' on the page.
Pressing F3 brings up an interface for adding a link to the current cell (the current position of the caret).
A link can have one of the following forms:</p>
<ul>
    <li>An external link. Eg: <a href="http://www.google.com/">http://www.google.com/</a></li>
    <li>An internal link. Eg: <a href="../foo">foo</a>, or <a href="../foo#10">foo#10</a></li>
</ul>

<p>A cell with a link associated with it is <span class="link">highlighted</span>. When a link is clicked on, an interface pops up, showing the hyperlink, and giving the user the following options:</p>
<ul>
    <li>Remove the link</li>
    <li>Follow the link</li>
</ul>


<h2>Further Development</h2>

<p>Plans for further development include the following:</p>
<ul>
    <li>Allowing pages to be password protected for private or read-only modes.</li>
    <li>Allowing pages and text to be individually stylised.</li>
    <li>Open source releasing of the code (once the site has reached a stable state).</li>
</ul>
<p>Any suggestions or bug reports are most welcome, and should be sent to <a href="http://www.adamkgray.com/contact">the developer</a>.</p>


<p class="footer">&copy; 2012 <a href="http://www.adamkgray.com/">Adam Gray</a>. All rights reserved.</p>

</body>
</html>
