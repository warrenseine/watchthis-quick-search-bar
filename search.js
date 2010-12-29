var timeoutHandler = 0;

var searchKeyDownHandler = function()
{
    if (timeoutHandler)
        clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(search, 200);
}

var previousText = null;

var search = function(text)
{
    var text = text || $("input#s").val();

    if (text == previousText)
        return;

    previousText = text;

    $.ajax({type: "POST",
            url: "http://watchth.is/search",
            data: "text=" + text,
            dataType: "html",
            success: function(response)
            {
                var results = $('div#movie-results div.boxgrid', response);

                $('div#quick-search').remove();

                if (results && results.size() > 0)
                {
                    var element = $('<div/>').appendTo(document.body);
                    var offset = $('div#searchbox').offset();

                    element.css('top', offset.top + 29);
                    element.css('left', offset.left + 58);
                    element.attr('id', 'quick-search');

                    $(document.body).append(element);

                    element = $('<table/>').appendTo(element);

                    results.each(function(index)
                                 {
                                     var tr = $('<tr/>');
                                     var link = $('div h3 a', this);
                                     var img = $('a img', this);
                                     var title = link.text();

                                     link.empty();

                                     var a = link.clone();
                                     tr.append($('<td/>').append(a.append(img)));
                                     a.mouseover(function() { select(index); });

                                     var a = link.clone();
                                     tr.append($('<td/>').append(a));
                                     a.mouseover(function() { select(index); });

                                     if (index == 0)
                                         a.addClass('quick-search-item-selected');
                                     a.addClass('quick-search-item');
                                     a.attr('name', index);
                                     a.text(title);

                                     element.append(tr);
                                 });

                }
            }
           });
}

var select = function(index)
{
    var element = $("div#quick-search");

    var prev = $("a.quick-search-item-selected", element);

    var next = $('a[name="' + index + '"]');

    prev.removeClass('quick-search-item-selected');
    next.addClass('quick-search-item-selected');
}

var globalKeyDownHandler = function(event)
{
    var element = $("div#quick-search");

    if (element.size() == 0)
        return true;

    var selected = $("a.quick-search-item-selected", element);
    var all = $("a.quick-search-item", element);
    var length = all.size();

    switch (event.which)
    {
    case 38 /* up */:
        var n = mod(parseInt(selected.attr('name')) - 1, length);
        select(n);
        return false;

    case 40 /* down */:
        var n = mod(parseInt(selected.attr('name')) + 1, length);
        select(n);
        return false;

    case 14:
    case 13 /* enter */:
        selected.click();
        console.log(document.location.href);
        return false;

    case 27 /* esc */:
        element.remove();
        return false;
    }
}

var globalClickHandler = function(event)
{
    $("div#quick-search").remove();
}

var mod = function(a, b)
{
    var r = a % b;
    if (r < 0)
        r += b;
    return r;
}

var main = function()
{
    $("input#s").keydown(searchKeyDownHandler);
    $(document).keydown(globalKeyDownHandler);
    $(document).click(globalClickHandler);
}

main();
