/* artoo.js - The client-side scraping companion. - Version: 0.3.4 - Author: Yomguithereal - medialab SciencesPo */
(function(e) {
    "use strict";
    var t;
    "document" in this && (t = document.getElementsByTagName("body")[0], t || (t = document.createElement("body"), document.documentElement.appendChild(t)));
    var o = {
        $: {},
        jquery: {
            applyPlugins: function() {
                o.jquery.plugins.map(function(e) {
                    e(o.$)
                })
            },
            plugins: []
        },
        mountNode: t,
        stylesheets: {},
        templates: {},
        _enabled: !0,
        _children: [],
        _handlers: {},
        _handlersAll: []
    };
    Object.defineProperty(o, "version", {
        value: "0.3.3"
    }), this.artoo = o
}).call(this),
    function() {
        "use strict";

        function e(e) {
            var t, o, n = [];
            for (t = 0, o = e.length; t < o; t++) n.push(e[t].handler);
            return n
        }

        var t = {
                once: "boolean",
                scope: "object"
            },
            o = function() {
                this._enabled = !0, this._children = [], this._handlers = {}, this._handlersAll = []
            };
        o.prototype.on = function(e, n, r) {
            var i, a, s, c, l, u;
            if ("function" == typeof n) {
                for (l = "string" == typeof e ? [e] : e, i = 0, a = l.length; i !== a; i += 1)
                    if (c = l[i]) {
                        this._handlers[c] || (this._handlers[c] = []), u = {
                            handler: n
                        };
                        for (s in r || {}) {
                            if (!t[s]) throw new Error('The option "' + s + '" is not recognized by Emmett.');
                            u[s] = r[s]
                        }
                        this._handlers[c].push(u)
                    }
            } else if (e && "object" == typeof e && !Array.isArray(e))
                for (c in e) o.prototype.on.call(this, c, e[c], n);
            else {
                if ("function" != typeof e) throw new Error("Wrong arguments.");
                u = {
                    handler: e
                };
                for (s in r || {}) {
                    if (!t[s]) throw new Error('The option "' + s + '" is not recognized by Emmett.');
                    u[s] = r[s]
                }
                this._handlersAll.push(u)
            }
            return this
        }, o.prototype.once = function(e, t, o) {
            if ("function" == typeof t) o = o || {}, o.once = !0, this.on(e, t, o);
            else {
                if ((!e || "object" != typeof e || Array.isArray(e)) && "function" != typeof e) throw new Error("Wrong arguments.");
                t = t || {}, t.once = !0, this.on(e, t)
            }
            return this
        }, o.prototype.off = function(e, t) {
            var o, n, r, i, a, s, c, l = "string" == typeof e ? [e] : e;
            if (1 === arguments.length && "function" == typeof l) {
                t = arguments[0];
                for (a in this._handlers) {
                    for (s = [], o = 0, n = this._handlers[a].length; o !== n; o += 1) this._handlers[a][o].handler !== t && s.push(this._handlers[a][o]);
                    this._handlers[a] = s
                }
                for (s = [], o = 0, n = this._handlersAll.length; o !== n; o += 1) this._handlersAll[o].handler !== t && s.push(this._handlersAll[o]);
                this._handlersAll = s
            } else if (2 === arguments.length)
                for (o = 0, n = l.length; o !== n; o += 1) {
                    if (c = l[o], this._handlers[c]) {
                        for (s = [], r = 0, i = this._handlers[c].length; r !== i; r += 1) this._handlers[c][r].handler !== t && s.push(this._handlers[c][r]);
                        this._handlers[c] = s
                    }
                    this._handlers[c] && 0 === this._handlers[c].length && delete this._handlers[c]
                }
            return this
        }, o.prototype.unbindAll = function() {
            var e;
            this._handlersAll = [];
            for (e in this._handlers) delete this._handlers[e];
            return this
        }, o.prototype.emit = function(e, t) {
            var o, n, r, i, a, s, c, l, u, f, h = "string" == typeof e ? [e] : e;
            if (!this._enabled) return this;
            for (t = void 0 === t ? {} : t, o = 0, n = h.length; o !== n; o += 1)
                if (f = h[o], u = (this._handlers[f] || []).concat(this._handlersAll), u.length) {
                    for (c = {
                        type: f,
                        data: t || {},
                        target: this
                    }, s = [], r = 0, i = u.length; r !== i; r += 1)(this._handlers[f] && this._handlers[f].indexOf(u[r]) >= 0 || this._handlersAll.indexOf(u[r]) >= 0) && (u[r].handler.call("scope" in u[r] ? u[r].scope : this, c), u[r].once && s.push(u[r]));
                    for (a = 0; a < s.length; a++) this._handlers[f].splice(s.indexOf(s[a]), 1)
                }
            for (o = 0, n = this._children.length; o !== n; o += 1) l = this._children[o], l.emit.apply(l, arguments);
            return this
        }, o.prototype.child = function() {
            var e = this,
                t = new o;
            return t.on("emmett:kill", function() {
                if (e._children)
                    for (var o = 0, n = e._children.length; o < n; o++)
                        if (e._children[o] === t) {
                            e._children.splice(o, 1);
                            break
                        }
            }), this._children.push(t), t
        }, o.prototype.listeners = function(t) {
            var o, n, r, i = [];
            if (t)
                for (i = e(this._handlers[t]), n = 0, r = this._children.length; n < r; n++) i = i.concat(this._children[n].listeners(t));
            else {
                i = e(this._handlersAll);
                for (o in this._handlers) i = i.concat(e(this._handlers[o]));
                for (n = 0, r = this._children.length; n < r; n++) i = i.concat(this._children[n].listeners())
            }
            return i
        }, o.prototype.kill = function() {
            if (this.emit("emmett:kill"), this.unbindAll(), this._handlers = null, this._handlersAll = null, this._enabled = !1, this._children)
                for (var e = 0, t = this._children.length; e < t; e++) this._children[e].kill();
            this._children = null
        }, o.prototype.disable = function() {
            return this._enabled = !1, this
        }, o.prototype.enable = function() {
            return this._enabled = !0, this
        }, o.version = "2.1.2", artoo.emitter = o
    }.call(this),
    function(e) {
        function t(t) {
            function o(e) {
                var o, n = t(e.ownerDocument);
                return e = t(e), o = e.offset(), {
                    x: o.left + e.outerWidth() / 2 - n.scrollLeft(),
                    y: o.top + e.outerHeight() / 2 - n.scrollTop()
                }
            }

            function n(e) {
                var o, n = t(e.ownerDocument);
                return e = t(e), o = e.offset(), {
                    x: o.left - n.scrollLeft(),
                    y: o.top - n.scrollTop()
                }
            }

            var r = /^key/,
                i = /^(?:mouse|contextmenu)|click/;
            t.fn.simulate = function(e, o) {
                return this.each(function() {
                    new t.simulate(this, e, o)
                })
            }, t.simulate = function(e, o, n) {
                var r = t.camelCase("simulate-" + o);
                this.target = e, this.options = n, this[r] ? this[r]() : this.simulateEvent(e, o, n)
            }, t.extend(t.simulate, {
                keyCode: {
                    BACKSPACE: 8,
                    COMMA: 188,
                    DELETE: 46,
                    DOWN: 40,
                    END: 35,
                    ENTER: 13,
                    ESCAPE: 27,
                    HOME: 36,
                    LEFT: 37,
                    NUMPAD_ADD: 107,
                    NUMPAD_DECIMAL: 110,
                    NUMPAD_DIVIDE: 111,
                    NUMPAD_ENTER: 108,
                    NUMPAD_MULTIPLY: 106,
                    NUMPAD_SUBTRACT: 109,
                    PAGE_DOWN: 34,
                    PAGE_UP: 33,
                    PERIOD: 190,
                    RIGHT: 39,
                    SPACE: 32,
                    TAB: 9,
                    UP: 38
                },
                buttonCode: {
                    LEFT: 0,
                    MIDDLE: 1,
                    RIGHT: 2
                }
            }), t.extend(t.simulate.prototype, {
                simulateEvent: function(e, t, o) {
                    var n = this.createEvent(t, o);
                    this.dispatchEvent(e, t, n, o)
                },
                createEvent: function(e, t) {
                    return r.test(e) ? this.keyEvent(e, t) : i.test(e) ? this.mouseEvent(e, t) : void 0
                },
                mouseEvent: function(o, n) {
                    var r, i, a, s;
                    return n = t.extend({
                        bubbles: !0,
                        cancelable: "mousemove" !== o,
                        view: window,
                        detail: 0,
                        screenX: 0,
                        screenY: 0,
                        clientX: 1,
                        clientY: 1,
                        ctrlKey: !1,
                        altKey: !1,
                        shiftKey: !1,
                        metaKey: !1,
                        button: 0,
                        relatedTarget: e
                    }, n), document.createEvent ? (r = document.createEvent("MouseEvents"), r.initMouseEvent(o, n.bubbles, n.cancelable, n.view, n.detail, n.screenX, n.screenY, n.clientX, n.clientY, n.ctrlKey, n.altKey, n.shiftKey, n.metaKey, n.button, n.relatedTarget || document.body.parentNode), 0 === r.pageX && 0 === r.pageY && Object.defineProperty && (i = r.relatedTarget.ownerDocument || document, a = i.documentElement, s = i.body, Object.defineProperty(r, "pageX", {
                        get: function() {
                            return n.clientX + (a && a.scrollLeft || s && s.scrollLeft || 0) - (a && a.clientLeft || s && s.clientLeft || 0)
                        }
                    }), Object.defineProperty(r, "pageY", {
                        get: function() {
                            return n.clientY + (a && a.scrollTop || s && s.scrollTop || 0) - (a && a.clientTop || s && s.clientTop || 0)
                        }
                    }))) : document.createEventObject && (r = document.createEventObject(), t.extend(r, n), r.button = {
                            0: 1,
                            1: 4,
                            2: 2
                        }[r.button] || (r.button === -1 ? 0 : r.button)), r
                },
                keyEvent: function(o, n) {
                    var r;
                    if (n = t.extend({
                            bubbles: !0,
                            cancelable: !0,
                            view: window,
                            ctrlKey: !1,
                            altKey: !1,
                            shiftKey: !1,
                            metaKey: !1,
                            keyCode: 0,
                            charCode: e
                        }, n), document.createEvent) try {
                        r = document.createEvent("KeyEvents"), r.initKeyEvent(o, n.bubbles, n.cancelable, n.view, n.ctrlKey, n.altKey, n.shiftKey, n.metaKey, n.keyCode, n.charCode)
                    } catch (i) {
                        r = document.createEvent("Events"), r.initEvent(o, n.bubbles, n.cancelable), t.extend(r, {
                            view: n.view,
                            ctrlKey: n.ctrlKey,
                            altKey: n.altKey,
                            shiftKey: n.shiftKey,
                            metaKey: n.metaKey,
                            keyCode: n.keyCode,
                            charCode: n.charCode
                        })
                    } else document.createEventObject && (r = document.createEventObject(), t.extend(r, n));
                    return (/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) || "[object Opera]" === {}.toString.call(window.opera)) && (r.keyCode = n.charCode > 0 ? n.charCode : n.keyCode, r.charCode = e), r
                },
                dispatchEvent: function(e, t, o) {
                    e[t] ? e[t]() : e.dispatchEvent ? e.dispatchEvent(o) : e.fireEvent && e.fireEvent("on" + t, o)
                },
                simulateFocus: function() {
                    function e() {
                        n = !0
                    }

                    var o, n = !1,
                        r = t(this.target);
                    r.bind("focus", e), r[0].focus(), n || (o = t.Event("focusin"), o.preventDefault(), r.trigger(o), r.triggerHandler("focus")), r.unbind("focus", e)
                },
                simulateBlur: function() {
                    function e() {
                        n = !0
                    }

                    var o, n = !1,
                        r = t(this.target);
                    r.bind("blur", e), r[0].blur(), setTimeout(function() {
                        r[0].ownerDocument.activeElement === r[0] && r[0].ownerDocument.body.focus(), n || (o = t.Event("focusout"), o.preventDefault(), r.trigger(o), r.triggerHandler("blur")), r.unbind("blur", e)
                    }, 1)
                }
            }), t.extend(t.simulate.prototype, {
                simulateDrag: function() {
                    var r = 0,
                        i = this.target,
                        a = i.ownerDocument,
                        s = this.options,
                        c = "corner" === s.handle ? n(i) : o(i),
                        l = Math.floor(c.x),
                        u = Math.floor(c.y),
                        f = {
                            clientX: l,
                            clientY: u
                        },
                        h = s.dx || (s.x !== e ? s.x - l : 0),
                        d = s.dy || (s.y !== e ? s.y - u : 0),
                        p = s.moves || 3;
                    for (this.simulateEvent(i, "mousedown", f); r < p; r++) l += h / p, u += d / p, f = {
                        clientX: Math.round(l),
                        clientY: Math.round(u)
                    }, this.simulateEvent(a, "mousemove", f);
                    t.contains(a, i) ? (this.simulateEvent(i, "mouseup", f), this.simulateEvent(i, "click", f)) : this.simulateEvent(a, "mouseup", f)
                }
            })
        }

        artoo.jquery.plugins.push(t)
    }.call(this),
    function(e) {
        "use strict";

        function t(e) {
            return e[Math.floor(Math.random() * e.length)]
        }

        var o = {
                greet: ["announce", "excited", "hello", "music", "original", "welcome"],
                info: ["determined", "flourish", "playful", "sassy", "talk", "whistling"],
                warn: ["assert", "laugh", "question", "quick", "strange", "threat"],
                error: ["sad", "scream", "shocked", "weep"]
            },
            n = o.greet.concat(o.info).concat(o.warn).concat(o.error);
        artoo.beep = function(e, r) {
            var i, a, s;
            if ("function" == typeof e) a = e;
            else if (i = e, "function" == typeof r) a = r;
            else if ("undefined" != typeof r) throw Error("artoo.beep: second argument has to be a function.");
            if (s = artoo.helpers.isArray(i) ? t(i) : i || t(n), s in o && (s = t(o[s])), !~n.indexOf(s)) throw Error("artoo.beep: wrong sound specified.");
            var c = new Audio(artoo.settings.beep.endpoint + s + ".ogg");
            a && c.addEventListener("ended", function() {
                a()
            }), c.play()
        }, Object.defineProperty(artoo.beep, "available", {
            value: n
        }), Object.defineProperty(artoo.beep, "collections", {
            value: o
        }), n.concat(Object.keys(o)).forEach(function(e) {
            artoo.beep[e] = function() {
                artoo.beep(e)
            }
        })
    }.call(this),
    function(e) {
        "use strict";
        artoo.settings = {
            autoInit: !0,
            autoExec: !0,
            chromeExtension: !1,
            env: "dev",
            eval: null,
            reExec: !0,
            reload: !1,
            scriptUrl: null,
            beep: {
                endpoint: "//medialab.github.io/artoo/sounds/"
            },
            cache: {
                delimiter: "%"
            },
            dependencies: [],
            jquery: {
                version: "2.1.3",
                force: !1
            },
            log: {
                beeping: !1,
                enabled: !0,
                level: "verbose",
                welcome: !0
            },
            store: {
                engine: "local"
            }
        }, artoo.loadSettings = function(e) {
            artoo.settings = artoo.helpers.extend(e, artoo.settings)
        }
    }.call(this),
    function(e) {
        "use strict";

        function t() {}

        function o() {
            var e, t, n = {},
                r = arguments.length;
            for (e = r - 1; e >= 0; e--)
                for (t in arguments[e]) n[t] && a(arguments[e][t]) ? n[t] = o(arguments[e][t], n[t]) : n[t] = arguments[e][t];
            return n
        }

        function n(e) {
            return e instanceof Array
        }

        function r(e) {
            return e instanceof Object
        }

        function i(e) {
            return isNaN(e) && "number" == typeof e
        }

        function a(e) {
            return e instanceof Object && !(e instanceof Array) && !(e instanceof Function)
        }

        function s(e) {
            return a(e) || n(e)
        }

        function c(e) {
            return !isNonScalar(e)
        }

        function l(e, t, o) {
            for (var n = 0, r = e.length; n < r; n++)
                if (t.call(o || null, e[n])) return e[n]
        }

        function u(e, t, o) {
            for (var n = 0, r = e.length; n < r; n++)
                if (t.call(o || null, e[n])) return n;
            return -1
        }

        function f(e) {
            var t = e.split(".");
            return 1 === t.length || "" === t[0] && 2 === t.length ? "" : t.pop()
        }

        function h(e) {
            return artoo.$ && e instanceof artoo.$ || jQuery && e instanceof jQuery || $ && e instanceof $
        }

        function d(e) {
            return e instanceof HTMLDocument || e instanceof XMLDocument
        }

        function p(e) {
            var t = artoo.$;
            return d(e) ? t(e) : t("<div />").append(e)
        }

        function m(e, t) {
            return e ? document.implementation.createDocument(t || null, e, null) : document.implementation.createHTMLDocument()
        }

        function y(e, t, o) {
            "function" == typeof t && (o = t, t = !1);
            var n = document.createElement("script");
            n.type = "text/javascript", n.src = e, t && (n.async = !0), n.onload = n.onreadystatechange = function() {
                this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (n.onload = n.onreadystatechange = null, artoo.mountNode.removeChild(n), "function" == typeof o && o())
            }, artoo.mountNode.appendChild(n)
        }

        function g(e, t, o) {
            var n = document.createElement(t ? "link" : "style"),
                r = document.getElementsByTagName("head")[0];
            n.type = "text/css", t ? (n.href = e, n.rel = "stylesheet", n.onload = n.onreadystatechange = function() {
                this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (n.onload = n.onreadystatechange = null, "function" == typeof o && o())
            }) : n.innerHTML = e, r.appendChild(n)
        }

        function v() {
            var e, t = Object.getPrototypeOf(j),
                o = {};
            for (e in j) ~e.indexOf("webkit") || e in t || j[e] === j || j[e] instanceof BarProp || j[e] instanceof Navigator || ~O.indexOf(e) || (o[e] = j[e]);
            return o
        }

        function b(e, t, o) {
            o = o || {}, "object" == typeof t && (o = t, t = o.done);
            var n = o.interval || 30,
                r = 0,
                i = setInterval(function() {
                    e() && (clearInterval(i), t(null)), o.timeout && o.timeout - r * n <= 0 && (clearInterval(i), t(new Error("timeout"))), r++
                }, n)
        }

        function E() {
            var e = Array.prototype.slice.call(arguments);
            return setTimeout.apply(null, [e[0], 0].concat(e.slice(1)))
        }

        function w(e, o, n) {
            function r() {
                u.forEach(function(e) {
                    clearTimeout(e)
                })
            }

            function i(t, o) {
                return f.push(o), t ? (r(), l(t, f)) : ++h >= e.length ? l(null, f) : (a = e[c++], void u.push(E(a, i)))
            }

            var a, s, c, l = "function" == typeof o ? o : o.done || n,
                u = [],
                f = [],
                h = 0;
            for ("function" != typeof l && (l = t), c = 0, s = o.limit || e.length; c < s; c++) a = e[c], u.push(E(a, i))
        }

        function x(e, t) {
            return function() {
                return t.apply(this, Array.prototype.slice.call(arguments)), e.apply(this, Array.prototype.slice.call(arguments))
            }
        }

        var j = this;
        Object.setPrototypeOf = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e
            };
        var _ = new artoo.emitter;
        Object.setPrototypeOf(artoo, Object.getPrototypeOf(_)), artoo.hooks = {
            trigger: function(e) {
                artoo.emit(e)
            }
        };
        var O = ["__commandLineAPI", "applicationCache", "chrome", "closed", "console", "crypto", "CSS", "defaultstatus", "defaultStatus", "devicePixelRatio", "document", "external", "frameElement", "history", "indexedDB", "innerHeight", "innerWidth", "length", "localStorage", "location", "name", "offscreenBuffering", "opener", "outerHeight", "outerWidth", "pageXOffset", "pageYOffset", "performance", "screen", "screenLeft", "screenTop", "screenX", "screenY", "scrollX", "scrollY", "sessionStorage", "speechSynthesis", "status", "styleMedia"];
        artoo.injectScript = function(e, t) {
            y(e, t)
        }, artoo.injectStyle = function(e, t) {
            g(e, !0, t)
        }, artoo.injectInlineStyle = function(e) {
            g(e, !1)
        }, artoo.waitFor = b, artoo.getGlobalVariables = v, artoo.helpers = {
            before: x,
            createDocument: m,
            extend: o,
            first: l,
            getExtension: f,
            indexOf: u,
            isArray: n,
            isDocument: d,
            isObject: r,
            isPlainObject: a,
            isRealNaN: i,
            isSelector: h,
            isNonPrimitive: s,
            isPrimitive: c,
            jquerify: p,
            noop: t,
            parallel: w
        }
    }.call(this),
    function(e) {
        "use strict";

        function t(e) {
            var t = {};
            return e.split("&").forEach(function(e) {
                var o = e.split("=");
                t[decodeURIComponent(o[0])] = !o[1] || decodeURIComponent(o[1])
            }), t
        }

        function o(e) {
            var o = {
                    href: e
                },
                n = e.split("://");
            n.length > 1 && (o.protocol = n[0]), e = n[n.length > 1 ? 1 : 0];
            var r = e.split("@");
            if (r.length > 1) {
                var i = r[0].split(":");
                i.length > 1 ? o.auth = {
                    user: i[0],
                    password: i[1]
                } : o.auth = {
                    user: i[0]
                }, e = r[1]
            }
            var a = e.match(/([^\/:]+)(.*)/);
            if (o.host = a[1], o.hostname = a[1], a[2]) {
                var s = a[2].trim();
                ":" === s.charAt(0) && (o.port = +s.match(/\d+/)[0], o.host += ":" + o.port), o.path = "/" + s.split("/").slice(1).join("/"), o.pathname = o.path.split("?")[0].split("#")[0]
            }
            if (~o.hostname.search(".")) {
                var c = o.hostname.split(".");
                if (4 === c.length && c.every(function(e) {
                        return !isNaN(+e)
                    })) o.domain = o.hostname;
                else if (c.length > 1) {
                    if (o.tld = c[c.length - 1], o.domain = c[c.length - 2], c.length > 2) {
                        o.subdomains = [];
                        for (var l = 0, u = c.length - 2; l < u; l++) o.subdomains.unshift(c[l])
                    }
                } else o.domain = c[0]
            }
            var f = e.split("#");
            f.length > 1 && (o.hash = "#" + f[1]);
            var h = e.split("?");
            h.length > 1 && (o.search = "?" + h[1], o.query = t(h[1]));
            var d = o.pathname.split("/"),
                p = d[d.length - 1].split(".");
            return p.length > 1 && (o.extension = p[p.length - 1]), o
        }

        function n(e) {
            var t = {};
            return e.split("\n").filter(function(e) {
                return e.trim()
            }).forEach(function(e) {
                if (e) {
                    var o = e.split(": ");
                    t[o[0]] = o[1]
                }
            }), t
        }

        function r(e) {
            var t = {
                httpOnly: !1,
                secure: !1
            };
            if (e.trim()) return e.split("; ").forEach(function(e) {
                if (~e.search(/path=/i)) t.path = e.split("=")[1];
                else if (~e.search(/expires=/i)) t.expires = e.split("=")[1];
                else if (~e.search(/httponly/i) && !~e.search("=")) t.httpOnly = !0;
                else if (~e.search(/secure/i) && !~e.search("=")) t.secure = !0;
                else {
                    var o = e.split("=");
                    t.key = o[0], t.value = decodeURIComponent(o[1])
                }
            }), t
        }

        function i(e) {
            var t = {};
            return e.trim() ? (e.split("; ").forEach(function(e) {
                var o = e.split("=");
                t[o[0]] = decodeURIComponent(o[1])
            }), t) : t
        }

        artoo.parsers = {
            cookie: r,
            cookies: i,
            headers: n,
            queryString: t,
            url: o
        }
    }.call(this),
    function(e) {
        "use strict";

        function t(e, t) {
            return t = t || Object.keys(e), t.map(function(t) {
                return e[t]
            })
        }

        function o(e) {
            var t, o, n, r = [];
            for (n = 0, t = e.length; n < t; n++)
                for (o in e[n]) ~r.indexOf(o) || r.push(o);
            return r
        }

        function n(e) {
            return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
        }

        function r(e, r) {
            if (0 === e.length) return "";
            r = r || {};
            var i, a = r.headers || [],
                s = u(e[0]),
                c = s && (r.order || o(e)),
                l = r.escape || '"',
                f = r.delimiter || ",";
            return a.length || s && r.headers !== !1 && (a = c), i = (a.length ? [a] : []).concat(s ? e.map(function(e) {
                return t(e, c)
            }) : e), i.map(function(e) {
                return e.map(function(e) {
                    var t = ("" + ("undefined" == typeof e ? "" : e)).replace(new RegExp(n(l), "g"), l + l);
                    return ~t.indexOf(f) || ~t.indexOf(l) || ~t.indexOf("\n") ? l + t + l : t
                }).join(f)
            }).join("\n")
        }

        function i(e, t) {
            var o, n, r = e;
            if (t <= 0) return "";
            for (n = 1, o = 0 | t; n < o; n++) r += e;
            return r
        }

        function a(e, t, o) {
            if ("string" == typeof e) return y.string(e);
            if ("number" == typeof e) return y.number(e);
            if ("boolean" == typeof e) return y["boolean"](e);
            if ("undefined" == typeof e || null === e || p(e)) return y.nullValue(e);
            if (u(e)) return y.object(e, t, o);
            if (f(e)) return y.array(e, t);
            if ("function" == typeof e) return y.fn(e);
            throw TypeError("artoo.writers.processYAMLVariable: wrong type.")
        }

        function s(e) {
            return "---\n" + a(e)
        }

        function c(e, t) {
            if (!u(e)) throw Error("artoo.writers.queryString: wrong arguments.");
            var o, n = "";
            for (o in e) n += (n ? "&" : "") + o + "=" + encodeURIComponent("function" == typeof t ? t(e[o]) : e[o]);
            return n
        }

        function l(e, t, o) {
            o = o || {};
            var n = e + "=" + encodeURIComponent(t);
            if (o.days) {
                var r = new Date;
                r.setTime(r.getTime() + 24 * o.days * 60 * 60 * 1e3), n += "; expires=" + r.toGMTString()
            }
            return o.path && (n += "; path=" + o.path), o.domain && (n += "; domain=" + o.domain), o.httpOnly && (n += "; HttpOnly"), o.secure && (n += "; Secure"), n
        }

        var u = artoo.helpers.isPlainObject,
            f = artoo.helpers.isArray,
            h = artoo.helpers.isPrimitive,
            d = artoo.helpers.isNonPrimitive,
            p = artoo.helpers.isRealNaN,
            m = /[:#,\-\[\]\{\}&%]|!{1,2}/,
            y = {
                string: function(e) {
                    return ~e.search(m) ? "'" + e.replace(/'/g, "''") + "'" : e
                },
                number: function(e) {
                    return "" + e
                },
                array: function(e, t) {
                    if (t = t || 0, !e.length) return "[]";
                    var o, n, r = "";
                    for (n = 0, o = e.length; n < o; n++) r += i("  ", t), r += h(e[n]) ? "- " + a(e[n]) + "\n" : u(e[n]) ? "-" + a(e[n], t + 1, !0) : a(e[n], t + 1);
                    return r
                },
                object: function(e, t, o) {
                    if (t = t || 0, !Object.keys(e).length) return (t ? "- " : "") + "{}";
                    var n, r, s = "",
                        c = 0;
                    for (r in e) n = y.string(r), s += i("  ", t), o && !c && (s = s.slice(0, -1)), s += n + ": " + (d(e[r]) ? "\n" : "") + a(e[r], t + 1) + "\n", c++;
                    return s
                },
                fn: function(e) {
                    return y.string(e.toString())
                },
                "boolean": function(e) {
                    return "" + e
                },
                nullValue: function(e) {
                    return "~"
                }
            };
        artoo.writers = {
            cookie: l,
            csv: r,
            queryString: c,
            yaml: s
        }
    }.call(this),
    function(e) {
        "use strict";

        function t() {
            var e = !0;
            for (var t in n.console.__proto__) {
                e = !1;
                break
            }
            return e
        }

        function o() {
            return "undefined" == typeof window && "undefined" != typeof global && "undefined" != typeof module && module.exports
        }

        var n = this,
            r = "navigator" in n;
        artoo.browser = {
            chrome: "chrome" in n,
            firefox: r && !!~navigator.userAgent.search(/firefox/i),
            phantomjs: "callPhantom" in n,
            nodejs: o()
        }, artoo.browser.which = artoo.helpers.first(Object.keys(artoo.browser), function(e) {
                return artoo.browser[e]
            }) || null, artoo.browser.firebug = t()
    }.call(this),
    function(e) {
        "use strict";

        function t(e, t) {
            return Array.prototype.slice.call(e, t || 0)
        }

        function o(e) {
            var t = artoo.settings.log.level;
            return artoo.helpers.isArray(t) ? !!~t.indexOf(e) : c.indexOf(e) >= c.indexOf(t)
        }

        function n() {
            return ['   .-""-.   ', "  /[] _ _\\  ", " _|_o_LII|_ ", "/ | ==== | \\", "|_| ==== |_|", " ||LI  o ||", " ||'----'||", "/__|    |__\\"]
        }

        function r(e) {
            // Modified
            var t = ["[crumbls]: " + (a ? "%c" + e : "")];
            return a && t.push("color: " + s[e] + ";"), t.push("-" + (a ? "" : " ")), t
        }

        function i(e) {
            artoo.log[e] = function() {
                artoo.log.apply(artoo.log, [e].concat(t(arguments)))
            }
        }

        var a = artoo.browser.chrome || artoo.browser.firebug,
            s = {
                verbose: "#33CCFF",
                debug: "#000099",
                info: "#009900",
                warning: "orange",
                error: "red"
            },
            c = ["verbose", "debug", "info", "warning", "error"];
        artoo.log = function(n) {
            if (artoo.settings.log.enabled) {
                var i = s[n] !== e,
                    c = i ? 1 : 0,
                    l = t(arguments, c);
                if (n = i ? n : "debug", o(n)) {
                    var u = r(n).concat(l);
                    console.log.apply(console, a ? u : [u.reduce(function(e, t) {
                        return e + t
                    }, "")])
                }
            }
        };
        for (var l in s) i(l);
        artoo.log.plain = function() {
            artoo.settings.log.enabled && console.log.apply(console, arguments)
        }, artoo.log.welcome = function() {
            // disable the welcome message here.
            if (artoo.settings.log.enabled && false) {
                var e = n();
                e[e.length - 2] = e[e.length - 2] + "    artoo.js", console.log(e.join("\n") + "   v" + artoo.version)
            }
        }
    }.call(this),
    function(e) {
        "use strict";
        var t = this,
            o = {};
        artoo.deps = {}, artoo.deps._inject = function(e) {
            var n = artoo.settings.dependencies;
            if (!n.length) return e();
            artoo.log.verbose("Starting to retrieve dependencies...", n.map(function(e) {
                return e.name
            }));
            var r = n.map(function(e) {
                if (!e.name || !e.globals || !e.url) throw Error("artoo.deps: invalid dependency definition.");
                var n = "string" == typeof e.globals ? [e.globals] : e.globals;
                return n.forEach(function(n) {
                    !t[n] || e.noConflict || e.force || (o[n] = t[n])
                }),
                    function(r) {
                        artoo.injectScript(e.url, function() {
                            artoo.log.verbose("Retrieved dependency " + e.name + ".");
                            var i = {};
                            n.forEach(function(n) {
                                i[n] = t[n], o[n] && (t[n] = o[n], delete o[n]), e.noConflict && t[n].noConflict()
                            }), artoo.deps[e.name] = Object.keys(i).length > 1 ? i : i[Object.keys(i)[0]], r()
                        })
                    }
            });
            artoo.helpers.parallel(r, function() {
                artoo.log.verbose("Finished retrieving dependencies."), e()
            })
        }, artoo.jquery.inject = function(e) {
            var o = artoo.settings.jquery.version,
                n = "//code.jquery.com/jquery-" + o + ".min.js",
                r = "undefined" != typeof jQuery && jQuery.fn || artoo.$.fn,
                i = !r && "undefined" != typeof $,
                a = r && jQuery.fn.jquery ? jQuery.fn.jquery : "0";
            r && a.charAt(0) === o.charAt(0) && a.charAt(2) === o.charAt(2) ? (artoo.log.verbose("jQuery already exists in this page (v" + a + "). No need to load it again."), artoo.$ = jQuery, e()) : artoo.settings.jquery.force ? artoo.injectScript(n, function() {
                artoo.log.warning("According to your settings, jQuery (v" + o + ") was injected into your page to replace the current $ variable."), artoo.$ = jQuery, e()
            }) : r && "2" !== a.charAt(0) || i ? artoo.injectScript(n, function() {
                artoo.$ = jQuery.noConflict(!0), "undefined" == typeof t.$ ? (t.$ = artoo.$, artoo.log.warning("jQuery is available but does not have a correct version. The correct version was therefore injected and $ was set since it was not used.")) : artoo.log.warning("Either jQuery has not a valid version or another library using $ is already present. Correct version available through `artoo.$`."), e()
            }) : artoo.injectScript(n, function() {
                artoo.log.info("jQuery was correctly injected into your page (v" + o + ")."), artoo.$ = jQuery, e()
            })
        }
    }.call(this),
    function(e) {
        "use strict";

        function t() {
            artoo.browser.firebug || ~console.log.toString().search(/\[native code\]/i) || (["log", "info", "debug", "warn"].forEach(function(e) {
                console[e] = console.__proto__[e]
            }), artoo.log.warning("The console have been shunted by the website you are visiting. artoo has repaired it."))
        }

        artoo.once("countermeasures", function() {
            t()
        })
    }.call(this),
    function(e) {
        "use strict";

        function t() {
            function e() {
                r.hooked || (XMLHttpRequest.prototype.open = o(XMLHttpRequest.prototype.open, function(e, t, o) {
                    var n = this;
                    n._spy = {
                        method: e,
                        url: t,
                        params: artoo.parsers.url(t).query
                    }
                }), XMLHttpRequest.prototype.send = o(XMLHttpRequest.prototype.send, function(e) {
                    var t = this;
                    e && (t._spy.querystring = e, t._spy.data = artoo.parsers.queryString(e)), r.listeners.forEach(function(e) {
                        "*" === e.criteria && e.fn.call(t, t._spy)
                    })
                }), r.hooked = !0)
            }

            function t() {
                r.hooked && (XMLHttpRequest.prototype.send = n.send, XMLHttpRequest.prototype.open = n.open, r.hooked = !1)
            }

            var r = this;
            this.hooked = !1, this.listeners = [], this.before = function(t, o) {
                "function" == typeof t && (o = t, t = null), t = t || {}, e(), this.listeners.push({
                    criteria: "*",
                    fn: o
                })
            }, this.after = function(t, o) {
                "function" == typeof t && (o = t, t = null), t = t || {}, e(), this.listeners.push({
                    criteria: "*",
                    fn: function() {
                        var e = this,
                            t = e.onreadystatechange;
                        e.onreadystatechange = function() {
                            if (e.readyState === XMLHttpRequest.prototype.DONE) {
                                var n = e.getResponseHeader("Content-Type"),
                                    r = e.response;
                                if (n && ~n.search(/json/)) try {
                                    r = JSON.parse(e.responseText)
                                } catch (i) {} else if (n && ~n.search(/xml/)) r = e.responseXML;
                                else try {
                                        r = JSON.parse(e.responseText)
                                    } catch (i) {
                                        r = e.responseText
                                    }
                                o.call(e, e._spy, {
                                    data: r,
                                    headers: artoo.parsers.headers(e.getAllResponseHeaders())
                                })
                            }
                            "function" == typeof t && t.apply(e, arguments)
                        }
                    }
                })
            }, this.off = function(e) {
                var o = artoo.helpers.indexOf(this.listeners, function(t) {
                    return t.fn === e
                });
                if (!~o) throw Error("artoo.ajaxSniffer.off: trying to remove an inexistant listener.");
                this.listeners.splice(o, 1), this.listeners.length || t()
            }
        }

        var o = artoo.helpers.before,
            n = {
                open: XMLHttpRequest.prototype.open,
                send: XMLHttpRequest.prototype.send,
                setRequestHeader: XMLHttpRequest.prototype.setRequestHeader
            };
        artoo.ajaxSniffer = new t
    }.call(this),
    function(e) {
        "use strict";

        function t(e, o, n, r, i) {
            function a(e) {
                c.settings || o.settings ? artoo.$.ajax(c.url || o.url || c, artoo.helpers.extend(c.settings || o.settings, {
                    success: e,
                    data: c.data || o.data || {},
                    type: c.method || o.method || "get"
                })) : artoo.$[c.method || o.method || "get"](c.url || o.url || c, c.data || o.data || {}, e)
            }

            function s(i) {
                var a = i;
                return (o.scrape || o.scrapeOne || o.jquerify) && (i = artoo.helpers.jquerify(i)), o.scrape || o.scrapeOne ? a = artoo[o.scrape ? "scrape" : "scrapeOne"](i.find(o.scrape.iterator), o.scrape.data, o.scrape.params) : "function" == typeof o.process && (a = o.process(i, n, r)), a === !1 ? o.done(r) : (o.concat ? r = r.concat(a) : r.push(a), n++, void(artoo.helpers.isArray(e) && n === e.length || n === o.limit ? o.done(r) : t(e, o, n, r, i)))
            }

            r = r || [], n = n || 0;
            var c = "function" == typeof e ? e(n, i) : e[n];
            return c ? void(o.throttle > 0 ? setTimeout(a, n ? o.throttle : 0, s) : "function" == typeof o.throttle ? setTimeout(a, n ? o.throttle(n) : 0, s) : a(s)) : o.done(r)
        }

        artoo.ajaxSpider = function(e, o, n) {
            var r, i;
            o = o || {}, "function" == typeof o && (r = o, o = {}, o.done = r), "function" == typeof n && (i = artoo.helpers.extend({
                done: n
            }, o)), t(e, artoo.helpers.extend(i || o, {
                done: artoo.helpers.noop
            }))
        }
    }.call(this),
    function(e) {
        "use strict";

        function t(e, o, n) {
            o = o || 0;
            var r = !e.canExpand || ("string" == typeof e.canExpand ? artoo.$(e.canExpand).length > 0 : e.canExpand(artoo.$));
            if (!r || o >= e.limit) return void("function" == typeof e.done && e.done());
            var i = "string" == typeof e.expand ? function() {
                artoo.$(e.expand).simulate("click")
            } : e.expand;
            if (e.throttle ? setTimeout(i, "function" == typeof e.throttle ? e.throttle(o) : e.throttle, artoo.$) : i(artoo.$), e.isExpanding)
                if ("number" == typeof e.isExpanding) setTimeout(t, e.isExpanding, e, ++o);
                else {
                    var a = "string" == typeof e.isExpanding ? function() {
                        return artoo.$(e.isExpanding).length > 0
                    } : e.isExpanding;
                    artoo.waitFor(function() {
                        return !a(artoo.$)
                    }, function() {
                        t(e, ++o)
                    }, {
                        timeout: e.timeout
                    })
                }
            else e.elements ? (n = n || artoo.$(e.elements).length, artoo.waitFor(function() {
                return artoo.$(e.elements).length > n
            }, function() {
                t(e, ++o, artoo.$(e.elements).length)
            }, {
                timeout: e.timeout
            })) : t(e, ++o)
        }

        artoo.autoExpand = function(e, o) {
            if (e = e || {}, e.done = o || e.done, !e.expand) throw Error("artoo.autoExpand: you must provide an expand parameter.");
            t(e)
        }
    }.call(this),
    function(e) {
        "use strict";
        artoo.autoScroll = function(e, t) {
            artoo.autoExpand(this.helpers.extend(e, {
                expand: function() {
                    window.scrollTo(0, document.body.scrollHeight)
                }
            }), t)
        }
    }.call(this),
    function(e) {
        "use strict";
        artoo.cookies = function(e) {
            return artoo.cookies.get(e)
        }, artoo.cookies.get = function(e) {
            var t = artoo.parsers.cookies(document.cookie);
            return e ? t[e] : t
        }, artoo.cookies.getAll = function() {
            return artoo.cookies.get()
        }, artoo.cookies.set = function(e, t, o) {
            document.cookie = artoo.writers.cookie(e, t, o)
        }, artoo.cookies.remove = function(e, t) {
            var o = artoo.helpers.extend(t);
            delete o.days;
            var n = artoo.writers.cookie(e, "*", o);
            n += " ;expires=Thu, 01 Jan 1970 00:00:01 GMT", document.cookie = n
        }, artoo.cookies.removeAll = function() {
            var e, t = artoo.cookies.getAll();
            for (e in t) artoo.cookies.remove(e)
        }, artoo.cookies.clear = artoo.cookies.removeAll
    }.call(this),
    function(e) {
        "use strict";

        function t(e) {
            return e[0].documentElement && e[0].documentElement.outerHTML || e[0].outerHTML
        }

        function o(e) {
            return "string" == typeof e ? {
                filename: e
            } : e || {}
        }

        function n() {
            this.defaultFilename = "artoo_data", this.defaultEncoding = "utf-8", this.xmlns = "http://www.w3.org/1999/xhtml", this.mimeShortcuts = {
                csv: "text/csv",
                tsv: "text/tab-separated-values",
                json: "application/json",
                txt: "text/plain",
                html: "text/html",
                yaml: "text/yaml"
            }, this.createBlob = function(e, t, o) {
                return t = this.mimeShortcuts[t] || t || this.defaultMime, new Blob([e], {
                    type: t + ";charset=" + o || this.defaultEncoding
                })
            }, this.createBlobFromDataURL = function(e) {
                var t, o, n = atob(e.split(",")[1]),
                    r = new Uint8Array(n.length);
                for (t = 0, o = n.length; t < o; t++) r[t] = n.charCodeAt(t);
                return new Blob([r.buffer], {
                    type: e.split(",")[0].split(":")[1].split(";")[0]
                })
            }, this.blobURL = function(e) {
                var t = a.createObjectURL(e);
                return t
            }, this.saveResource = function(e, t) {
                var o = document.createElementNS(this.xmlns, "a");
                o.href = e, o.setAttribute("download", t.filename || ""), "document" in r && document.body.appendChild(o), o.click(), "document" in r && document.body.removeChild(o), o = null, t.revoke && setTimeout(function() {
                    a.revokeObjectURL(e)
                })
            }, this.saveData = function(e, t) {
                t = t || {};
                var o = this.createBlob(e, t.mime, t.encoding);
                this.saveResource(this.blobURL(o), {
                    filename: t.filename || this.defaultFilename,
                    revoke: t.revoke || !0
                })
            }, this.saveDataURL = function(e, t) {
                t = t || {};
                var o = this.createBlobFromDataURL(e);
                this.saveResource(o, {
                    filename: t.filename || this.defaultFilename
                })
            }
        }

        var r = this,
            i = artoo.helpers,
            a = r.URL || r.webkitURL || r,
            s = new n;
        artoo.save = function(e, t) {
            s.saveData(e, o(t))
        }, artoo.saveJson = function(t, n) {
            n = o(n), "string" != typeof t ? t = n.pretty || n.indent ? JSON.stringify(t, e, n.indent || 2) : JSON.stringify(t) : (n.pretty || n.indent) && (t = JSON.stringify(JSON.parse(t), e, n.indent || 2)), artoo.save(t, i.extend(n, {
                filename: "data.json",
                mime: "json"
            }))
        }, artoo.savePrettyJson = function(e, t) {
            t = o(t), artoo.saveJson(e, i.extend(t, {
                pretty: !0
            }))
        }, artoo.saveYaml = function(e, t) {
            t = o(t), artoo.save(artoo.writers.yaml(e), i.extend(t, {
                filename: "data.yml",
                mime: "yaml"
            }))
        }, artoo.saveCsv = function(e, t) {
            t = o(t), e = "string" != typeof e ? artoo.writers.csv(e, t) : e, artoo.save(e, i.extend(t, {
                mime: "csv",
                filename: "data.csv"
            }))
        }, artoo.saveTsv = function(e, t) {
            artoo.saveCsv(e, i.extend(o(t), {
                mime: "tsv",
                delimiter: "\t",
                filename: "data.tsv"
            }))
        }, artoo.saveXml = function(e, n) {
            n = o(n);
            var r = i.isSelector(e) && t(e) || i.isDocument(e) && e.documentElement.outerHTML || e,
                a = n.type || "xml",
                s = "";
            if ("html" === a && i.isDocument(e)) {
                var c = e.doctype;
                c && (s = "<!DOCTYPE " + (c.name || "html") + (c.publicId ? ' PUBLIC "' + c.publicId + '"' : "") + (c.systemId ? ' "' + c.systemId + '"' : "") + ">\n")
            } else "xml" !== a && "svg" !== a || ~r.search(/<\?xml/) || (s = '<?xml version="1.0" encoding="' + (n.encoding || "utf-8") + '" standalone="yes"?>\n');
            "svg" === a && (s += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'), artoo.save(s + r, i.extend(n, {
                mime: "html",
                filename: "document.xml"
            }))
        }, artoo.saveHtml = function(e, t) {
            artoo.saveXml(e, i.extend(o(t), {
                filename: "document.html",
                type: "html"
            }))
        }, artoo.savePageHtml = function(e) {
            artoo.saveHtml(document, i.extend(o(e), {
                filename: "page.html"
            }))
        }, artoo.saveSvg = function(e, t) {
            t = o(t);
            var n = artoo.$(e);
            if (!n.is("svg")) throw Error("artoo.saveSvg: selector is not svg.");
            artoo.saveXml(n, i.extend(t, {
                filename: "drawing.svg",
                type: "svg"
            }))
        }, artoo.saveStore = function(e) {
            e = o(e), artoo.savePrettyJson(artoo.store.get(e.key), i.extend(e, {
                filename: "store.json"
            }))
        }, artoo.saveResource = function(e, t) {
            s.saveResource(e, o(t))
        }, artoo.saveImage = function(e, t) {
            t = o(t);
            var n = artoo.$(e);
            if (!n.is("img") && !n.attr("src")) throw Error("artoo.saveImage: selector is not an image.");
            var r = i.getExtension(n.attr("src")),
                a = n.attr("alt");
            artoo.saveResource(n.attr("src"), i.extend(t, {
                filename: !!a && a + (r ? "." + r : "")
            }))
        }
    }.call(this),
    function(e) {
        "use strict";

        function t(t, o) {
            var n, r = artoo.$,
                i = t.sel ? r(o).find(t.sel) : r(o);
            return n = "function" == typeof t ? t.call(o, r) : "function" == typeof t.method ? t.method.call(i.get(), r) : "string" == typeof t ? "function" == typeof i[t] ? i[t]() : i.attr(t) : t.attr !== e ? i.attr(t.attr) : i[t.method || "text"](), t.defaultValue && !n && (n = t.defaultValue), n
        }

        function o(e, n, r, i) {
            var a = artoo.$,
                s = [],
                c = !!n.attr || !!n.method || n.scrape || "string" == typeof n || "function" == typeof n;
            r = r || {};
            var l;
            return l = a("function" == typeof e ? e(a) : e), l.each(function(e) {
                var i, l = {};
                if (c) l = "object" == typeof n && "scrape" in n ? o((n.sel ? a(this).find(n.sel) : a(this)).find(n.scrape.iterator), n.scrape.data, n.scrape.params) : t(n, this);
                else
                    for (i in n) l[i] = "object" == typeof n[i] && "scrape" in n[i] ? o((n[i].sel ? a(this).find(n[i].sel) : a(this)).find(n[i].scrape.iterator), n[i].scrape.data, n[i].scrape.params) : t(n[i], this);
                return s.push(l), !r.limit || e < r.limit - 1
            }), s = r.one ? s[0] : s, "function" == typeof i && i(s), s
        }

        function n(e, t, o, n) {
            var r, i, a, s, c = artoo.helpers;
            return c.isPlainObject(e) && !c.isSelector(e) && !c.isDocument(e) && (e.iterator || e.data || e.params) ? (i = e.data, a = c.isPlainObject(e.params) ? e.params : {}, r = e.iterator) : (i = t, a = c.isPlainObject(o) ? o : {}, r = e), i = i || "text", s = "function" == typeof n ? n : "function" == typeof o ? o : a.done, [r, i, a, s]
        }

        function r(e) {
            var t = ["scrape", "scrapeOne", "scrapeTable"];
            t.forEach(function(t) {
                e.fn[t] = function() {
                    return artoo[t].apply(artoo, [e(this)].concat(Array.prototype.slice.call(arguments)))
                }
            })
        }

        artoo.helpers.extend;
        artoo.scrape = function(e, t, r, i) {
            var a = n(e, t, r, i);
            if (!a[0] || !a[1]) throw TypeError("artoo.scrape: wrong arguments.");
            return o.apply(this, a)
        }, artoo.scrapeOne = function(e, t, r, i) {
            var a = n(e, t, r, i);
            return a[2] = artoo.helpers.extend(a[2], {
                limit: 1,
                one: !0
            }), o.apply(this, a)
        }, artoo.scrapeTable = function(e, o, n) {
            var r = artoo.$;
            o = o || {};
            var i, a = "string" != typeof e ? e.selector : e;
            if (o.headers) {
                var s = o.headers.type || o.headers.method && "first" || o.headers,
                    c = o.headers.method;
                if ("th" === s) i = artoo.scrape(a + " th", c || "text");
                else if ("first" === s) i = artoo.scrape(a + " tr:has(td):first td", c || "text");
                else {
                    if (!artoo.helpers.isArray(s)) throw TypeError("artoo.scrapeTable: wrong headers type.");
                    i = s
                }
                return artoo.scrape(a + " tr:has(td)" + ("first" === s ? ":not(:first)" : ""), function() {
                    var e = {};
                    return i.forEach(function(n, i) {
                        e[n] = t(o.data || "text", r(this).find("td:eq(" + i + ")"))
                    }, this), e
                }, o, n)
            }
            return artoo.scrape(a + " tr:has(td)", {
                scrape: {
                    iterator: "td",
                    data: o.data || "text"
                }
            }, o, n)
        }, artoo.jquery.plugins.push(r)
    }.call(this),
    function(e) {
        "use strict";

        function t(e) {
            var t = artoo.settings.cache.delimiter;
            return e.charAt(0) === t && e.charAt(e.length - 1) === t
        }

        function o(e) {
            if ("local" === e) e = localStorage;
            else {
                if ("session" !== e) throw Error('artoo.store: wrong engine "' + e + '".');
                e = sessionStorage
            }
            var o = function(e) {
                return o.get(e)
            };
            return o.get = function(t) {
                if (!t) return o.getAll();
                var n = e.getItem(t);
                try {
                    return JSON.parse(n)
                } catch (r) {
                    return n
                }
            }, o.getAll = function() {
                var n = {};
                for (var r in e) t(r) || (n[r] = o.get(r));
                return n
            }, o.keys = function(t) {
                var o, n = [];
                for (o in e) n.push(o);
                return n
            }, o.set = function(t, o) {
                if ("string" != typeof t && "number" != typeof t) throw TypeError("artoo.store.set: trying to set an invalid key.");
                e.setItem(t, JSON.stringify(o))
            }, o.pushTo = function(e, t) {
                var n = o.get(e);
                if (!artoo.helpers.isArray(n) && null !== n) throw TypeError("artoo.store.pushTo: trying to push to a non-array.");
                return n = n || [], n.push(t), o.set(e, n), n
            }, o.update = function(e, t) {
                var n = o.get(e);
                if (!artoo.helpers.isPlainObject(n) && null !== n) throw TypeError("artoo.store.update: trying to udpate to a non-object.");
                return n = artoo.helpers.extend(t, n), o.set(e, n), n
            }, o.remove = function(t) {
                if ("string" != typeof t && "number" != typeof t) throw TypeError("artoo.store.set: trying to remove an invalid key.");
                e.removeItem(t)
            }, o.removeAll = function() {
                for (var o in e) t(o) || e.removeItem(o)
            }, o.clear = o.removeAll, o
        }

        artoo.createStore = o, artoo.store = o(artoo.settings.store.engine), artoo.s = artoo.store
    }.call(this),
    function(e) {
        "use strict";
        var t = 0,
            o = {};
        artoo.ui = function(e) {
            function n() {
                var t = e.stylesheets || e.stylesheet;
                t && (artoo.helpers.isArray(t) ? t : [t]).forEach(function(e) {
                    this.injectStyle(e)
                }, this)
            }

            e = e || {};
            var r = e.id || "artoo-ui" + t++;
            this.name = e.name || r, o[this.name] = this, this.mountNode = e.mountNode || artoo.mountNode, this.host = document.createElement("div"), this.host.setAttribute("id", r), this.mountNode.appendChild(this.host), this.shadow = this.host.createShadowRoot(), this.$ = function(e) {
                return e ? artoo.$(this.shadow).children(e).add(artoo.$(this.shadow).children().find(e)) : artoo.$(this.shadow)
            }, this.injectStyle = function(e) {
                if (!(e in artoo.stylesheets)) throw Error("artoo.ui.injectStyle: attempting to inject unknown stylesheet (" + e + ")");
                this.injectInlineStyle(artoo.stylesheets[e])
            }, this.injectInlineStyle = function(e) {
                var t = document.createElement("style");
                return t.innerHTML = artoo.helpers.isArray(e) ? e.join("\n") : e, this.shadow.appendChild(t), this
            }, this.kill = function() {
                this.mountNode.removeChild(this.host), delete this.shadow, delete this.host, delete o[this.name]
            }, n.call(this)
        }, artoo.ui.instances = function(e) {
            return e ? o[e] : o
        }
    }.call(this),
    function(e) {
        "use strict";

        function t() {
            return artoo.settings.reExec || r ? (artoo.settings.eval ? (artoo.log.verbose("evaluating and executing the script given to artoo."), eval.call(n, JSON.parse(artoo.settings.eval))) : artoo.settings.scriptUrl && (artoo.log.verbose('executing script at "' + artoo.settings.scriptUrl + '"'), artoo.injectScript(artoo.settings.scriptUrl)), void(r = !1)) : void artoo.log.warning("not reexecuting script as per settings.")
        }

        function o() {
            function e(e) {
                artoo.jquery.inject(function() {
                    artoo.jquery.applyPlugins(), e()
                })
            }

            artoo.emit("countermeasures"), artoo.settings.log.welcome && artoo.log.welcome();
            var t = artoo.settings.log.beeping;
            return t && artoo.beep.greet(), artoo.browser.chromeExtension && artoo.log.verbose("artoo has automatically been injected by the chrome extension."), artoo.browser.phantomjs ? (artoo.$ = window.artooPhantomJQuery, delete window.artooPhantomJQuery, artoo.jquery.applyPlugins(), artoo.emit("ready")) : (artoo.helpers.parallel([e, artoo.deps._inject], function() {
                artoo.log.info("artoo is now good to go!"), artoo.settings.autoExec && artoo.exec(), artoo.emit("ready")
            }), void(artoo.loaded = !0))
        }

        var n = this,
            r = !0,
            i = document.getElementById("artoo_injected_script");
        i && (artoo.loadSettings(JSON.parse(i.getAttribute("settings"))), i.parentNode.removeChild(i)), artoo.browser.chromeExtension = !!artoo.settings.chromeExtension, artoo.once("init", o), artoo.on("exec", t), artoo.init = function() {
            artoo.emit("init")
        }, artoo.exec = function() {
            artoo.emit("exec")
        }, artoo.settings.autoInit && artoo.init()
    }.call(this);