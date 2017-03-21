if (typeof artoo == 'undefined') {
    throw new Exception('Extension loaded before artoo.  Please refresh.  This will be fixed soon.');
}
/*
 emitter.on("init", function () { console.log("test");

 artoo.destroyDataTables();


 });
 */

artoo.collection = [];

/**
 * Destroy DataTables to extract data.
 */
artoo.destroyDataTables = function () {
    if (typeof $.fn.DataTable !== 'function') {
        return;
    }
    try {
        $('table').DataTable().destroy();
    } catch (e) {

    }
}

/**
 * Click Handler.
 */
artoo.clickHandler = function (e) {
    var ele = e.target;
    e.preventDefault();
    if (!ele.nodeType == 1 && !ele.nodeType == 11 && !ele.nodeType == 9) {
        return;
    }

    // Trap door for entries.
    var temp = ele.getAttribute('data-crumblsIgnore');
    if (temp && temp == true) {
        return;
    }

    var method = '_handle' + ele.nodeName;

    var parse = false;

    // Does this type have it's own handling method?  If so, parse.
    if (typeof artoo[method] == 'function') {
        parse = artoo[method](ele);
        if (!parse) {
            return;
        }
    } else {
        // Fallback.
        parse = {};
    }

    // Fallback: xpath
    if (typeof parse.csspath == 'undefined') {
        parse.csspath = artoo.getElementCssPathSimplified(ele);
    }

    // Prevent duplicates.
    if (typeof artoo.collection[parse.csspath] == 'object') {
        artoo.log.info('Already in collection, skipping. `' + parse.csspath + '`');
        return;
    }

    if (typeof parse.extract == 'undefined') {
        parse.extract = {
            'data': 'text'
        }
    }

    // Add rows for tables.  It's ugly, but works.
    if (parse.csspath.indexOf(' tr') > -1) {
        temp = false;
        /*
        parse.extract.row = function($) {
            var tr = $(this).closest('tr')
            if (!tr) {
                return false;
            }
            tr = tr[0];
            return tr.rowIndex;
        }
        */
        if (typeof parse.extract.group == 'undefined') {
            parse.extract.group = function($) {
                var tr = $(this).closest('tr')
                if (!tr) {
                    return false;
                }
                var t = tr.closest('table').index();
                tr = tr[0];
                return t + '-' + tr.rowIndex;
            }
        }
    }

    if (typeof parse.extract.group == 'undefined') {
        parse.extract.group = -1;
    }

    if (typeof parse.extract.name == 'undefined') {
        var temp = parse.csspath.split('>');
        parse.extract.name = temp[temp.length - 1].trim();
    }

    return parse;
}

artoo.getElementCssPathSimplified = function (ele) {
    var path = artoo.getElementCssPath(ele);
    // Now. simplify it.


    // Clean up TR
    if (true) {
        path = path.replace(/tr\..*?[\s|$]/, ' tr ');
        path = path.replace(/tr:nth-child\(\d+\)/g, ' tr ');
    }
    path = path.replace(/\s+>\s+>\s/g, ' > ');
    path = path.replace(/>\s{2,}(.*?)\s{2,}/g, '> $1 >');
    path = path.replace(/\s+/g, ' ');

    path = path.trim();

    return path;
}

artoo.getElementCssPath = function (ele) {
    var xpath = [];

    while (ele) {
        if (ele.nodeType !== Node.ELEMENT_NODE) {
            ele = el.parentNode;
            continue;
        }
        // Break at first ID.
        var id = ele.getAttribute('id');
        if (id) {
            id = id.replace(/^#/, '').trim();
            xpath.push('#' + id);
            el = false;
            break;
        }

        // Quick filter to match node type.
        var cl = false;

        function filter(e) {
            if (e.nodeName != ele.nodeName) {
                return false;
            }
            if (ele.classList.length > 0) {
                if (!cl) {
                    cl = Array.from(ele.classList);
                }
                var temp = Array.from(e.classList);
                var fail = cl.filter(function (n) {
                    return temp.indexOf(n) == -1;
                });
                return !fail.length;
            }
            return true;
        }

        // Get siblings.
        var siblings = [];
        var temp = ele.parentNode.firstChild;
        do {
            if (!filter || filter(temp)) siblings.push(temp);
        } while (temp = temp.nextSibling);

        if (siblings.length > 1) {
            // Get our current index.
            for (var i = 0; i < siblings.length && siblings[i] !== ele; i++);
            i++;

            var t = ele.nodeName.toLowerCase();
            for (var x = 0; x < ele.classList.length; x++) {
                t = t + '.' + ele.classList[x];
            }
//            if (i > 0) {}
            t = t + ':nth-child(' + i + ')';
            xpath.push(t);


//            xpath.push(ele.nodeName.toLowerCase() + ':nth-child(' + i + ')');
        } else {
            var t = ele.nodeName.toLowerCase();
            for (var i = 0; i < ele.classList.length; i++) {
                t = t + '.' + ele.classList[i];
            }
            xpath.push(t);
        }

        ele = ele.parentNode;
    }
    xpath = xpath.reverse();
    return xpath.join(' > ');
}

/**
 * Handle element: A
 * @param ele
 * @returns {{extract: {url: string, title: string}}}
 * @private
 */
artoo._handleA = function (ele) {
    return {
        extract: {
            url: 'href',
            title: 'text',
        }
    }
}

artoo.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

artoo.export = artoo.debounce(function() {
    // All the taxing stuff you do
//    console.log(artoo.collection);

    var groups = {};

    Object.keys(artoo.collection).map(function(key, index) {
        artoo.$.map(artoo.collection[key], function(e) {
            if (typeof groups[e.group] == 'undefined') {
                groups[e.group] = {};
            }
            if (e.name == 'undefined' || !e.name) {
                e.name = Object.keys(groups[e.group]).length;
            }
            groups[e.group][e.name] = e;
        });
    });

    console.log(JSON.stringify(groups));

return;
    artoo.$.map(artoo.collection, function(e) {
        console.log(e);
        return 'a';
    });
//    console.log(artoo.collection);
    return;
//    $.map(

    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            console.log(rv);
            return rv;
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    console.log(groupBy(artoo.collection, 'group'));


//    console.log(JSON.stringify(artoo.collection));
}, 500);



/**
 * Initializer
 */
artoo.initExtension = function () {
    artoo.destroyDataTables();

    /**
     * This click handler tracks DOM events and will either clear out our current or
     */
    document.addEventListener('click', function (e) {
        // Depending on environment being server or local, handle our request.
        var parse = artoo.clickHandler(e);
        if (!parse) {
            return;
        }

        artoo.collection[parse.csspath] = artoo.scrape(parse.csspath, parse.extract);

        artoo.export();

        //console.log(artoo.collection[parse.cssPath]);
        return artoo.collection[parse.cssPath];
    });
}
artoo.initExtension();