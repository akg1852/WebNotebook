$(function(){
    var inputBuffer  = {},
        linkBuffer = {},
        content = {},
        context = {$start: $(null), $caret: $(null)},
        rows = 0,
        timestamp = "",
        POLL_INTERVAL = 100,
        COLS = 80, // width of document
        MIN_PAGES = 3; // minimum number of windows' worth of document to have loaded below scrollTop
    
    
    // window events:
    $(window).on({
        // auto-load more page while scrolling down:
        'scroll': function() {
            var freeScroll = $(document).height() - $(window).scrollTop() - MIN_PAGES * $(window).height();
            if  (freeScroll <= 0) {
               addRows(-freeScroll / context.$caret.height());
            }
        },
        // load more content if moving to anchor not currently displayed:
        'hashchange': function() {
            toHash();
        },
        // open help:
        'keydown': function(e) {
            if (e.keyCode == 112) { // f1
                open('help');
            }
        }
    });
    
    
    // #page .cell events:
    $('#page').on({
        // when makeContext event of cell fires, set up a new context for the cell:
        'makeContext': function() {
            $('.context').removeClass('context');
            context.$caret.removeClass('caret');
            context = {
                $start : $(this),
                $caret : $(this).addClass('caret')
            };
        },
        // cell's click event:
        click: function() {
            // trigger cell's makeContext event:
            $(this).trigger('makeContext');
            
            // if cell has a link, open the 'followLink' prompt:
            if ($(this).hasClass('link')) {
                $('#followLink-url').attr('href', context.$caret.data('url'));
                $('#followLink').data('cell', context.$caret).css('display', 'block');
                $('#followLink-ok').focus();
            }
        }
        
    }, '.cell');
    
    // #page events:
    $('#page').on({
        // respond to 'special' keyboard input:
        'keydown': function(e) {
            var loc = context.$caret.data('loc'),
                r = loc[0], c = loc[1];
                
            switch (e.keyCode) {
                case 8: // backspace
                    var isContextAbove = false,
                        contextLeft = context.$start.data('loc')[1];
                    context.$caret.closest('.line').prevAll('.line').children('.context').each(function() {
                        if ($(this).data('loc')[1] >= contextLeft) {
                            isContextAbove = true;
                            return false;
                        }
                    });
                    if (c == contextLeft && isContextAbove) {
                        var lastContextLoc = context.$caret.closest('.line').prev('.line').children('.context:last').data('loc');
                        if (lastContextLoc && lastContextLoc[0] == r-1 && lastContextLoc[1] >= contextLeft) {
                            moveTo([r-1, lastContextLoc[1]]);
                            write();
                        }
                        else {
                            moveTo([r-1, contextLeft]);
                        }
                    }
                    else {
                        if (c > 0) {
                            moveTo([r, c-1]);
                            write();
                            if (c <= contextLeft && !context.$caret.hasClass('context')) context.$caret.trigger('makeContext');
                        }
                        else if (r > 0) {
                            moveTo([r-1, COLS-1]);
                            write();
                        }
                    }
                    e.preventDefault(); break;
                case 13: // return
                    newLine();
                    e.preventDefault(); break;
                case 35: // end
                    $(window).scrollTop($(document).height() - MIN_PAGES * $(window).height());
                    e.preventDefault(); break;
                case 36: // home
                    $(window).scrollTop(0);
                    e.preventDefault(); break;
                case 37: // left
                    if (c > 0) moveTo([r, c-1]);
                    e.preventDefault(); break;
                case 38: // up
                    if (r > 0) moveTo([r-1, c]);
                    e.preventDefault(); break;
                case 39: // right
                    if (c < COLS-1) moveTo([r, c+1]);
                    e.preventDefault(); break;
                case 40: // down
                    if (r < rows-1) moveTo([r+1, c]);
                    e.preventDefault(); break;
                case 46: // delete
                    write();
                    e.preventDefault(); break;
                case 113: // f2: go to anchor of caret
                    document.location.hash = context.$caret.data('loc')[0];
                    $('#page').focus();
                    e.preventDefault(); break;
                case 114: // f3: create link
                    $('#createLink').css('display', 'block');
                    $('#createLink-url').focus();
                    e.preventDefault(); break;
            }
        },
        // respond to 'normal' keyboard input:
        keypress: function(e) {
            var key = (e.which || e.keyCode),
                loc = context.$caret.data('loc'),
                r = loc[0], c = loc[1];
            
            if (e.which !== 0 && key > 31 && !e.ctrlKey && !e.altKey) { // if key is not a special key
                // write the input character to the caret position:
                write(String.fromCharCode(key));
                context.$caret.addClass('context');
                
                // move caret to the NEXT cell:
                if (c < COLS-1) moveTo([r, c+1]);
                else newLine();
                
                e.preventDefault();
            }
        }
    });
    
    
    // create link, cancel:
    $('#createLink-cancel').click(function(e) {
        $('#createLink').css('display', 'none');
        $('#createLink-url').val('http://');
        $('#page').focus();
    });
    // create link, ok:
    $('#createLink-ok').click(function(e) {
        $('#createLink').css('display', 'none');
        
        var url = $('#createLink-url').val(),
            urlRegexp = /^(https?|ftp|mailto):\/\/[a-z0-9\._-]{3,}\.[a-z]{2,3}(\/[a-z0-9\._-]*)*(\?([a-z0-9\.=&_,+-]+))?(#([a-z0-9\.=&_,+-]+))?$/i,
            internalUrlRegexp = /^[a-z0-9_-]*(#[0-9]+)?$/i;
        if (urlRegexp.test(url) || internalUrlRegexp.test(url)) {
            context.$caret.addClass('link').data('url', url).attr('title', url);
            linkBuffer[context.$caret.data('loc')] = url; // add to linkBuffer
        }
        
        $('#createLink-url').val('http://');
        $('#page').focus();
    });
    // create link, keydown:
    $('#createLink-url').keydown(function(e) {
        if (e.keyCode == 13) { // return
            $('#createLink-ok').click();
        }
        else if (e.keyCode == 27) { // escape
            $('#createLink-cancel').click();
        }
    });
    
    
    // follow link, cancel:
    $('#followLink-cancel').click(function(e) {
        $('#followLink').css('display', 'none');
        $('#page').focus();
    });
    // remove link, ok:
    $('#removeLink-ok').click(function(e) {
        var $cell = $('#followLink').data('cell');
        $('#followLink').css('display', 'none');
        $('#page').focus();
        $cell.removeClass('link').removeData('url').removeAttr('title');
        linkBuffer[$cell.data('loc')] = ''; // add to linkBuffer
    });
    // follow link, ok:
    $('#followLink-ok').click(function(e) {
        $('#followLink').css('display', 'none');
        $('#page').focus();
        location.href = $('#followLink-url').attr('href');
    });
    // create link, keydown:
    $('#followLink').keydown(function(e) {
        if (e.keyCode == 27) { // escape
            $('#followLink-cancel').click();
        }
    });
    
    
    
    
    // set up the page:
    addRows(1); moveTo([0,0]);
    update(); // poll the server for content updates
    
    
    
    
    // FUNCTIONS:
    
    function newLine() {
        var r = context.$caret.data('loc')[0] + 1,
            c = context.$start.data('loc')[1];
        if (r < rows) moveTo([r, c])
    }
    function moveTo(loc) {
        context.$caret.removeClass('caret'); // remove old caret
        context.$caret = content[loc].addClass('caret'); // add new caret
        
        var caretTop = context.$caret.offset().top,
            scrollTop = $(window).scrollTop(),
            windowHeight = $(window).height(),
            rowHeight = context.$caret.height();
            
        if (caretTop - scrollTop > 0.99 * windowHeight)               // if cursor at bottom of window,
            $(window).scrollTop(caretTop - windowHeight + rowHeight); // scroll down a row.
        else if (caretTop - scrollTop < 0.01 * windowHeight)          // if cursor at top of window,
            $(window).scrollTop(caretTop);                            // scroll up a row.
    }
    function write(value, cell, addToBuffer) {
        if (cell === undefined) cell = context.$caret;
        value = value ? String(value)[0].replace(/\s/, '\u00a0') : '\u00a0';
        cell.text(value); // update display
        if (addToBuffer || addToBuffer === undefined) inputBuffer[cell.data('loc')] = value; // add to inputBuffer
    }
    function update() {
        var inputBufferCopy = inputBuffer, // copy buffers
            linkBufferCopy = linkBuffer;
        inputBuffer = {}; // clear buffers
        linkBuffer = {};
        $.ajax({ type: "POST", url: "update.php", contentType: "application/json", dataType: "json", processData: "false",
            data: JSON.stringify({
                documentID: $('#documentID').text(),
                data: inputBufferCopy,
                links: linkBufferCopy,
                time: timestamp
            }),
            success: function(result) {
                connection(true);
                timestamp = result.timestamp; // update the timestamp
                
                for (var cell in result.data) { // apply changes to data
                    var n = Number(cell.split(',')[0]); // get row of cell
                    if (n >= rows) addRows(n + 1 - rows); // add rows if necessary
                    
                    write(result.data[cell], content[cell], false); // write to screen
                }
                for (var cell in result.links) { // apply changes to links
                    var n = Number(cell.split(',')[0]); // get row of cell
                    if (n >= rows) addRows(n + 1 - rows); // add rows if necessary
                    
                    if (result.links[cell]) { // update cell
                        content[cell].addClass('link').data('url', result.links[cell]).attr('title', result.links[cell]);
                    }
                    else {
                        content[cell].removeClass('link').removeData('url').removeAttr('title');
                    }
                }
                if ($('#page').css('visibility') == 'hidden') {
                    $('#page').css('visibility', 'visible');
                    toHash();
                }
            },
            error: function() {
                connection(false);
                for (var a in inputBuffer) { inputBufferCopy[a] = inputBuffer[a]; } // return values to buffers
                for (var a in linkBuffer) { linkBufferCopy[a] = linkBuffer[a]; }
                inputBuffer = inputBufferCopy;
                linkBuffer = linkBufferCopy;
            },
            complete: function() {
                setTimeout(update, POLL_INTERVAL);
            }
        });
    }
    function addRows(n) {
        var $block = $('<div></div>'),
            $row, $cell, r, c;
        for (r = 0; r < n; r++, rows++) {
            $row = $('<div class="line"><a name="' + rows + '"></a></div>');
            for (c = 0; c < COLS; c++) {
                $cell = $('<span class="cell">&nbsp;</span>').data('loc', [rows,c]);
                content[[rows,c]] = $cell;
                $row.append($cell);
            }
            $block.append($row);
        }
        $block.children().appendTo($('#content'));
    }
    function toHash() {
        var hash = document.location.hash.match(/^#(\d*)$/),
            n = hash ? Number(hash[1]) : 0,
            rowsPerWindow = Math.ceil($(window).height() / context.$caret.height());
        if (n >= rows - MIN_PAGES * rowsPerWindow) addRows(MIN_PAGES * rowsPerWindow + n - rows); // add rows if necessary
        if (!context.$start.data('loc') || context.$caret.data('loc')[0] !== n) {
            moveTo([n,0]); // set caret position
            context.$caret.trigger('makeContext'); // set context
        }
        if (n) document.location.hash = n; // set hash
        $('#page').focus();
    }
    function connection(status) {
        status ? $('body').removeClass('offline') : $('body').addClass('offline');
    }
    
});
