(function(b, a) {
    b.version = "0.9.6";
    b.protocol = 1;
    b.transports = [];
    b.j = [];
    b.sockets = {};
    b.connect = function(c, f) {
        var e = b.util.parseUri(c),
            i, h;
        a && a.location && (e.protocol = e.protocol || a.location.protocol.slice(0, -1), e.host = e.host || (a.document ? a.document.domain : a.location.hostname), e.port = e.port || a.location.port);
        i = b.util.uniqueUri(e);
        var j = {
            host: e.host,
            secure: "https" == e.protocol,
            port: e.port || ("https" == e.protocol ? 443 : 80),
            query: e.query || ""
        };
        b.util.merge(j, f);
        if (j["force new connection"] || !b.sockets[i]) h = new b.Socket(j);
        !j["force new connection"] && h && (b.sockets[i] = h);
        h = h || b.sockets[i];
        return h.of(1 < e.path.length ? e.path : "")
    }
})("object" === typeof module ? module.exports : this.io = {}, this);
(function(b, a) {
    var c = b.util = {},
        f = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        e = "source,protocol,authority,userInfo,user,password,host,port,relative,path,directory,file,query,anchor".split(",");
    c.parseUri = function(a) {
        for (var a = f.exec(a || ""), b = {}, d = 14; d--;) b[e[d]] = a[d] || "";
        return b
    };
    c.uniqueUri = function(b) {
        var f = b.protocol,
            d = b.host,
            b = b.port;
        "document" in
        a ? (d = d || document.domain, b = b || ("https" == f && "https:" !== document.location.protocol ? 443 : document.location.port)) : (d = d || "localhost", !b && "https" == f && (b = 443));
        return (f || "http") + "://" + d + ":" + (b || 80)
    };
    c.query = function(a, b) {
        var d = c.chunkQuery(a || ""),
            k = [];
        c.merge(d, c.chunkQuery(b || ""));
        for (var f in d) d.hasOwnProperty(f) && k.push(f + "=" + d[f]);
        return k.length ? "?" + k.join("&") : ""
    };
    c.chunkQuery = function(a) {
        for (var b = {}, a = a.split("&"), d = 0, k = a.length, f; d < k; ++d) f = a[d].split("="), f[0] && (b[f[0]] = f[1]);
        return b
    };
    var i = !1;
    c.load = function(b) {
        if ("document" in a && "complete" === document.readyState || i) return b();
        c.on(a, "load", b, !1)
    };
    c.on = function(a, b, d, f) {
        a.attachEvent ? a.attachEvent("on" + b, d) : a.addEventListener && a.addEventListener(b, d, f)
    };
    c.request = function(a) {
        if (a && "undefined" != typeof XDomainRequest) return new XDomainRequest;
        if ("undefined" != typeof XMLHttpRequest && (!a || c.ua.hasCORS)) return new XMLHttpRequest;
        if (!a) try {
            return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
        } catch (b) {}
        return null
    };
    "undefined" !=
    typeof window && c.load(function() {
        i = !0
    });
    c.defer = function(a) {
        if (!c.ua.webkit || "undefined" != typeof importScripts) return a();
        c.load(function() {
            setTimeout(a, 100)
        })
    };
    c.merge = function(a, b, d, f) {
        var f = f || [],
            d = "undefined" == typeof d ? 2 : d,
            e;
        for (e in b) b.hasOwnProperty(e) && 0 > c.indexOf(f, e) && ("object" !== typeof a[e] || !d ? (a[e] = b[e], f.push(b[e])) : c.merge(a[e], b[e], d - 1, f));
        return a
    };
    c.mixin = function(a, b) {
        c.merge(a.prototype, b.prototype)
    };
    c.inherit = function(a, b) {
        function d() {}
        d.prototype = b.prototype;
        a.prototype = new d
    };
    c.isArray = Array.isArray || function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    };
    c.intersect = function(a, b) {
        for (var d = [], f = a.length > b.length ? a : b, e = a.length > b.length ? b : a, i = 0, n = e.length; i < n; i++) ~c.indexOf(f, e[i]) && d.push(e[i]);
        return d
    };
    c.indexOf = function(a, b, d) {
        for (var f = a.length, d = 0 > d ? 0 > d + f ? 0 : d + f : d || 0; d < f && a[d] !== b; d++);
        return f <= d ? -1 : d
    };
    c.toArray = function(a) {
        for (var b = [], d = 0, f = a.length; d < f; d++) b.push(a[d]);
        return b
    };
    c.ua = {};
    c.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
        try {
            var a =
                new XMLHttpRequest
        } catch (b) {
            return !1
        }
        return void 0 != a.withCredentials
    }();
    c.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent)
})("undefined" != typeof io ? io : module.exports, this);
(function(b, a) {
    function c() {}
    b.EventEmitter = c;
    c.prototype.on = function(b, e) {
        this.$events || (this.$events = {});
        this.$events[b] ? a.util.isArray(this.$events[b]) ? this.$events[b].push(e) : this.$events[b] = [this.$events[b], e] : this.$events[b] = e;
        return this
    };
    c.prototype.addListener = c.prototype.on;
    c.prototype.once = function(a, b) {
        function c() {
            h.removeListener(a, c);
            b.apply(this, arguments)
        }
        var h = this;
        c.listener = b;
        this.on(a, c);
        return this
    };
    c.prototype.removeListener = function(b, e) {
        if (this.$events && this.$events[b]) {
            var c =
                this.$events[b];
            if (a.util.isArray(c)) {
                for (var h = -1, j = 0, d = c.length; j < d; j++)
                    if (c[j] === e || c[j].listener && c[j].listener === e) {
                        h = j;
                        break
                    }
                if (0 > h) return this;
                c.splice(h, 1);
                c.length || delete this.$events[b]
            } else(c === e || c.listener && c.listener === e) && delete this.$events[b]
        }
        return this
    };
    c.prototype.removeAllListeners = function(a) {
        this.$events && this.$events[a] && (this.$events[a] = null);
        return this
    };
    c.prototype.listeners = function(b) {
        this.$events || (this.$events = {});
        this.$events[b] || (this.$events[b] = []);
        a.util.isArray(this.$events[b]) ||
            (this.$events[b] = [this.$events[b]]);
        return this.$events[b]
    };
    c.prototype.emit = function(b) {
        if (!this.$events) return !1;
        var e = this.$events[b];
        if (!e) return !1;
        var c = Array.prototype.slice.call(arguments, 1);
        if ("function" == typeof e) e.apply(this, c);
        else if (a.util.isArray(e))
            for (var e = e.slice(), h = 0, j = e.length; h < j; h++) e[h].apply(this, c);
        else return !1;
        return !0
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a) {
    function c(a) {
        return 10 > a ? "0" + a : a
    }

    function f(a) {
        j.lastIndex = 0;
        return j.test(a) ? '"' + a.replace(j, function(a) {
            var d = g[a];
            return "string" === typeof d ? d : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }

    function e(a, b) {
        var g, i, h, j, r = d,
            q, p = b[a];
        p instanceof Date && (p = isFinite(a.valueOf()) ? a.getUTCFullYear() + "-" + c(a.getUTCMonth() + 1) + "-" + c(a.getUTCDate()) + "T" + c(a.getUTCHours()) + ":" + c(a.getUTCMinutes()) + ":" + c(a.getUTCSeconds()) + "Z" : null);
        "function" === typeof m && (p = m.call(b, a,
            p));
        switch (typeof p) {
            case "string":
                return f(p);
            case "number":
                return isFinite(p) ? "" + p : "null";
            case "boolean":
            case "null":
                return "" + p;
            case "object":
                if (!p) return "null";
                d += k;
                q = [];
                if ("[object Array]" === Object.prototype.toString.apply(p)) {
                    j = p.length;
                    for (g = 0; g < j; g += 1) q[g] = e(g, p) || "null";
                    h = 0 === q.length ? "[]" : d ? "[\n" + d + q.join(",\n" + d) + "\n" + r + "]" : "[" + q.join(",") + "]";
                    d = r;
                    return h
                }
                if (m && "object" === typeof m) {
                    j = m.length;
                    for (g = 0; g < j; g += 1) "string" === typeof m[g] && (i = m[g], (h = e(i, p)) && q.push(f(i) + (d ? ": " : ":") + h))
                } else
                    for (i in p) Object.prototype.hasOwnProperty.call(p,
                        i) && (h = e(i, p)) && q.push(f(i) + (d ? ": " : ":") + h);
                h = 0 === q.length ? "{}" : d ? "{\n" + d + q.join(",\n" + d) + "\n" + r + "}" : "{" + q.join(",") + "}";
                d = r;
                return h
        }
    }
    if (a && a.parse) return b.JSON = {
        parse: a.parse,
        stringify: a.stringify
    };
    var i = b.JSON = {},
        h = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        j = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        d, k, g = {
            "\u0008": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\u000c": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        m;
    i.stringify = function(a, b, f) {
        var c;
        k = d = "";
        if ("number" === typeof f)
            for (c = 0; c < f; c += 1) k += " ";
        else "string" === typeof f && (k = f);
        if ((m = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) throw Error("JSON.stringify");
        return e("", {
            "": a
        })
    };
    i.parse = function(a, d) {
        function b(a, e) {
            var f, k, c = a[e];
            if (c && "object" === typeof c)
                for (f in c) Object.prototype.hasOwnProperty.call(c, f) && (k = b(c, f), void 0 !== k ? c[f] = k : delete c[f]);
            return d.call(a, e, c)
        }
        var e, a = "" + a;
        h.lastIndex =
            0;
        h.test(a) && (a = a.replace(h, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return e = eval("(" + a + ")"), "function" === typeof d ? b({
            "": e
        }, "") : e;
        throw new SyntaxError("JSON.parse");
    }
})("undefined" != typeof io ? io : module.exports, "undefined" !== typeof JSON ? JSON : void 0);
(function(b, a) {
    var c = b.parser = {},
        f = c.packets = "disconnect,connect,heartbeat,message,json,event,ack,error,noop".split(","),
        e = c.reasons = ["transport not supported", "client not handshaken", "unauthorized"],
        i = c.advice = ["reconnect"],
        h = a.JSON,
        j = a.util.indexOf;
    c.encodePacket = function(a) {
        var d = j(f, a.type),
            b = a.id || "",
            c = a.endpoint || "",
            s = a.ack,
            t = null;
        switch (a.type) {
            case "error":
                var v = a.reason ? j(e, a.reason) : "",
                    a = a.advice ? j(i, a.advice) : "";
                if ("" !== v || "" !== a) t = v + ("" !== a ? "+" + a : "");
                break;
            case "message":
                "" !== a.data &&
                    (t = a.data);
                break;
            case "event":
                t = {
                    name: a.name
                };
                a.args && a.args.length && (t.args = a.args);
                t = h.stringify(t);
                break;
            case "json":
                t = h.stringify(a.data);
                break;
            case "connect":
                a.qs && (t = a.qs);
                break;
            case "ack":
                t = a.ackId + (a.args && a.args.length ? "+" + h.stringify(a.args) : "")
        }
        d = [d, b + ("data" == s ? "+" : ""), c];
        null !== t && void 0 !== t && d.push(t);
        return d.join(":")
    };
    c.encodePayload = function(a) {
        var d = "";
        if (1 == a.length) return a[0];
        for (var b = 0, e = a.length; b < e; b++) d += "\ufffd" + a[b].length + "\ufffd" + a[b];
        return d
    };
    var d = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
    c.decodePacket = function(a) {
        var b = a.match(d);
        if (!b) return {};
        var c = b[2] || "",
            a = b[5] || "",
            n = {
                type: f[b[1]],
                endpoint: b[4] || ""
            };
        c && (n.id = c, n.ack = b[3] ? "data" : !0);
        switch (n.type) {
            case "error":
                b = a.split("+");
                n.reason = e[b[0]] || "";
                n.advice = i[b[1]] || "";
                break;
            case "message":
                n.data = a || "";
                break;
            case "event":
                try {
                    var j = h.parse(a);
                    n.name = j.name;
                    n.args = j.args
                } catch (t) {}
                n.args = n.args || [];
                break;
            case "json":
                try {
                    n.data = h.parse(a)
                } catch (v) {}
                break;
            case "connect":
                n.qs = a || "";
                break;
            case "ack":
                if (b = a.match(/^([0-9]+)(\+)?(.*)/))
                    if (n.ackId =
                        b[1], n.args = [], b[3]) try {
                        n.args = b[3] ? h.parse(b[3]) : []
                    } catch (x) {}
        }
        return n
    };
    c.decodePayload = function(a) {
        if ("\ufffd" == a.charAt(0)) {
            for (var b = [], d = 1, e = ""; d < a.length; d++) "\ufffd" == a.charAt(d) ? (b.push(c.decodePacket(a.substr(d + 1).substr(0, e))), d += Number(e) + 1, e = "") : e += a.charAt(d);
            return b
        }
        return [c.decodePacket(a)]
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a) {
    function c(a, b) {
        this.socket = a;
        this.sessid = b
    }
    b.Transport = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.onData = function(b) {
        this.clearCloseTimeout();
        (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
        if ("" !== b && (b = a.parser.decodePayload(b)) && b.length)
            for (var e = 0, c = b.length; e < c; e++) this.onPacket(b[e]);
        return this
    };
    c.prototype.onPacket = function(a) {
        this.socket.setHeartbeatTimeout();
        if ("heartbeat" == a.type) return this.onHeartbeat();
        if ("connect" ==
            a.type && "" == a.endpoint) this.onConnect();
        "error" == a.type && "reconnect" == a.advice && (this.open = !1);
        this.socket.onPacket(a);
        return this
    };
    c.prototype.setCloseTimeout = function() {
        if (!this.closeTimeout) {
            var a = this;
            this.closeTimeout = setTimeout(function() {
                a.onDisconnect()
            }, this.socket.closeTimeout)
        }
    };
    c.prototype.onDisconnect = function() {
        this.close && this.open && this.close();
        this.clearTimeouts();
        this.socket.onDisconnect();
        return this
    };
    c.prototype.onConnect = function() {
        this.socket.onConnect();
        return this
    };
    c.prototype.clearCloseTimeout =
        function() {
            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
        };
    c.prototype.clearTimeouts = function() {
        this.clearCloseTimeout();
        this.reopenTimeout && clearTimeout(this.reopenTimeout)
    };
    c.prototype.packet = function(b) {
        this.send(a.parser.encodePacket(b))
    };
    c.prototype.onHeartbeat = function() {
        this.packet({
            type: "heartbeat"
        })
    };
    c.prototype.onOpen = function() {
        this.open = !0;
        this.clearCloseTimeout();
        this.socket.onOpen()
    };
    c.prototype.onClose = function() {
        this.open = !1;
        this.socket.onClose();
        this.onDisconnect()
    };
    c.prototype.prepareUrl = function() {
        var b = this.socket.options;
        return this.scheme() + "://" + b.host + ":" + b.port + "/" + b.resource + "/" + a.protocol + "/" + this.name + "/" + this.sessid
    };
    c.prototype.ready = function(a, b) {
        b.call(this)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function f(b) {
        this.options = {
            port: 80,
            secure: !1,
            document: "document" in c ? document : !1,
            resource: "socket.io",
            transports: a.transports,
            "connect timeout": 1E4,
            "try multiple transports": !0,
            reconnect: !0,
            "reconnection delay": 500,
            "reconnection limit": Infinity,
            "reopen delay": 3E3,
            "max reconnection attempts": 10,
            "sync disconnect on unload": !0,
            "auto connect": !0,
            "flash policy port": 10843
        };
        a.util.merge(this.options, b);
        this.reconnecting = this.connecting = this.open = this.connected = !1;
        this.namespaces = {};
        this.buffer = [];
        this.doBuffer = !1;
        if (this.options["sync disconnect on unload"] && (!this.isXDomain() || a.util.ua.hasCORS)) {
            var e = this;
            a.util.on(c, "unload", function() {
                e.disconnectSync()
            }, !1)
        }
        this.options["auto connect"] && this.connect()
    }

    function e() {}
    b.Socket = f;
    a.util.mixin(f, a.EventEmitter);
    f.prototype.of = function(b) {
        this.namespaces[b] || (this.namespaces[b] = new a.SocketNamespace(this, b), "" !== b && this.namespaces[b].packet({
            type: "connect"
        }));
        return this.namespaces[b]
    };
    f.prototype.publish = function() {
        this.emit.apply(this,
            arguments);
        var a, b;
        for (b in this.namespaces) this.namespaces.hasOwnProperty(b) && (a = this.of(b), a.$emit.apply(a, arguments))
    };
    f.prototype.handshake = function(b) {
        function c(a) {
            if (a instanceof Error) f.onError(a.message);
            else b.apply(null, a.split(":"))
        }
        var f = this,
            d = this.options,
            d = ["http" + (d.secure ? "s" : "") + ":/", d.host + ":" + d.port, d.resource, a.protocol, a.util.query(this.options.query, "t=" + +new Date)].join("/");
        if (this.isXDomain() && !a.util.ua.hasCORS) {
            var k = document.getElementsByTagName("script")[0],
                g = document.createElement("script");
            
            console.log("F HandShake:" + d +" json="+a.j.length);

            g.src = d + "&jsonp=" + a.j.length;
            k.parentNode.insertBefore(g, k);
            a.j.push(function(a) {
                c(a);
                g.parentNode.removeChild(g)
            })
        } else {
            var m = a.util.request();
            m.open("GET", d, !0);
            m.withCredentials = !0;
            m.onreadystatechange = function() {
                4 == m.readyState && (m.onreadystatechange = e, 200 == m.status ? c(m.responseText) : !f.reconnecting && f.onError(m.responseText))
            };
            m.send(null)
        }
    };
    f.prototype.getTransport = function(b) {
        for (var b = b || this.transports, e = 0, c; c = b[e]; e++)
            if (a.Transport[c] && a.Transport[c].check(this) && (!this.isXDomain() || a.Transport[c].xdomainCheck())) return new a.Transport[c](this,
                this.sessionid);
        return null
    };
    f.prototype.connect = function(b) {
        if (this.connecting) return this;
        var e = this;
        this.handshake(function(c, d, f, g) {
            function m(a) {
                e.transport && e.transport.clearTimeouts();
                e.transport = e.getTransport(a);
                if (!e.transport) return e.publish("connect_failed");
                e.transport.ready(e, function() {
                    e.connecting = !0;
                    e.publish("connecting", e.transport.name);
                    e.transport.open();
                    e.options["connect timeout"] && (e.connectTimeoutTimer = setTimeout(function() {
                        if (!e.connected && (e.connecting = !1, e.options["try multiple transports"])) {
                            e.remainingTransports ||
                                (e.remainingTransports = e.transports.slice(0));
                            for (var a = e.remainingTransports; 0 < a.length && a.splice(0, 1)[0] != e.transport.name;);
                            a.length ? m(a) : e.publish("connect_failed")
                        }
                    }, e.options["connect timeout"]))
                })
            }
            e.sessionid = c;
            e.closeTimeout = 1E3 * f;
            e.heartbeatTimeout = 1E3 * d;
            e.transports = g ? a.util.intersect(g.split(","), e.options.transports) : e.options.transports;
            e.setHeartbeatTimeout();
            m(e.transports);
            e.once("connect", function() {
                clearTimeout(e.connectTimeoutTimer);
                b && "function" == typeof b && b()
            })
        });
        return this
    };
    f.prototype.setHeartbeatTimeout = function() {
        clearTimeout(this.heartbeatTimeoutTimer);
        var a = this;
        this.heartbeatTimeoutTimer = setTimeout(function() {
            a.transport.onClose()
        }, this.heartbeatTimeout)
    };
    f.prototype.packet = function(a) {
        this.connected && !this.doBuffer ? this.transport.packet(a) : this.buffer.push(a);
        return this
    };
    f.prototype.setBuffer = function(a) {
        this.doBuffer = a;
        !a && this.connected && this.buffer.length && (this.transport.payload(this.buffer), this.buffer = [])
    };
    f.prototype.disconnect = function() {
        if (this.connected ||
            this.connecting) this.open && this.of("").packet({
            type: "disconnect"
        }), this.onDisconnect("booted");
        return this
    };
    f.prototype.disconnectSync = function() {
        a.util.request().open("GET", this.resource + "/" + a.protocol + "/" + this.sessionid, !0);
        this.onDisconnect("booted")
    };
    f.prototype.isXDomain = function() {
        var a = c.location.port || ("https:" == c.location.protocol ? 443 : 80);
        return this.options.host !== c.location.hostname || this.options.port != a
    };
    f.prototype.onConnect = function() {
        this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
    };
    f.prototype.onOpen = function() {
        this.open = !0
    };
    f.prototype.onClose = function() {
        this.open = !1;
        clearTimeout(this.heartbeatTimeoutTimer)
    };
    f.prototype.onPacket = function(a) {
        this.of(a.endpoint).onPacket(a)
    };
    f.prototype.onError = function(a) {
        if (a && a.advice && "reconnect" === a.advice && (this.connected || this.connecting)) this.disconnect(), this.options.reconnect && this.reconnect();
        this.publish("error", a && a.reason ? a.reason : a)
    };
    f.prototype.onDisconnect = function(a) {
        var b =
            this.connected,
            e = this.connecting;
        this.open = this.connecting = this.connected = !1;
        if (b || e) this.transport.close(), this.transport.clearTimeouts(), b && (this.publish("disconnect", a), "booted" != a && this.options.reconnect && !this.reconnecting && this.reconnect())
    };
    f.prototype.reconnect = function() {
        function a() {
            if (e.connected) {
                for (var d in e.namespaces) e.namespaces.hasOwnProperty(d) && "" !== d && e.namespaces[d].packet({
                    type: "connect"
                });
                e.publish("reconnect", e.transport.name, e.reconnectionAttempts)
            }
            clearTimeout(e.reconnectionTimer);
            e.removeListener("connect_failed", b);
            e.removeListener("connect", b);
            e.reconnecting = !1;
            delete e.reconnectionAttempts;
            delete e.reconnectionDelay;
            delete e.reconnectionTimer;
            delete e.redoTransports;
            e.options["try multiple transports"] = c
        }

        function b() {
            if (e.reconnecting) {
                if (e.connected) return a();
                if (e.connecting && e.reconnecting) return e.reconnectionTimer = setTimeout(b, 1E3);
                e.reconnectionAttempts++ >= d ? e.redoTransports ? (e.publish("reconnect_failed"), a()) : (e.on("connect_failed", b), e.options["try multiple transports"] = !0, e.transport = e.getTransport(), e.redoTransports = !0, e.connect()) : (e.reconnectionDelay < f && (e.reconnectionDelay *= 2), e.connect(), e.publish("reconnecting", e.reconnectionDelay, e.reconnectionAttempts), e.reconnectionTimer = setTimeout(b, e.reconnectionDelay))
            }
        }
        this.reconnecting = !0;
        this.reconnectionAttempts = 0;
        this.reconnectionDelay = this.options["reconnection delay"];
        var e = this,
            d = this.options["max reconnection attempts"],
            c = this.options["try multiple transports"],
            f = this.options["reconnection limit"];
        this.options["try multiple transports"] = !1;
        this.reconnectionTimer = setTimeout(b, this.reconnectionDelay);
        this.on("connect", b)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c(a, b) {
        this.socket = a;
        this.name = b || "";
        this.flags = {};
        this.json = new f(this, "json");
        this.ackPackets = 0;
        this.acks = {}
    }

    function f(a, b) {
        this.namespace = a;
        this.name = b
    }
    b.SocketNamespace = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.$emit = a.EventEmitter.prototype.emit;
    c.prototype.of = function() {
        return this.socket.of.apply(this.socket, arguments)
    };
    c.prototype.packet = function(a) {
        a.endpoint = this.name;
        this.socket.packet(a);
        this.flags = {};
        return this
    };
    c.prototype.send = function(a, b) {
        var c = {
            type: this.flags.json ?
                "json" : "message",
            data: a
        };
        "function" == typeof b && (c.id = ++this.ackPackets, c.ack = !0, this.acks[c.id] = b);
        return this.packet(c)
    };
    c.prototype.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1),
            c = b[b.length - 1],
            f = {
                type: "event",
                name: a
            };
        "function" == typeof c && (f.id = ++this.ackPackets, f.ack = "data", this.acks[f.id] = c, b = b.slice(0, b.length - 1));
        f.args = b;
        return this.packet(f)
    };
    c.prototype.disconnect = function() {
        "" === this.name ? this.socket.disconnect() : (this.packet({
            type: "disconnect"
        }), this.$emit("disconnect"));
        return this
    };
    c.prototype.onPacket = function(b) {
        function c() {
            f.packet({
                type: "ack",
                args: a.util.toArray(arguments),
                ackId: b.id
            })
        }
        var f = this;
        switch (b.type) {
            case "connect":
                this.$emit("connect");
                break;
            case "disconnect":
                if ("" === this.name) this.socket.onDisconnect(b.reason || "booted");
                else this.$emit("disconnect", b.reason);
                break;
            case "message":
            case "json":
                var j = ["message", b.data];
                "data" == b.ack ? j.push(c) : b.ack && this.packet({
                    type: "ack",
                    ackId: b.id
                });
                this.$emit.apply(this, j);
                break;
            case "event":
                j = [b.name].concat(b.args);
                "data" == b.ack && j.push(c);
                this.$emit.apply(this, j);
                break;
            case "ack":
                this.acks[b.ackId] && (this.acks[b.ackId].apply(this, b.args), delete this.acks[b.ackId]);
                break;
            case "error":
                if (b.advice) this.socket.onError(b);
                else "unauthorized" == b.reason ? this.$emit("connect_failed", b.reason) : this.$emit("error", b.reason)
        }
    };
    f.prototype.send = function() {
        this.namespace.flags[this.name] = !0;
        this.namespace.send.apply(this.namespace, arguments)
    };
    f.prototype.emit = function() {
        this.namespace.flags[this.name] = !0;
        this.namespace.emit.apply(this.namespace,
            arguments)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function f(b) {
        a.Transport.apply(this, arguments)
    }
    b.websocket = f;
    a.util.inherit(f, a.Transport);
    f.prototype.name = "websocket";
    f.prototype.open = function() {
        var b = a.util.query(this.socket.options.query),
            f = this,
            h;
        h || (h = c.MozWebSocket || c.WebSocket);
        this.websocket = new h(this.prepareUrl() + b);
        this.websocket.onopen = function() {
            f.onOpen();
            f.socket.setBuffer(!1)
        };
        this.websocket.onmessage = function(a) {
            f.onData(a.data)
        };
        this.websocket.onclose = function() {
            f.onClose();
            f.socket.setBuffer(!0)
        };
        this.websocket.onerror =
            function(a) {
                f.onError(a)
            };
        return this
    };
    f.prototype.send = function(a) {
        this.websocket.send(a);
        return this
    };
    f.prototype.payload = function(a) {
        for (var b = 0, c = a.length; b < c; b++) this.packet(a[b]);
        return this
    };
    f.prototype.close = function() {
        this.websocket.close();
        return this
    };
    f.prototype.onError = function(a) {
        this.socket.onError(a)
    };
    f.prototype.scheme = function() {
        return this.socket.options.secure ? "wss" : "ws"
    };
    f.check = function() {
        return "WebSocket" in c && !("__addTask" in WebSocket) || "MozWebSocket" in c
    };
    f.xdomainCheck = function() {
        return !0
    };
    a.transports.push("websocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c() {
        a.Transport.websocket.apply(this, arguments)
    }
    b.flashsocket = c;
    a.util.inherit(c, a.Transport.websocket);
    c.prototype.name = "flashsocket";
    c.prototype.open = function() {
        var b = this,
            e = arguments;
        WebSocket.__addTask(function() {
            a.Transport.websocket.prototype.open.apply(b, e)
        });
        return this
    };
    c.prototype.send = function() {
        var b = this,
            e = arguments;
        WebSocket.__addTask(function() {
            a.Transport.websocket.prototype.send.apply(b, e)
        });
        return this
    };
    c.prototype.close = function() {
        WebSocket.__tasks.length =
            0;
        a.Transport.websocket.prototype.close.call(this);
        return this
    };
    c.prototype.ready = function(b, e) {
        function i() {
            var a = b.options,
                d = a["flash policy port"],
                k = ["http" + (a.secure ? "s" : "") + ":/", a.host + ":" + a.port, a.resource, "static/flashsocket", "WebSocketMain" + (b.isXDomain() ? "Insecure" : "") + ".swf"];
            c.loaded || ("undefined" === typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = k.join("/")), 843 !== d && WebSocket.loadFlashPolicyFile("xmlsocket://" + a.host + ":" + d), WebSocket.__initialize(), c.loaded = !0);
            e.call(h)
        }
        var h =
            this;
        if (document.body) return i();
        a.util.load(i)
    };
    c.check = function() {
        return "undefined" == typeof WebSocket || !("__initialize" in WebSocket) || !swfobject ? !1 : 10 <= swfobject.getFlashPlayerVersion().major
    };
    c.xdomainCheck = function() {
        return !0
    };
    "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0);
    a.transports.push("flashsocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
if ("undefined" != typeof window) var swfobject = function() {
    function b() {
        if (!B) {
            try {
                var a = o.getElementsByTagName("body")[0].appendChild(o.createElement("span"));
                a.parentNode.removeChild(a)
            } catch (b) {
                return
            }
            B = !0;
            for (var a = F.length, d = 0; d < a; d++) F[d]()
        }
    }

    function a(a) {
        B ? a() : F[F.length] = a
    }

    function c(a) {
        if (typeof u.addEventListener != r) u.addEventListener("load", a, !1);
        else if (typeof o.addEventListener != r) o.addEventListener("load", a, !1);
        else if (typeof u.attachEvent != r) s(u, "onload", a);
        else if ("function" == typeof u.onload) {
            var b =
                u.onload;
            u.onload = function() {
                b();
                a()
            }
        } else u.onload = a
    }

    function f() {
        var a = o.getElementsByTagName("body")[0],
            b = o.createElement(q);
        b.setAttribute("type", p);
        var d = a.appendChild(b);
        if (d) {
            var c = 0;
            (function() {
                if (typeof d.GetVariable != r) {
                    var f = d.GetVariable("$version");
                    f && (f = f.split(" ")[1].split(","), l.pv = [parseInt(f[0], 10), parseInt(f[1], 10), parseInt(f[2], 10)])
                } else if (10 > c) {
                    c++;
                    setTimeout(arguments.callee, 10);
                    return
                }
                a.removeChild(b);
                d = null;
                e()
            })()
        } else e()
    }

    function e() {
        var a = z.length;
        if (0 < a)
            for (var b = 0; b <
                a; b++) {
                var e = z[b].id,
                    c = z[b].callbackFn,
                    f = {
                        success: !1,
                        id: e
                    };
                if (0 < l.pv[0]) {
                    var g = n(e);
                    if (g)
                        if (t(z[b].swfVersion) && !(l.wk && 312 > l.wk)) x(e, !0), c && (f.success = !0, f.ref = i(e), c(f));
                        else if (z[b].expressInstall && h()) {
                        f = {};
                        f.data = z[b].expressInstall;
                        f.width = g.getAttribute("width") || "0";
                        f.height = g.getAttribute("height") || "0";
                        g.getAttribute("class") && (f.styleclass = g.getAttribute("class"));
                        g.getAttribute("align") && (f.align = g.getAttribute("align"));
                        for (var k = {}, g = g.getElementsByTagName("param"), m = g.length, s = 0; s <
                            m; s++) "movie" != g[s].getAttribute("name").toLowerCase() && (k[g[s].getAttribute("name")] = g[s].getAttribute("value"));
                        j(f, k, e, c)
                    } else d(g), c && c(f)
                } else if (x(e, !0), c) {
                    if ((e = i(e)) && typeof e.SetVariable != r) f.success = !0, f.ref = e;
                    c(f)
                }
            }
    }

    function i(a) {
        var b = null;
        if ((a = n(a)) && "OBJECT" == a.nodeName) typeof a.SetVariable != r ? b = a : (a = a.getElementsByTagName(q)[0]) && (b = a);
        return b
    }

    function h() {
        return !G && t("6.0.65") && (l.win || l.mac) && !(l.wk && 312 > l.wk)
    }

    function j(a, b, d, e) {
        G = !0;
        J = e || null;
        M = {
            success: !1,
            id: d
        };
        var c = n(d);
        if (c) {
            "OBJECT" ==
            c.nodeName ? (E = k(c), H = null) : (E = c, H = d);
            a.id = w;
            if (typeof a.width == r || !/%$/.test(a.width) && 310 > parseInt(a.width, 10)) a.width = "310";
            if (typeof a.height == r || !/%$/.test(a.height) && 137 > parseInt(a.height, 10)) a.height = "137";
            o.title = o.title.slice(0, 47) + " - Flash Player Installation";
            e = l.ie && l.win ? ["Active"].concat("").join("X") : "PlugIn";
            e = "MMredirectURL=" + u.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + e + "&MMdoctitle=" + o.title;
            b.flashvars = typeof b.flashvars != r ? b.flashvars + ("&" + e) : e;
            l.ie && l.win && 4 !=
                c.readyState && (e = o.createElement("div"), d += "SWFObjectNew", e.setAttribute("id", d), c.parentNode.insertBefore(e, c), c.style.display = "none", function() {
                    c.readyState == 4 ? c.parentNode.removeChild(c) : setTimeout(arguments.callee, 10)
                }());
            g(a, b, d)
        }
    }

    function d(a) {
        if (l.ie && l.win && 4 != a.readyState) {
            var b = o.createElement("div");
            a.parentNode.insertBefore(b, a);
            b.parentNode.replaceChild(k(a), b);
            a.style.display = "none";
            (function() {
                4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
            })()
        } else a.parentNode.replaceChild(k(a),
            a)
    }

    function k(a) {
        var b = o.createElement("div");
        if (l.win && l.ie) b.innerHTML = a.innerHTML;
        else if (a = a.getElementsByTagName(q)[0])
            if (a = a.childNodes)
                for (var d = a.length, e = 0; e < d; e++) !(1 == a[e].nodeType && "PARAM" == a[e].nodeName) && 8 != a[e].nodeType && b.appendChild(a[e].cloneNode(!0));
        return b
    }

    function g(a, b, d) {
        var e, c = n(d);
        if (l.wk && 312 > l.wk) return e;
        if (c)
            if (typeof a.id == r && (a.id = d), l.ie && l.win) {
                var f = "",
                    g;
                for (g in a) a[g] != Object.prototype[g] && ("data" == g.toLowerCase() ? b.movie = a[g] : "styleclass" == g.toLowerCase() ? f +=
                    ' class="' + a[g] + '"' : "classid" != g.toLowerCase() && (f += " " + g + '="' + a[g] + '"'));
                g = "";
                for (var k in b) b[k] != Object.prototype[k] && (g += '<param name="' + k + '" value="' + b[k] + '" />');
                c.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + g + "</object>";
                I[I.length] = a.id;
                e = n(a.id)
            } else {
                k = o.createElement(q);
                k.setAttribute("type", p);
                for (var h in a) a[h] != Object.prototype[h] && ("styleclass" == h.toLowerCase() ? k.setAttribute("class", a[h]) : "classid" != h.toLowerCase() && k.setAttribute(h, a[h]));
                for (f in b) b[f] !=
                    Object.prototype[f] && "movie" != f.toLowerCase() && (a = k, g = f, h = b[f], d = o.createElement("param"), d.setAttribute("name", g), d.setAttribute("value", h), a.appendChild(d));
                c.parentNode.replaceChild(k, c);
                e = k
            }
        return e
    }

    function m(a) {
        var b = n(a);
        b && "OBJECT" == b.nodeName && (l.ie && l.win ? (b.style.display = "none", function() {
            if (4 == b.readyState) {
                var d = n(a);
                if (d) {
                    for (var e in d) "function" == typeof d[e] && (d[e] = null);
                    d.parentNode.removeChild(d)
                }
            } else setTimeout(arguments.callee, 10)
        }()) : b.parentNode.removeChild(b))
    }

    function n(a) {
        var b =
            null;
        try {
            b = o.getElementById(a)
        } catch (d) {}
        return b
    }

    function s(a, b, d) {
        a.attachEvent(b, d);
        C[C.length] = [a, b, d]
    }

    function t(a) {
        var b = l.pv,
            a = a.split(".");
        a[0] = parseInt(a[0], 10);
        a[1] = parseInt(a[1], 10) || 0;
        a[2] = parseInt(a[2], 10) || 0;
        return b[0] > a[0] || b[0] == a[0] && b[1] > a[1] || b[0] == a[0] && b[1] == a[1] && b[2] >= a[2] ? !0 : !1
    }

    function v(a, b, d, e) {
        if (!l.ie || !l.mac) {
            var c = o.getElementsByTagName("head")[0];
            if (c) {
                d = d && "string" == typeof d ? d : "screen";
                e && (K = y = null);
                if (!y || K != d) e = o.createElement("style"), e.setAttribute("type", "text/css"),
                    e.setAttribute("media", d), y = c.appendChild(e), l.ie && l.win && typeof o.styleSheets != r && 0 < o.styleSheets.length && (y = o.styleSheets[o.styleSheets.length - 1]), K = d;
                l.ie && l.win ? y && typeof y.addRule == q && y.addRule(a, b) : y && typeof o.createTextNode != r && y.appendChild(o.createTextNode(a + " {" + b + "}"))
            }
        }
    }

    function x(a, b) {
        if (N) {
            var d = b ? "visible" : "hidden";
            B && n(a) ? n(a).style.visibility = d : v("#" + a, "visibility:" + d)
        }
    }

    function D(a) {
        return null != /[\\\"<>\.;]/.exec(a) && typeof encodeURIComponent != r ? encodeURIComponent(a) : a
    }
    var r = "undefined",
        q = "object",
        p = "application/x-shockwave-flash",
        w = "SWFObjectExprInst",
        u = window,
        o = document,
        A = navigator,
        O = !1,
        F = [function() {
            O ? f() : e()
        }],
        z = [],
        I = [],
        C = [],
        E, H, J, M, B = !1,
        G = !1,
        y, K, N = !0,
        l = function() {
            var a = typeof o.getElementById != r && typeof o.getElementsByTagName != r && typeof o.createElement != r,
                b = A.userAgent.toLowerCase(),
                d = A.platform.toLowerCase(),
                e = d ? /win/.test(d) : /win/.test(b),
                d = d ? /mac/.test(d) : /mac/.test(b),
                b = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                c = !+"\v1",
                f = [0, 0, 0],
                g = null;
            if (typeof A.plugins != r && typeof A.plugins["Shockwave Flash"] == q) {
                if ((g = A.plugins["Shockwave Flash"].description) && !(typeof A.mimeTypes != r && A.mimeTypes[p] && !A.mimeTypes[p].enabledPlugin)) O = !0, c = !1, g = g.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), f[0] = parseInt(g.replace(/^(.*)\..*$/, "$1"), 10), f[1] = parseInt(g.replace(/^.*\.(.*)\s.*$/, "$1"), 10), f[2] = /[a-zA-Z]/.test(g) ? parseInt(g.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            } else if (typeof u[["Active"].concat("Object").join("X")] != r) try {
                var k = new(window[["Active"].concat("Object").join("X")])("ShockwaveFlash.ShockwaveFlash");
                if (k && (g = k.GetVariable("$version"))) c = !0, g = g.split(" ")[1].split(","), f = [parseInt(g[0], 10), parseInt(g[1], 10), parseInt(g[2], 10)]
            } catch (n) {}
            return {
                w3: a,
                pv: f,
                wk: b,
                ie: c,
                win: e,
                mac: d
            }
        }();
    (function() {
        l.w3 && ((typeof o.readyState != r && "complete" == o.readyState || typeof o.readyState == r && (o.getElementsByTagName("body")[0] || o.body)) && b(), B || (typeof o.addEventListener != r && o.addEventListener("DOMContentLoaded", b, !1), l.ie && l.win && (o.attachEvent("onreadystatechange", function() {
            "complete" == o.readyState && (o.detachEvent("onreadystatechange",
                arguments.callee), b())
        }), u == top && function() {
            if (!B) {
                try {
                    o.documentElement.doScroll("left")
                } catch (a) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                b()
            }
        }()), l.wk && function() {
            B || (/loaded|complete/.test(o.readyState) ? b() : setTimeout(arguments.callee, 0))
        }(), c(b)))
    })();
    (function() {
        l.ie && l.win && window.attachEvent("onunload", function() {
            for (var a = C.length, b = 0; b < a; b++) C[b][0].detachEvent(C[b][1], C[b][2]);
            a = I.length;
            for (b = 0; b < a; b++) m(I[b]);
            for (var d in l) l[d] = null;
            l = null;
            for (var e in swfobject) swfobject[e] = null;
            swfobject =
                null
        })
    })();
    return {
        registerObject: function(a, b, d, e) {
            if (l.w3 && a && b) {
                var c = {};
                c.id = a;
                c.swfVersion = b;
                c.expressInstall = d;
                c.callbackFn = e;
                z[z.length] = c;
                x(a, !1)
            } else e && e({
                success: !1,
                id: a
            })
        },
        getObjectById: function(a) {
            if (l.w3) return i(a)
        },
        embedSWF: function(b, d, e, c, f, k, n, i, m, s) {
            var o = {
                success: !1,
                id: d
            };
            l.w3 && !(l.wk && 312 > l.wk) && b && d && e && c && f ? (x(d, !1), a(function() {
                e += "";
                c += "";
                var a = {};
                if (m && typeof m === q)
                    for (var l in m) a[l] = m[l];
                a.data = b;
                a.width = e;
                a.height = c;
                l = {};
                if (i && typeof i === q)
                    for (var v in i) l[v] = i[v];
                if (n &&
                    typeof n === q)
                    for (var p in n) l.flashvars = typeof l.flashvars != r ? l.flashvars + ("&" + p + "=" + n[p]) : p + "=" + n[p];
                if (t(f)) v = g(a, l, d), a.id == d && x(d, !0), o.success = !0, o.ref = v;
                else {
                    if (k && h()) {
                        a.data = k;
                        j(a, l, d, s);
                        return
                    }
                    x(d, !0)
                }
                s && s(o)
            })) : s && s(o)
        },
        switchOffAutoHideShow: function() {
            N = !1
        },
        ua: l,
        getFlashPlayerVersion: function() {
            return {
                major: l.pv[0],
                minor: l.pv[1],
                release: l.pv[2]
            }
        },
        hasFlashPlayerVersion: t,
        createSWF: function(a, b, d) {
            if (l.w3) return g(a, b, d)
        },
        showExpressInstall: function(a, b, d, e) {
            l.w3 && h() && j(a, b, d, e)
        },
        removeSWF: function(a) {
            l.w3 &&
                m(a)
        },
        createCSS: function(a, b, d, e) {
            l.w3 && v(a, b, d, e)
        },
        addDomLoadEvent: a,
        addLoadEvent: c,
        getQueryParamValue: function(a) {
            var b = o.location.search || o.location.hash;
            if (b) {
                /\?/.test(b) && (b = b.split("?")[1]);
                if (null == a) return D(b);
                for (var b = b.split("&"), d = 0; d < b.length; d++)
                    if (b[d].substring(0, b[d].indexOf("=")) == a) return D(b[d].substring(b[d].indexOf("=") + 1))
            }
            return ""
        },
        expressInstallCallback: function() {
            if (G) {
                var a = n(w);
                a && E && (a.parentNode.replaceChild(E, a), H && (x(H, !0), l.ie && l.win && (E.style.display = "block")),
                    J && J(M));
                G = !1
            }
        }
    }
}();
(function() {
    if (!("undefined" == typeof window || window.WebSocket)) {
        var b = window.console;
        if (!b || !b.log || !b.error) b = {
            log: function() {},
            error: function() {}
        };
        swfobject.hasFlashPlayerVersion("10.0.0") ? ("file:" == location.protocol && b.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function(a, b, f, e, i) {
                var h = this;
                h.__id = WebSocket.__nextId++;
                WebSocket.__instances[h.__id] = h;
                h.readyState = WebSocket.CONNECTING;
                h.bufferedAmount = 0;
                h.__events = {};
                b ? "string" == typeof b && (b = [b]) : b = [];
                setTimeout(function() {
                    WebSocket.__addTask(function() {
                        WebSocket.__flash.create(h.__id, a, b, f || null, e || 0, i || null)
                    })
                }, 0)
            }, WebSocket.prototype.send = function(a) {
                if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
                a = WebSocket.__flash.send(this.__id, encodeURIComponent(a));
                if (0 > a) return !0;
                this.bufferedAmount += a;
                return !1
            }, WebSocket.prototype.close = function() {
                this.readyState == WebSocket.CLOSED ||
                    this.readyState == WebSocket.CLOSING || (this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id))
            }, WebSocket.prototype.addEventListener = function(a, b) {
                a in this.__events || (this.__events[a] = []);
                this.__events[a].push(b)
            }, WebSocket.prototype.removeEventListener = function(a, b) {
                if (a in this.__events)
                    for (var f = this.__events[a], e = f.length - 1; 0 <= e; --e)
                        if (f[e] === b) {
                            f.splice(e, 1);
                            break
                        }
            }, WebSocket.prototype.dispatchEvent = function(a) {
                for (var b = this.__events[a.type] || [], f = 0; f < b.length; ++f) b[f](a);
                (b = this["on" +
                    a.type]) && b(a)
            }, WebSocket.prototype.__handleEvent = function(a) {
                "readyState" in a && (this.readyState = a.readyState);
                "protocol" in a && (this.protocol = a.protocol);
                if ("open" == a.type || "error" == a.type) a = this.__createSimpleEvent(a.type);
                else if ("close" == a.type) a = this.__createSimpleEvent("close");
                else if ("message" == a.type) a = this.__createMessageEvent("message", decodeURIComponent(a.message));
                else throw "unknown event type: " + a.type;
                this.dispatchEvent(a)
            }, WebSocket.prototype.__createSimpleEvent = function(a) {
                if (document.createEvent &&
                    window.Event) {
                    var b = document.createEvent("Event");
                    b.initEvent(a, !1, !1);
                    return b
                }
                return {
                    type: a,
                    bubbles: !1,
                    cancelable: !1
                }
            }, WebSocket.prototype.__createMessageEvent = function(a, b) {
                if (document.createEvent && window.MessageEvent && !window.opera) {
                    var f = document.createEvent("MessageEvent");
                    f.initMessageEvent("message", !1, !1, b, null, null, window, null);
                    return f
                }
                return {
                    type: a,
                    data: b,
                    bubbles: !1,
                    cancelable: !1
                }
            }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function(a) {
                WebSocket.__addTask(function() {
                    WebSocket.__flash.loadManualPolicyFile(a)
                })
            }, WebSocket.__initialize = function() {
                if (!WebSocket.__flash)
                    if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), window.WEB_SOCKET_SWF_LOCATION) {
                        var a = document.createElement("div");
                        a.id = "webSocketContainer";
                        a.style.position = "absolute";
                        WebSocket.__isFlashLite() ? (a.style.left = "0px", a.style.top = "0px") : (a.style.left =
                            "-100px", a.style.top = "-100px");
                        var c = document.createElement("div");
                        c.id = "webSocketFlash";
                        a.appendChild(c);
                        document.body.appendChild(a);
                        swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
                            hasPriority: !0,
                            swliveconnect: !0,
                            allowScriptAccess: "always"
                        }, null, function(a) {
                            a.success || b.error("[WebSocket] swfobject.embedSWF failed")
                        })
                    } else b.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf")
            }, WebSocket.__onFlashInitialized = function() {
                setTimeout(function() {
                    WebSocket.__flash =
                        document.getElementById("webSocketFlash");
                    WebSocket.__flash.setCallerUrl(location.href);
                    WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                    for (var a = 0; a < WebSocket.__tasks.length; ++a) WebSocket.__tasks[a]();
                    WebSocket.__tasks = []
                }, 0)
            }, WebSocket.__onFlashEvent = function() {
                setTimeout(function() {
                    try {
                        for (var a = WebSocket.__flash.receiveEvents(), c = 0; c < a.length; ++c) WebSocket.__instances[a[c].webSocketId].__handleEvent(a[c])
                    } catch (f) {
                        b.error(f)
                    }
                }, 0);
                return !0
            }, WebSocket.__log = function(a) {
                b.log(decodeURIComponent(a))
            },
            WebSocket.__error = function(a) {
                b.error(decodeURIComponent(a))
            }, WebSocket.__addTask = function(a) {
                WebSocket.__flash ? a() : WebSocket.__tasks.push(a)
            }, WebSocket.__isFlashLite = function() {
                if (!window.navigator || !window.navigator.mimeTypes) return !1;
                var a = window.navigator.mimeTypes["application/x-shockwave-flash"];
                return !a || !a.enabledPlugin || !a.enabledPlugin.filename ? !1 : a.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1
            }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load",
                function() {
                    WebSocket.__initialize()
                }, !1) : window.attachEvent("onload", function() {
                WebSocket.__initialize()
            }))) : b.error("Flash Player >= 10.0.0 is required.")
    }
})();
(function(b, a, c) {
    function f(b) {
        b && (a.Transport.apply(this, arguments), this.sendBuffer = [])
    }

    function e() {}
    b.XHR = f;
    a.util.inherit(f, a.Transport);
    f.prototype.open = function() {
        this.socket.setBuffer(!1);
        this.onOpen();
        this.get();
        this.setCloseTimeout();
        return this
    };
    f.prototype.payload = function(b) {
        for (var e = [], c = 0, d = b.length; c < d; c++) e.push(a.parser.encodePacket(b[c]));
        this.send(a.parser.encodePayload(e))
    };
    f.prototype.send = function(a) {
        this.post(a);
        return this
    };
    f.prototype.post = function(a) {
        function b() {
            if (4 ==
                this.readyState)
                if (this.onreadystatechange = e, d.posting = !1, 200 == this.status) d.socket.setBuffer(!1);
                else d.onClose()
        }

        function f() {
            this.onload = e;
            d.socket.setBuffer(!1)
        }
        var d = this;
        this.socket.setBuffer(!0);
        this.sendXHR = this.request("POST");
        c.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = f : this.sendXHR.onreadystatechange = b;
        this.sendXHR.send(a)
    };
    f.prototype.close = function() {
        this.onClose();
        return this
    };
    f.prototype.request = function(b) {
        var e = a.util.request(this.socket.isXDomain()),
            c = a.util.query(this.socket.options.query, "t=" + +new Date);
        e.open(b || "GET", this.prepareUrl() + c, !0);
        if ("POST" == b) try {
            e.setRequestHeader ? e.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : e.contentType = "text/plain"
        } catch (d) {}
        return e
    };
    f.prototype.scheme = function() {
        return this.socket.options.secure ? "https" : "http"
    };
    f.check = function(b, e) {
        try {
            var f = a.util.request(e),
                d = c.XDomainRequest && f instanceof XDomainRequest,
                k = (b && b.options && b.options.secure ? "https:" : "http:") != c.location.protocol;
            if (f && (!d ||
                    !k)) return !0
        } catch (g) {}
        return !1
    };
    f.xdomainCheck = function() {
        return f.check(null, !0)
    }
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c(b) {
        a.Transport.XHR.apply(this, arguments)
    }
    b.htmlfile = c;
    a.util.inherit(c, a.Transport.XHR);
    c.prototype.name = "htmlfile";
    c.prototype.get = function() {
        this.doc = new(window[["Active"].concat("Object").join("X")])("htmlfile");
        this.doc.open();
        this.doc.write("<html></html>");
        this.doc.close();
        this.doc.parentWindow.s = this;
        var b = this.doc.createElement("div");
        b.className = "socketio";
        this.doc.body.appendChild(b);
        this.iframe = this.doc.createElement("iframe");
        b.appendChild(this.iframe);
        var e =
            this,
            b = a.util.query(this.socket.options.query, "t=" + +new Date);
        this.iframe.src = this.prepareUrl() + b;
        a.util.on(window, "unload", function() {
            e.destroy()
        })
    };
    c.prototype._ = function(a, b) {
        this.onData(a);
        try {
            var c = b.getElementsByTagName("script")[0];
            c.parentNode.removeChild(c)
        } catch (h) {}
    };
    c.prototype.destroy = function() {
        if (this.iframe) {
            try {
                this.iframe.src = "about:blank"
            } catch (a) {}
            this.doc = null;
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe = null;
            CollectGarbage()
        }
    };
    c.prototype.close = function() {
        this.destroy();
        return a.Transport.XHR.prototype.close.call(this)
    };
    c.check = function() {
        if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window) try {
            return new(window[["Active"].concat("Object").join("X")])("htmlfile") && a.Transport.XHR.check()
        } catch (b) {}
        return !1
    };
    c.xdomainCheck = function() {
        return !1
    };
    a.transports.push("htmlfile")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function f() {
        a.Transport.XHR.apply(this, arguments)
    }

    function e() {}
    b["xhr-polling"] = f;
    a.util.inherit(f, a.Transport.XHR);
    a.util.merge(f, a.Transport.XHR);
    f.prototype.name = "xhr-polling";
    f.prototype.open = function() {
        a.Transport.XHR.prototype.open.call(this);
        return !1
    };
    f.prototype.get = function() {
        function a() {
            if (4 == this.readyState)
                if (this.onreadystatechange = e, 200 == this.status) d.onData(this.responseText), d.get();
                else d.onClose()
        }

        function b() {
            this.onerror = this.onload = e;
            d.onData(this.responseText);
            d.get()
        }

        function f() {
            d.onClose()
        }
        if (this.open) {
            var d = this;
            this.xhr = this.request();
            c.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = b, this.xhr.onerror = f) : this.xhr.onreadystatechange = a;
            this.xhr.send(null)
        }
    };
    f.prototype.onClose = function() {
        a.Transport.XHR.prototype.onClose.call(this);
        if (this.xhr) {
            this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = e;
            try {
                this.xhr.abort()
            } catch (b) {}
            this.xhr = null
        }
    };
    f.prototype.ready = function(b, e) {
        var c = this;
        a.util.defer(function() {
            e.call(c)
        })
    };
    a.transports.push("xhr-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a, c) {
    function f(b) {
        a.Transport["xhr-polling"].apply(this, arguments);
        this.index = a.j.length;
        var e = this;
        a.j.push(function(a) {
            e._(a)
        })
    }
    var e = c.document && "MozAppearance" in c.document.documentElement.style;
    b["jsonp-polling"] = f;
    a.util.inherit(f, a.Transport["xhr-polling"]);
    f.prototype.name = "jsonp-polling";
    f.prototype.post = function(b) {
        function e() {
            c();
            d.socket.setBuffer(!1)
        }

        function c() {
            d.iframe && d.form.removeChild(d.iframe);
            try {
                s = document.createElement('<iframe name="' + d.iframeId + '">')
            } catch (a) {
                s =
                    document.createElement("iframe"), s.name = d.iframeId
            }
            s.id = d.iframeId;
            d.form.appendChild(s);
            d.iframe = s
        }
        var d = this,
            f = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        if (!this.form) {
            var g = document.createElement("form"),
                m = document.createElement("textarea"),
                n = this.iframeId = "socketio_iframe_" + this.index,
                s;
            g.className = "socketio";
            g.style.position = "absolute";
            g.style.top = "0px";
            g.style.left = "0px";
            g.style.display = "none";
            g.target = n;
            g.method = "POST";
            g.setAttribute("accept-charset", "utf-8");
            m.name = "d";
            g.appendChild(m);
            document.body.appendChild(g);
            this.form = g;
            this.area = m
        }
        this.form.action = this.prepareUrl() + f;
        c();
        this.area.value = a.JSON.stringify(b);
        try {
            this.form.submit()
        } catch (t) {}
        this.iframe.attachEvent ? s.onreadystatechange = function() {
            "complete" == d.iframe.readyState && e()
        } : this.iframe.onload = e;
        this.socket.setBuffer(!0)
    };
    f.prototype.get = function() {
        var b = this,
            c = document.createElement("script"),
            f = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        this.script && (this.script.parentNode.removeChild(this.script),
            this.script = null);
        c.async = !0;
        c.src = this.prepareUrl() + f;
        c.onerror = function() {
            b.onClose()
        };
        f = document.getElementsByTagName("script")[0];
        f.parentNode.insertBefore(c, f);
        this.script = c;
        e && setTimeout(function() {
            var a = document.createElement("iframe");
            document.body.appendChild(a);
            document.body.removeChild(a)
        }, 100)
    };
    f.prototype._ = function(a) {
        this.onData(a);
        this.open && this.get();
        return this
    };
    f.prototype.ready = function(b, c) {
        var f = this;
        if (!e) return c.call(this);
        a.util.load(function() {
            c.call(f)
        })
    };
    f.check = function() {
        return "document" in
            c
    };
    f.xdomainCheck = function() {
        return !0
    };
    a.transports.push("jsonp-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
var Erizo = Erizo || {};
Erizo.EventDispatcher = function(b) {
    var a = {};
    b.dispatcher = {};
    b.dispatcher.eventListeners = {};
    a.addEventListener = function(a, f) {
        void 0 === b.dispatcher.eventListeners[a] && (b.dispatcher.eventListeners[a] = []);
        b.dispatcher.eventListeners[a].push(f)
    };
    a.removeEventListener = function(a, f) {
        var e;
        e = b.dispatcher.eventListeners[a].indexOf(f); - 1 !== e && b.dispatcher.eventListeners[a].splice(e, 1)
    };
    a.dispatchEvent = function(a) {
        var f;
        L.Logger.debug("Event: " + a.type);
        for (f in b.dispatcher.eventListeners[a.type])
            if (b.dispatcher.eventListeners[a.type].hasOwnProperty(f)) b.dispatcher.eventListeners[a.type][f](a)
    };
    return a
};
Erizo.LicodeEvent = function(b) {
    var a = {};
    a.type = b.type;
    return a
};
Erizo.RoomEvent = function(b) {
    var a = Erizo.LicodeEvent(b);
    a.streams = b.streams;
    a.message = b.message;
    return a
};
Erizo.StreamEvent = function(b) {
    var a = Erizo.LicodeEvent(b);
    a.stream = b.stream;
    a.msg = b.msg;
    a.bandwidth = b.bandwidth;
    return a
};
Erizo.PublisherEvent = function(b) {
    return Erizo.LicodeEvent(b)
};
Erizo = Erizo || {};
Erizo.FcStack = function(b) {
    var a = {
        pcConfig: {},
        peerConnection: {},
        desc: {},
        signalCallback: void 0,
        close: function() {
            console.log("Close FcStack")
        },
        createOffer: function() {
            console.log("FCSTACK: CreateOffer")
        },
        addStream: function(a) {
            console.log("FCSTACK: addStream", a)
        },
        processSignalingMessage: function(b) {
            console.log("FCSTACK: processSignaling", b);
            void 0 !== a.signalCallback && a.signalCallback(b)
        },
        sendSignalingMessage: function(a) {
            console.log("FCSTACK: Sending signaling Message", a);
            b.callback(a)
        },
        setSignalingCallback: function(b) {
            console.log("FCSTACK: Setting signalling callback");
            a.signalCallback = b
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.BowserStack = function(b) {
    var a = {},
        c = webkitRTCPeerConnection;
    a.pcConfig = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    void 0 !== b.stunServerUrl && a.pcConfig.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pcConfig.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {
        offerToReceiveVideo: b.video,
        offerToReceiveAudio: b.audio
    };
    a.peerConnection =
        new c(a.pcConfig, a.con);
    b.remoteDescriptionSet = !1;
    var f = function(a) {
        var e, c;
        if (b.maxVideoBW) {
            e = a.match(/m=video.*\r\n/);
            e == null && (e = a.match(/m=video.*\n/));
            if (e && e.length > 0) {
                c = e[0] + "b=AS:" + b.maxVideoBW + "\r\n";
                a = a.replace(e[0], c)
            }
        }
        if (b.maxAudioBW) {
            e = a.match(/m=audio.*\r\n/);
            e == null && (e = a.match(/m=audio.*\n/));
            if (e && e.length > 0) {
                c = e[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                a = a.replace(e[0], c)
            }
        }
        return a
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    b.localCandidates = [];
    a.peerConnection.onicecandidate =
        function(d) {
            if (d.candidate) {
                if (!d.candidate.candidate.match(/a=/)) d.candidate.candidate = "a=" + d.candidate.candidate;
                b.remoteDescriptionSet ? b.callback({
                    type: "candidate",
                    candidate: d.candidate
                }) : b.localCandidates.push(d.candidate)
            } else console.log("End of candidates.", a.peerConnection.localDescription)
        };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    var e = function(a) {
            console.log("Error in Stack ",
                a)
        },
        i, h = function(d) {
            d.sdp = f(d.sdp);
            console.log("Set local description", d.sdp);
            i = d;
            a.peerConnection.setLocalDescription(i, function() {
                console.log("The final LocalDesc", a.peerConnection.localDescription);
                b.callback(a.peerConnection.localDescription)
            }, e)
        },
        j = function(d) {
            d.sdp = f(d.sdp);
            b.callback(d);
            i = d;
            a.peerConnection.setLocalDescription(d)
        };
    a.createOffer = function(b) {
        b === true ? a.peerConnection.createOffer(h, e, a.mediaConstraints) : a.peerConnection.createOffer(h, e)
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    a.processSignalingMessage = function(d) {
        console.log("Process Signaling Message", d);
        if (d.type === "offer") {
            d.sdp = f(d.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(d));
            a.peerConnection.createAnswer(j, null, a.mediaConstraints);
            b.remoteDescriptionSet = true
        } else if (d.type === "answer") {
            console.log("Set remote description", d.sdp);
            d.sdp = f(d.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(d), function() {
                b.remoteDescriptionSet = true;
                for (console.log("Candidates to be added: ",
                        b.remoteCandidates.length); b.remoteCandidates.length > 0;) {
                    console.log("Candidate :", b.remoteCandidates[b.remoteCandidates.length - 1]);
                    a.peerConnection.addIceCandidate(b.remoteCandidates.shift(), function() {}, e)
                }
                for (; b.localCandidates.length > 0;) b.callback({
                    type: "candidate",
                    candidate: b.localCandidates.shift()
                })
            }, function() {
                console.log("Error Setting Remote Description")
            })
        } else if (d.type === "candidate") {
            console.log("Message with candidate");
            try {
                var c;
                c = typeof d.candidate === "object" ? d.candidate : JSON.parse(d.candidate);
                c.candidate = c.candidate.replace(/a=/g, "");
                c.sdpMLineIndex = parseInt(c.sdpMLineIndex);
                c.sdpMLineIndex = c.sdpMid === "audio" ? 0 : 1;
                var g = new RTCIceCandidate(c);
                console.log("Remote Candidate", g);
                b.remoteDescriptionSet ? a.peerConnection.addIceCandidate(g, function() {}, e) : b.remoteCandidates.push(g)
            } catch (m) {
                L.Logger.error("Error parsing candidate", d.candidate)
            }
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.FirefoxStack = function(b) {
    var a = {},
        c = mozRTCSessionDescription,
        f = mozRTCIceCandidate;
    a.pcConfig = {
        iceServers: []
    };
    void 0 !== b.iceServers && (a.pcConfig.iceServers = b.iceServers);
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {
        offerToReceiveAudio: b.audio,
        offerToReceiveVideo: b.video,
        mozDontOfferDataChannel: !0
    };
    var e = function(a) {
            L.Logger.error("Error in Stack ", a)
        },
        i = !1;
    a.peerConnection = new mozRTCPeerConnection(a.pcConfig, a.con);
    b.localCandidates = [];
    a.peerConnection.onicecandidate = function(a) {
        var d = {};
        if (a.candidate) {
            i = true;
            if (!a.candidate.candidate.match(/a=/)) a.candidate.candidate = "a=" + a.candidate.candidate;
            d = a.candidate;
            if (b.remoteDescriptionSet) b.callback({
                type: "candidate",
                candidate: d
            });
            else {
                b.localCandidates.push(d);
                L.Logger.debug("Local Candidates stored: ", b.localCandidates.length, b.localCandidates)
            }
        } else L.Logger.info("Gathered all candidates. Sending END candidate")
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.target.iceConnectionState)
    };
    var h = function(a) {
            var d, e;
            if (b.video && b.maxVideoBW) {
                a = a.replace(/b=AS:.*\r\n/g, "");
                e = a.match(/m=video.*\r\n/);
                e == null && (e = a.match(/m=video.*\n/));
                if (e && e.length > 0) {
                    d = e[0] + "b=AS:" + b.maxVideoBW + "\r\n";
                    a = a.replace(e[0], d)
                }
            }
            if (b.audio && b.maxAudioBW) {
                e = a.match(/m=audio.*\r\n/);
                e == null && (e = a.match(/m=audio.*\n/));
                if (e && e.length > 0) {
                    d = e[0] + "b=AS:" + b.maxAudioBW +
                        "\r\n";
                    a = a.replace(e[0], d)
                }
            }
            return a
        },
        j, d = function(a) {
            a.sdp = h(a.sdp);
            a.sdp = a.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
            b.callback(a);
            j = a
        },
        k = function(d) {
            d.sdp = h(d.sdp);
            d.sdp = d.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
            b.callback(d);
            j = d;
            a.peerConnection.setLocalDescription(j)
        };
    a.updateSpec = function(a) {
        if (a.maxVideoBW || a.maxAudioBW) {
            if (a.maxVideoBW) {
                L.Logger.debug("Maxvideo Requested", a.maxVideoBW, "limit", b.limitMaxVideoBW);
                if (a.maxVideoBW > b.limitMaxVideoBW) a.maxVideoBW = b.limitMaxVideoBW;
                b.maxVideoBW = a.maxVideoBW;
                L.Logger.debug("Result", b.maxVideoBW)
            }
            if (a.maxAudioBW) {
                if (a.maxAudioBW > b.limitMaxAudioBW) a.maxAudioBW = b.limitMaxAudioBW;
                b.maxAudioBW = a.maxAudioBW
            }
            j.sdp = h(j.sdp);
            if (a.Sdp) L.Logger.error("Cannot update with renegotiation in Firefox, try without renegotiation");
            else {
                L.Logger.debug("Updating without renegotiation, newVideoBW:", b.maxVideoBW, ", newAudioBW:", b.maxAudioBW);
                b.callback({
                    type: "updatestream",
                    sdp: j.sdp
                })
            }
        }
        if (a.minVideoBW || a.slideShowMode !== void 0 || a.muteStream !== void 0) {
            L.Logger.debug("MinVideo Changed to ",
                a.minVideoBW);
            L.Logger.debug("SlideShowMode Changed to ", a.slideShowMode);
            L.Logger.debug("muteStream changed to ", a.muteStream);
            b.callback({
                type: "updatestream",
                config: a
            })
        }
    };
    a.createOffer = function(b) {
        b === true ? a.peerConnection.createOffer(d, e, a.mediaConstraints) : a.peerConnection.createOffer(d, e)
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    b.remoteDescriptionSet = !1;
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.processSignalingMessage = function(d) {
        if (d.type ===
            "offer") {
            d.sdp = h(d.sdp);
            a.peerConnection.setRemoteDescription(new c(d), function() {
                a.peerConnection.createAnswer(k, function(a) {
                    L.Logger.error("Error", a)
                }, a.mediaConstraints);
                b.remoteDescriptionSet = true
            }, function(a) {
                L.Logger.error("Error setting Remote Description", a)
            })
        } else if (d.type === "answer") {
            L.Logger.info("Set remote and local description");
            L.Logger.debug("Local Description to set", j.sdp);
            L.Logger.debug("Remote Description to set", d.sdp);
            d.sdp = h(d.sdp);
            a.peerConnection.setLocalDescription(j, function() {
                a.peerConnection.setRemoteDescription(new c(d),
                    function() {
                        b.remoteDescriptionSet = true;
                        for (L.Logger.info("Remote Description successfully set"); b.remoteCandidates.length > 0 && i;) {
                            L.Logger.info("Setting stored remote candidates");
                            a.peerConnection.addIceCandidate(b.remoteCandidates.shift())
                        }
                        for (; b.localCandidates.length > 0;) {
                            L.Logger.info("Sending Candidate from list");
                            b.callback({
                                type: "candidate",
                                candidate: b.localCandidates.shift()
                            })
                        }
                    },
                    function(a) {
                        L.Logger.error("Error Setting Remote Description", a)
                    })
            }, function(a) {
                L.Logger.error("Failure setting Local Description",
                    a)
            })
        } else if (d.type === "candidate") try {
            var e;
            e = typeof d.candidate === "object" ? d.candidate : JSON.parse(d.candidate);
            e.candidate = e.candidate.replace(/ generation 0/g, "");
            e.candidate = e.candidate.replace(/ udp /g, " UDP ");
            e.sdpMLineIndex = parseInt(e.sdpMLineIndex);
            var n = new f(e);
            if (b.remoteDescriptionSet && i)
                for (a.peerConnection.addIceCandidate(n); b.remoteCandidates.length > 0;) {
                    L.Logger.info("Setting stored remote candidates");
                    a.peerConnection.addIceCandidate(b.remoteCandidates.shift())
                } else b.remoteCandidates.push(n)
        } catch (s) {
            L.Logger.error("Error parsing candidate",
                d.candidate, s)
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.ChromeStableStack = function(b) {
    var a = {
        pcConfig: {
            iceServers: []
        },
        con: {
            optional: [{
                DtlsSrtpKeyAgreement: !0
            }]
        }
    };
    void 0 !== b.iceServers && (a.pcConfig.iceServers = b.iceServers);
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: b.video,
            OfferToReceiveAudio: b.audio
        }
    };
    var c = function(a) {
        L.Logger.error("Error in Stack ", a)
    };
    a.peerConnection = new webkitRTCPeerConnection(a.pcConfig, a.con);
    var f = function(a) {
        var e, c;
        if (b.video && b.maxVideoBW) {
            a = a.replace(/b=AS:.*\r\n/g,
                "");
            c = a.match(/m=video.*\r\n/);
            c == null && (c = a.match(/m=video.*\n/));
            if (c && c.length > 0) {
                e = c[0] + "b=AS:" + b.maxVideoBW + "\r\n";
                a = a.replace(c[0], e)
            }
        }
        if (b.audio && b.maxAudioBW) {
            c = a.match(/m=audio.*\r\n/);
            c == null && (c = a.match(/m=audio.*\n/));
            if (c && c.length > 0) {
                e = c[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                a = a.replace(c[0], e)
            }
        }
        return a
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    b.localCandidates = [];
    a.peerConnection.onicecandidate = function(a) {
        var e = {};
        if (a.candidate) {
            if (!a.candidate.candidate.match(/a=/)) a.candidate.candidate =
                "a=" + a.candidate.candidate;
            e = {
                sdpMLineIndex: a.candidate.sdpMLineIndex,
                sdpMid: a.candidate.sdpMid,
                candidate: a.candidate.candidate
            }
        } else {
            L.Logger.info("Gathered all candidates. Sending END candidate");
            e = {
                sdpMLineIndex: -1,
                sdpMid: "end",
                candidate: "end"
            }
        }
        if (b.remoteDescriptionSet) b.callback({
            type: "candidate",
            candidate: e
        });
        else {
            b.localCandidates.push(e);
            L.Logger.info("Storing candidate: ", b.localCandidates.length, e)
        }
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream =
        function(b) {
            if (a.onremovestream) a.onremovestream(b)
        };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.target.iceConnectionState)
    };
    var e, i, h = function(a) {
            a.sdp = f(a.sdp);
            var c = a.sdp,
                g;
            g = c.match(/a=rtpmap:(.*)opus.*\r\n/);
            g !== null && (c = c.replace(g[0], g[0] + "a=rtcp-fb:" + g[1] + "nack\r\n"));
            a.sdp = c;
            a.sdp = a.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
            b.callback({
                type: a.type,
                sdp: a.sdp
            });
            e = a
        },
        j = function(d) {
            d.sdp = f(d.sdp);
            b.callback({
                type: d.type,
                sdp: d.sdp
            });
            e = d;
            a.peerConnection.setLocalDescription(d)
        };
    a.updateSpec = function(d, c) {
        if (d.maxVideoBW || d.maxAudioBW) {
            if (d.maxVideoBW) {
                L.Logger.debug("Maxvideo Requested:", d.maxVideoBW, "limit:", b.limitMaxVideoBW);
                if (d.maxVideoBW > b.limitMaxVideoBW) d.maxVideoBW = b.limitMaxVideoBW;
                b.maxVideoBW = d.maxVideoBW;
                L.Logger.debug("Result", b.maxVideoBW)
            }
            if (d.maxAudioBW) {
                if (d.maxAudioBW > b.limitMaxAudioBW) d.maxAudioBW = b.limitMaxAudioBW;
                b.maxAudioBW = d.maxAudioBW
            }
            e.sdp = f(e.sdp);
            if (d.Sdp || d.maxAudioBW) {
                L.Logger.debug("Updating with SDP renegotiation",
                    b.maxVideoBW);
                a.peerConnection.setLocalDescription(e, function() {
                    i.sdp = f(i.sdp);
                    a.peerConnection.setRemoteDescription(new RTCSessionDescription(i), function() {
                        b.remoteDescriptionSet = true;
                        b.callback({
                            type: "updatestream",
                            sdp: e.sdp
                        })
                    })
                }, function(a) {
                    L.Logger.error("Error updating configuration", a);
                    c("error")
                })
            } else {
                L.Logger.debug("Updating without SDP renegotiation, newVideoBW:", b.maxVideoBW, "newAudioBW:", b.maxAudioBW);
                b.callback({
                    type: "updatestream",
                    sdp: e.sdp
                })
            }
        }
        if (d.minVideoBW || d.slideShowMode !== void 0 ||
            d.muteStream !== void 0) {
            L.Logger.debug("MinVideo Changed to ", d.minVideoBW);
            L.Logger.debug("SlideShowMode Changed to ", d.slideShowMode);
            L.Logger.debug("muteStream changed to ", d.muteStream);
            b.callback({
                type: "updatestream",
                config: d
            })
        }
    };
    a.createOffer = function(b) {
        b === true ? a.peerConnection.createOffer(h, c, a.mediaConstraints) : a.peerConnection.createOffer(h, c)
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    b.remoteDescriptionSet = !1;
    a.processSignalingMessage = function(d) {
        if (d.type ===
            "offer") {
            d.sdp = f(d.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(d), function() {
                a.peerConnection.createAnswer(j, function(a) {
                    L.Logger.error("Error: ", a)
                }, a.mediaConstraints);
                b.remoteDescriptionSet = true
            }, function(a) {
                L.Logger.error("Error setting Remote Description", a)
            })
        } else if (d.type === "answer") {
            L.Logger.info("Set remote and local description");
            L.Logger.debug("Remote Description", d.sdp);
            L.Logger.debug("Local Description", e.sdp);
            d.sdp = f(d.sdp);
            i = d;
            a.peerConnection.setLocalDescription(e,
                function() {
                    a.peerConnection.setRemoteDescription(new RTCSessionDescription(d), function() {
                        b.remoteDescriptionSet = true;
                        for (L.Logger.info("Candidates to be added: ", b.remoteCandidates.length, b.remoteCandidates); b.remoteCandidates.length > 0;) a.peerConnection.addIceCandidate(b.remoteCandidates.shift());
                        for (L.Logger.info("Local candidates to send:", b.localCandidates.length); b.localCandidates.length > 0;) b.callback({
                            type: "candidate",
                            candidate: b.localCandidates.shift()
                        })
                    })
                })
        } else if (d.type === "candidate") try {
            var c;
            c = typeof d.candidate === "object" ? d.candidate : JSON.parse(d.candidate);
            c.candidate = c.candidate.replace(/a=/g, "");
            c.sdpMLineIndex = parseInt(c.sdpMLineIndex);
            var g = new RTCIceCandidate(c);
            b.remoteDescriptionSet ? a.peerConnection.addIceCandidate(g) : b.remoteCandidates.push(g)
        } catch (h) {
            L.Logger.error("Error parsing candidate", d.candidate)
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.ChromeCanaryStack = function(b) {
    var a = {},
        c = webkitRTCPeerConnection;
    a.pcConfig = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    void 0 !== b.stunServerUrl && a.pcConfig.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pcConfig.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    if (void 0 === b.audio || b.nop2p) b.audio = !0;
    if (void 0 === b.video || b.nop2p) b.video = !0;
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: b.video,
            OfferToReceiveAudio: b.audio
        }
    };
    a.roapSessionId = 103;
    a.peerConnection = new c(a.pcConfig, a.con);
    a.peerConnection.onicecandidate = function(e) {
        L.Logger.debug("PeerConnection: ", b.sessionId);
        if (e.candidate) a.iceCandidateCount += 1;
        else if (L.Logger.debug("State: " + a.peerConnection.iceGatheringState), void 0 === a.ices && (a.ices = 0), a.ices += 1, 1 <= a.ices && a.moreIceComing) a.moreIceComing = !1, a.markActionNeeded()
    };
    var f = function(a) {
        var c, f;
        if (b.maxVideoBW && (f = a.match(/m=video.*\r\n/)) && 0 < f.length) c = f[0] + "b=AS:" + b.maxVideoBW + "\r\n", a = a.replace(f[0],
            c);
        if (b.maxAudioBW && (f = a.match(/m=audio.*\r\n/)) && 0 < f.length) c = f[0] + "b=AS:" + b.maxAudioBW + "\r\n", a = a.replace(f[0], c);
        return a
    };
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        "new" === a.state ? "OFFER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "offer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " +
                a.state) : "offer-sent" === a.state ? "ANSWER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "answer"
            }, L.Logger.debug("Received ANSWER: ", b.sdp), b.sdp = f(b.sdp), a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.sendOK(), a.state = "established") : "pr-answer" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "pr-answer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b))) : "offer" === b.messageType ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state) :
            "established" === a.state && ("OFFER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "offer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state))
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = !0;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if ("new" === a.state || "established" === a.state) a.peerConnection.createOffer(function(b) {
                b.sdp = f(b.sdp);
                L.Logger.debug("Changed", b.sdp);
                b.sdp !== a.prevOffer ? (a.peerConnection.setLocalDescription(b), a.state = "preparing-offer", a.markActionNeeded()) : L.Logger.debug("Not sending a new offer")
            }, null, a.mediaConstraints);
            else if ("preparing-offer" === a.state) {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: " + a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if ("offer-received" === a.state) a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                a.iceStarted ? a.markActionNeeded() : (L.Logger.debug((new Date).getTime() + ": Starting ICE in responder"), a.iceStarted = !0)
            }, null, a.mediaConstraints);
            else if ("offer-received-preparing-answer" === a.state) {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = !1
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, c) {
        var f = {};
        f.messageType = b;
        f.sdp = c;
        "OFFER" === b ? (f.offererSessionId = a.sessionId, f.answererSessionId = a.otherSessionId, f.seq = a.sequenceNumber += 1, f.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (f.offererSessionId = a.incomingMessage.offererSessionId, f.answererSessionId =
            a.sessionId, f.seq = a.incomingMessage.seq);
        a.onsignalingmessage(JSON.stringify(f))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = b.callback;
    a.peerConnection.onopen = function() {
        if (a.onopen) a.onopen()
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
    };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
Erizo = Erizo || {};
Erizo.sessionId = 103;
Erizo.Connection = function(b) {
    var a = {};
    b.sessionId = Erizo.sessionId += 1;
    a.browser = Erizo.getBrowser();
    if ("fake" === a.browser) L.Logger.warning("Publish/subscribe video/audio streams not supported in erizofc yet"), a = Erizo.FcStack(b);
    else if ("mozilla" === a.browser) L.Logger.debug("Firefox Stack"), a = Erizo.FirefoxStack(b);
    else if ("bowser" === a.browser) L.Logger.debug("Bowser Stack"), a = Erizo.BowserStack(b);
    else if ("chrome-stable" === a.browser) L.Logger.debug("Chrome Stable Stack"), a = Erizo.ChromeStableStack(b);
    else throw L.Logger.error("No stack available for this browser"),
        "WebRTC stack not available";
    a.updateSpec || (a.updateSpec = function(a, b) {
        L.Logger.error("Update Configuration not implemented in this browser");
        b && b("unimplemented")
    });
    return a
};
Erizo.getBrowser = function() {
    var b = "none";
    "undefined" !== typeof module && module.exports ? b = "fake" : null !== window.navigator.userAgent.match("Firefox") ? b = "mozilla" : null !== window.navigator.userAgent.match("Bowser") ? b = "bowser" : null !== window.navigator.userAgent.match("Chrome") ? 26 <= window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] && (b = "chrome-stable") : null !== window.navigator.userAgent.match("Safari") ? b = "bowser" : null !== window.navigator.userAgent.match("AppleWebKit") && (b = "bowser");
    return b
};
Erizo.GetUserMedia = function(b, a, c) {
    var f;
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (b.screen) switch (L.Logger.debug("Screen access requested"), Erizo.getBrowser()) {
            case "mozilla":
                L.Logger.debug("Screen sharing in Firefox");
                f = {};
                void 0 !== b.video.mandatory ? (f.video = b.video, f.video.mediaSource = "window") : f = {
                    audio: b.audio,
                    video: {
                        mediaSource: "window"
                    }
                };
                navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? (f = navigator.mediaDevices.getUserMedia(f).then(a),
                    f["catch"](c)) : navigator.getMedia(f, a, c);
                break;
            case "chrome-stable":
                L.Logger.debug("Screen sharing in Chrome");
                //f = "okeephmleflklcdebijnponpabbmmgeo";
                f = "ealmfibiaadgogdlcmfamlfanbiephdj";
                b.extensionId && (L.Logger.debug("extensionId supplied, using " + b.extensionId), f = b.extensionId);
                L.Logger.debug("Screen access on chrome stable, looking for extension");
                try {
                    console.log("extensionID: ",f);
                    chrome.runtime.sendMessage(f, {
                        getStream: !0
                    }, function(e) {
                        var f = {};
                        if (e === void 0) {
                            L.Logger.error("Access to screen denied");
                            c({
                                code: "Access to screen denied"
                            })
                        } else {
                            e = e.streamId;
                            if (b.video.mandatory !==
                                void 0) {
                                f.video = b.video;
                                f.video.mandatory.chromeMediaSource = "desktop";
                                f.video.mandatory.chromeMediaSourceId = e
                            } else f = {
                                video: {
                                    mandatory: {
                                        chromeMediaSource: "desktop",
                                        chromeMediaSourceId: e
                                    }
                                }
                            };
                            navigator.getMedia(f, a, c)
                        }
                    })
                } catch (e) {
                    L.Logger.debug("Screensharing plugin is not accessible ");
                    c({
                        code: "no_plugin_present"
                    });
                    break
                }
                break;
            default:
                L.Logger.error("This browser does not support ScreenSharing")
        } else if ("undefined" !== typeof module && module.exports) L.Logger.error("Video/audio streams not supported in erizofc yet");
        else {
            if (b.video && "mozilla" === Erizo.getBrowser() && (void 0 !== b.video.mandatory && (f = b.video.mandatory, b.video = {
                    width: {
                        min: f.minWidth,
                        max: f.maxWidth
                    },
                    height: {
                        min: f.minHeight,
                        max: f.maxHeight
                    }
                }), navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                f = navigator.mediaDevices.getUserMedia(b).then(a);
                f["catch"](c);
                return
            }
            navigator.getMedia(b, a, c)
        }
};
Erizo = Erizo || {};
Erizo.Stream = function(b) {
    var a = Erizo.EventDispatcher(b),
        c;
    a.stream = b.stream;
    a.url = b.url;
    a.recording = b.recording;
    a.room = void 0;
    a.showing = !1;
    a.local = !1;
    a.video = b.video;
    a.audio = b.audio;
    a.screen = b.screen;
    a.videoSize = b.videoSize;
    a.extensionId = b.extensionId;
    if (void 0 !== a.videoSize && (!(a.videoSize instanceof Array) || 4 !== a.videoSize.length)) throw Error("Invalid Video Size");
    if (void 0 === b.local || !0 === b.local) a.local = !0;
    a.getID = function() {
        return a.local && !b.streamID ? "local" : b.streamID
    };
    a.getAttributes = function() {
        return b.attributes
    };
    a.setAttributes = function() {
        L.Logger.error("Failed to set attributes data. This Stream object has not been published.")
    };
    a.updateLocalAttributes = function(a) {
        b.attributes = a
    };
    a.hasAudio = function() {
        return b.audio
    };
    a.hasVideo = function() {
        return b.video
    };
    a.hasData = function() {
        return b.data
    };
    a.hasScreen = function() {
        return b.screen
    };
    a.sendData = function() {
        L.Logger.error("Failed to send data. This Stream object has not that channel enabled.")
    };
    a.init = function() {
        var c;
        try {
            if ((b.audio || b.video || b.screen) && void 0 ===
                b.url) {
                L.Logger.info("Requested access to local media");
                var e = b.video;
                (!0 === e || !0 === b.screen) && void 0 !== a.videoSize ? e = {
                    mandatory: {
                        minWidth: a.videoSize[0],
                        minHeight: a.videoSize[1],
                        maxWidth: a.videoSize[2],
                        maxHeight: a.videoSize[3]
                    }
                } : !0 === b.screen && void 0 === e && (e = !0);
                var i = {
                    video: e,
                    audio: b.audio,
                    fake: b.fake,
                    screen: b.screen,
                    extensionId: a.extensionId
                };
                L.Logger.debug(i);
                Erizo.GetUserMedia(i, function(b) {
                    L.Logger.info("User has granted access to local media.");
                    a.stream = b;
                    c = Erizo.StreamEvent({
                        type: "access-accepted"
                    });
                    a.dispatchEvent(c)
                }, function(b) {
                    L.Logger.error("Failed to get access to local media. Error code was " + b.code + ".");
                    b = Erizo.StreamEvent({
                        type: "access-denied",
                        msg: b
                    });
                    a.dispatchEvent(b)
                })
            } else c = Erizo.StreamEvent({
                type: "access-accepted"
            }), a.dispatchEvent(c)
        } catch (h) {
            L.Logger.error("Failed to get access to local media. Error was " + h + "."), c = Erizo.StreamEvent({
                type: "access-denied",
                msg: h
            }), a.dispatchEvent(c)
        }
    };
    a.close = function() {
        a.local && (void 0 !== a.room && a.room.unpublish(a), a.hide(), void 0 !== a.stream &&
            a.stream.getTracks().forEach(function(a) {
                a.stop()
            }), a.stream = void 0)
    };
    a.play = function(b, e) {
        e = e || {};
        a.elementID = b;
        var c;
        a.hasVideo() || this.hasScreen() ? void 0 !== b && (c = new Erizo.VideoPlayer({
            id: a.getID(),
            stream: a,
            elementID: b,
            options: e
        }), a.player = c, a.showing = !0) : a.hasAudio && (c = new Erizo.AudioPlayer({
            id: a.getID(),
            stream: a,
            elementID: b,
            options: e
        }), a.player = c, a.showing = !0)
    };
    a.stop = function() {
        a.showing && void 0 !== a.player && (a.player.destroy(), a.showing = !1)
    };
    a.show = a.play;
    a.hide = a.stop;
    c = function() {
        if (void 0 !==
            a.player && void 0 !== a.stream) {
            var b = a.player.video,
                e = document.defaultView.getComputedStyle(b),
                c = parseInt(e.getPropertyValue("width"), 10),
                h = parseInt(e.getPropertyValue("height"), 10),
                j = parseInt(e.getPropertyValue("left"), 10),
                e = parseInt(e.getPropertyValue("top"), 10),
                d;
            d = "object" === typeof a.elementID && "function" === typeof a.elementID.appendChild ? a.elementID : document.getElementById(a.elementID);
            var k = document.defaultView.getComputedStyle(d);
            d = parseInt(k.getPropertyValue("width"), 10);
            var k = parseInt(k.getPropertyValue("height"),
                    10),
                g = document.createElement("canvas");
            g.id = "testing";
            g.width = d;
            g.height = k;
            g.setAttribute("style", "display: none");
            g.getContext("2d").drawImage(b, j, e, c, h);
            return g
        }
        return null
    };
    a.getVideoFrameURL = function(a) {
        var b = c();
        return null !== b ? a ? b.toDataURL(a) : b.toDataURL() : null
    };
    a.getVideoFrame = function() {
        var a = c();
        return null !== a ? a.getContext("2d").getImageData(0, 0, a.width, a.height) : null
    };
    a.checkOptions = function(b, e) {
        if (!0 === e) {
            if (b.video || b.audio || b.screen) L.Logger.warning("Cannot update type of subscription"),
                b.video = void 0, b.audio = void 0, b.screen = void 0
        } else if (!1 === a.local && (!0 === b.video && !1 === a.hasVideo() && (L.Logger.warning("Trying to subscribe to video when there is no video, won't subscribe to video"), b.video = !1), !0 === b.audio && !1 === a.hasAudio())) L.Logger.warning("Trying to subscribe to audio when there is no audio, won't subscribe to audio"), b.audio = !1;
        !1 === a.local && !a.hasVideo() && !0 === b.slideShowMode && (L.Logger.warning("Cannot enable slideShowMode if it is not a video subscription, please check your parameters"),
            b.slideShowMode = !1)
    };
    a.muteAudio = function(b, e) {
        if (a.room && a.room.p2p) L.Logger.warning("muteAudio is not implemented in p2p streams"), e("error");
        else if (a.local) L.Logger.warning("muteAudio can only be used in remote streams"), e("Error");
        else {
            var c = {
                muteStream: {
                    audio: b
                }
            };
            a.checkOptions(c, !0);
            a.pc.updateSpec(c, e)
        }
    };
    a.updateConfiguration = function(b, e) {
        if (void 0 !== b)
            if (a.pc)
                if (a.checkOptions(b, !0), a.local)
                    if (a.room.p2p)
                        for (var c in a.pc) a.pc[c].updateSpec(b, e);
                    else a.pc.updateSpec(b, e);
        else a.pc.updateSpec(b,
            e);
        else e("This stream has no peerConnection attached, ignoring")
    };
    return a
};
Erizo = Erizo || {};
Erizo.Room = function(b) {
    var a = Erizo.EventDispatcher(b),
        c, f, e, i, h, j;
    a.remoteStreams = {};
    a.localStreams = {};
    a.roomID = "";
    a.socket = {};
    a.state = 0;
    a.p2p = !1;
    a.addEventListener("room-disconnected", function() {
        var b, e;
        a.state = 0;
        for (b in a.remoteStreams) a.remoteStreams.hasOwnProperty(b) && (e = a.remoteStreams[b], j(e), delete a.remoteStreams[b], e && !e.failed && (e = Erizo.StreamEvent({
            type: "stream-removed",
            stream: e
        }), a.dispatchEvent(e)));
        a.remoteStreams = {};
        for (b in a.localStreams)
            if (a.localStreams.hasOwnProperty(b)) {
                e = a.localStreams[b];
                if (a.p2p)
                    for (var c in e.pc) e.pc[c].close();
                else e.pc.close();
                delete a.localStreams[b]
            }
        try {
            a.socket.disconnect()
        } catch (f) {
            L.Logger.debug("Socket already disconnected")
        }
        a.socket = void 0
    });
    j = function(a) {
        void 0 !== a.stream && (a.hide(), a.pc && a.pc.close(), a.local && a.stream.stop(), delete a.stream)
    };
    i = function(a, b) {
        a.local ? f("sendDataStream", {
            id: a.getID(),
            msg: b
        }) : L.Logger.error("You can not send data through a remote stream")
    };
    h = function(a, b) {
        a.local ? (a.updateLocalAttributes(b), f("updateStreamAttributes", {
            id: a.getID(),
            attrs: b
        })) : L.Logger.error("You can not update attributes in a remote stream")
    };
    c = function(d, c, g) {
        var m = function(d, c) {
            d.pc = Erizo.Connection({
                callback: function(a) {
                    e("signaling_message", {
                        streamId: d.getID(),
                        peerSocket: c,
                        msg: a
                    })
                },
                iceServers: a.iceServers,
                maxAudioBW: b.maxAudioBW,
                maxVideoBW: b.maxVideoBW,
                limitMaxAudioBW: b.maxAudioBW,
                limitMaxVideoBW: b.maxVideoBW
            });
            d.pc.onaddstream = function(b) {
                L.Logger.info("Stream subscribed");
                d.stream = b.stream;
                b = Erizo.StreamEvent({
                    type: "stream-subscribed",
                    stream: d
                });
                a.dispatchEvent(b)
            }
        };
        a.socket = io.connect(d.host, {
            reconnect: !1,
            secure: d.secure,
            "force new connection": !0,
            transports: ["websocket","polling"]
        });
        
        a.socket.on("onAddStream", function(b) {
            var d = Erizo.Stream({
                streamID: b.id,
                local: !1,
                audio: b.audio,
                video: b.video,
                data: b.data,
                screen: b.screen,
                attributes: b.attributes
            });
            a.remoteStreams[b.id] = d;
            b = Erizo.StreamEvent({
                type: "stream-added",
                stream: d
            });
            a.dispatchEvent(b)
        });
        a.socket.on("signaling_message_erizo", function(b) {
            var d;
            (d = b.peerId ? a.remoteStreams[b.peerId] : a.localStreams[b.streamId]) && !d.failed &&
                d.pc.processSignalingMessage(b.mess)
        });
        a.socket.on("signaling_message_peer", function(b) {
            var d = a.localStreams[b.streamId];
            d && !d.failed ? d.pc[b.peerSocket].processSignalingMessage(b.msg) : (d = a.remoteStreams[b.streamId], d.pc || m(d, b.peerSocket), d.pc.processSignalingMessage(b.msg))
        });
        a.socket.on("publish_me", function(b) {
            var d = a.localStreams[b.streamId];
            void 0 === d.pc && (d.pc = {});
            d.pc[b.peerSocket] = Erizo.Connection({
                callback: function(a) {
                    e("signaling_message", {
                        streamId: b.streamId,
                        peerSocket: b.peerSocket,
                        msg: a
                    })
                },
                audio: d.hasAudio(),
                video: d.hasVideo(),
                iceServers: a.iceServers
            });
            d.pc[b.peerSocket].oniceconnectionstatechange = function(a) {
                if (a === "failed") {
                    d.pc[b.peerSocket].close();
                    delete d.pc[b.peerSocket]
                }
            };
            d.pc[b.peerSocket].addStream(d.stream);
            d.pc[b.peerSocket].createOffer()
        });
        a.socket.on("onBandwidthAlert", function(b) {
            L.Logger.info("Bandwidth Alert on", b.streamID, "message", b.message, "BW:", b.bandwidth);
            if (b.streamID) {
                var d = a.remoteStreams[b.streamID];
                d && !d.failed && (b = Erizo.StreamEvent({
                    type: "bandwidth-alert",
                    stream: d,
                    msg: b.message,
                    bandwidth: b.bandwidth
                }), d.dispatchEvent(b))
            }
        });
        a.socket.on("onDataStream", function(b) {
            var d = a.remoteStreams[b.id],
                b = Erizo.StreamEvent({
                    type: "stream-data",
                    msg: b.msg,
                    stream: d
                });
            d.dispatchEvent(b)
        });
        a.socket.on("onUpdateAttributeStream", function(b) {
            var d = a.remoteStreams[b.id],
                e = Erizo.StreamEvent({
                    type: "stream-attributes-update",
                    attrs: b.attrs,
                    stream: d
                });
            d.updateLocalAttributes(b.attrs);
            d.dispatchEvent(e)
        });
        a.socket.on("onRemoveStream", function(b) {
            var d = a.localStreams[b.id];
            d && !d.failed ?
                (d.failed = !0, L.Logger.warning("We received a removeStream from our own stream -- probably erizoJS timed out"), b = Erizo.StreamEvent({
                    type: "stream-failed",
                    msg: "Publishing local stream failed because of an Erizo Error",
                    stream: d
                }), a.dispatchEvent(b), a.unpublish(d)) : (d = a.remoteStreams[b.id]) && d.failed ? L.Logger.debug("Received onRemoveStream for a stream that we already marked as failed ", b.id) : d ? (delete a.remoteStreams[b.id], j(d), d = Erizo.StreamEvent({
                    type: "stream-removed",
                    stream: d
                }), a.dispatchEvent(d)) :
                L.Logger.debug("Received a removeStream for", b.id, "and it has not been registered here, ignoring.")
        });
        a.socket.on("disconnect", function() {
            L.Logger.info("Socket disconnected, lost connection to ErizoController");
            if (0 !== a.state) {
                L.Logger.error("Unexpected disconnection from ErizoController");
                var b = Erizo.RoomEvent({
                    type: "room-disconnected",
                    message: "unexpected-disconnection"
                });
                a.dispatchEvent(b)
            }
        });
        a.socket.on("connection_failed", function(b) {
            var d;
            if ("publish" === b.type) {
                if (L.Logger.error("ICE Connection Failed on publishing stream",
                        b.streamId, a.state), 0 !== a.state && b.streamId && (b = a.localStreams[b.streamId]) && !b.failed) b.failed = !0, d = Erizo.StreamEvent({
                    type: "stream-failed",
                    msg: "Publishing local stream failed ICE Checks",
                    stream: b
                }), a.dispatchEvent(d), a.unpublish(b)
            } else if (L.Logger.error("ICE Connection Failed on subscribe stream", b.streamId), 0 !== a.state && b.streamId && (b = a.remoteStreams[b.streamId]) && !b.failed) b.failed = !0, d = Erizo.StreamEvent({
                    type: "stream-failed",
                    msg: "Subscriber failed ICE, cannot reach Licode for media",
                    stream: b
                }),
                a.dispatchEvent(d), a.unsubscribe(b)
        });
        a.socket.on("error", function(a) {
            L.Logger.error("Cannot connect to erizo Controller");
            g && g("Cannot connect to ErizoController (socket.io error)", a)
        });
        f("token", d, c, g)
    };
    f = function(b, e, c, f) {
        a.socket.emit(b, e, function(a, b) {
            "success" === a ? c && c(b) : "error" === a ? f && f(b) : c && c(a, b)
        })
    };
    e = function(b, e, c, f) {
        0 !== a.state ? a.socket.emit(b, e, c, function(a, b) {
            f && f(a, b)
        }) : L.Logger.warning("Trying to send a message over a disconnected Socket")
    };
    a.connect = function() {
        var d = L.Base64.decodeBase64(b.token);
        0 !== a.state && L.Logger.warning("Room already connected");
        a.state = 1;
        c(JSON.parse(d), function(d) {
            var e = 0,
                c = [],
                f, h, i;
            f = d.streams || [];
            a.p2p = d.p2p;
            h = d.id;
            a.iceServers = d.iceServers;
            a.state = 2;
            b.defaultVideoBW = d.defaultVideoBW;
            b.maxVideoBW = d.maxVideoBW;
            for (e in f) f.hasOwnProperty(e) && (i = f[e], d = Erizo.Stream({
                streamID: i.id,
                local: !1,
                audio: i.audio,
                video: i.video,
                data: i.data,
                screen: i.screen,
                attributes: i.attributes
            }), c.push(d), a.remoteStreams[i.id] = d);
            a.roomID = h;
            L.Logger.info("Connected to room " + a.roomID);
            e = Erizo.RoomEvent({
                type: "room-connected",
                streams: c
            });
            a.dispatchEvent(e)
        }, function(b) {
            L.Logger.error("Not Connected! Error: " + b);
            b = Erizo.RoomEvent({
                type: "room-error",
                message: b
            });
            a.dispatchEvent(b)
        })
    };
    a.disconnect = function() {
        L.Logger.debug("Disconnection requested");
        var b = Erizo.RoomEvent({
            type: "room-disconnected",
            message: "expected-disconnection"
        });
        a.dispatchEvent(b)
    };
    a.publish = function(d, c, f) {
        c = c || {};
        c.maxVideoBW = c.maxVideoBW || b.defaultVideoBW;
        c.maxVideoBW > b.maxVideoBW && (c.maxVideoBW = b.maxVideoBW);
        void 0 === c.minVideoBW && (c.minVideoBW = 0);
        c.minVideoBW >
            b.defaultVideoBW && (c.minVideoBW = b.defaultVideoBW);
        if (d && d.local && void 0 === a.localStreams[d.getID()])
            if (d.hasAudio() || d.hasVideo() || d.hasScreen())
                if (void 0 !== d.url || void 0 !== d.recording) {
                    var m, n;
                    d.url ? (m = "url", n = d.url) : (m = "recording", n = d.recording);
                    L.Logger.info("Checking publish options for", d.getID());
                    d.checkOptions(c);
                    e("publish", {
                        state: m,
                        data: d.hasData(),
                        audio: d.hasAudio(),
                        video: d.hasVideo(),
                        attributes: d.getAttributes(),
                        metadata: c.metadata,
                        createOffer: c.createOffer
                    }, n, function(b, c) {
                        if (b !== null) {
                            L.Logger.info("Stream published");
                            d.getID = function() {
                                return b
                            };
                            d.sendData = function(a) {
                                i(d, a)
                            };
                            d.setAttributes = function(a) {
                                h(d, a)
                            };
                            a.localStreams[b] = d;
                            d.room = a;
                            f && f(b)
                        } else {
                            L.Logger.error("Error when publishing stream", c);
                            f && f(void 0, c)
                        }
                    })
                } else a.p2p ? (b.maxAudioBW = c.maxAudioBW, b.maxVideoBW = c.maxVideoBW, e("publish", {
                    state: "p2p",
                    data: d.hasData(),
                    audio: d.hasAudio(),
                    video: d.hasVideo(),
                    screen: d.hasScreen(),
                    metadata: c.metadata,
                    attributes: d.getAttributes()
                }, void 0, function(b, c) {
                    if (b === null) {
                        L.Logger.error("Error when publishing the stream",
                            c);
                        f && f(void 0, c)
                    }
                    L.Logger.info("Stream published");
                    d.getID = function() {
                        return b
                    };
                    if (d.hasData()) d.sendData = function(a) {
                        i(d, a)
                    };
                    d.setAttributes = function(a) {
                        h(d, a)
                    };
                    a.localStreams[b] = d;
                    d.room = a
                })) : (L.Logger.info("Publishing to Erizo Normally, is createOffer", c.createOffer), e("publish", {
                    state: "erizo",
                    data: d.hasData(),
                    audio: d.hasAudio(),
                    video: d.hasVideo(),
                    screen: d.hasScreen(),
                    minVideoBW: c.minVideoBW,
                    attributes: d.getAttributes(),
                    createOffer: c.createOffer,
                    metadata: c.metadata,
                    scheme: c.scheme
                }, void 0, function(m,
                    n) {
                    if (m === null) {
                        L.Logger.error("Error when publishing the stream: ", n);
                        f && f(void 0, n)
                    } else {
                        L.Logger.info("Stream assigned an Id, starting the publish process");
                        d.getID = function() {
                            return m
                        };
                        if (d.hasData()) d.sendData = function(a) {
                            i(d, a)
                        };
                        d.setAttributes = function(a) {
                            h(d, a)
                        };
                        a.localStreams[m] = d;
                        d.room = a;
                        d.pc = Erizo.Connection({
                            callback: function(a) {
                                L.Logger.debug("Sending message", a);
                                e("signaling_message", {
                                    streamId: d.getID(),
                                    msg: a
                                }, void 0, function() {})
                            },
                            iceServers: a.iceServers,
                            maxAudioBW: c.maxAudioBW,
                            maxVideoBW: c.maxVideoBW,
                            limitMaxAudioBW: b.maxAudioBW,
                            limitMaxVideoBW: b.maxVideoBW,
                            audio: d.hasAudio(),
                            video: d.hasVideo()
                        });
                        d.pc.addStream(d.stream);
                        d.pc.oniceconnectionstatechange = function(b) {
                            if (b === "failed" && a.state !== 0 && d && !d.failed) {
                                d.failed = true;
                                L.Logger.warning("Publishing Stream", d.getID(), "has failed after successful ICE checks");
                                b = Erizo.StreamEvent({
                                    type: "stream-failed",
                                    msg: "Publishing stream failed after connection",
                                    stream: d
                                });
                                a.dispatchEvent(b);
                                a.unpublish(d)
                            }
                        };
                        c.createOffer || d.pc.createOffer();
                        f && f(m)
                    }
                }));
        else d.hasData() &&
            e("publish", {
                state: "data",
                data: d.hasData(),
                audio: !1,
                video: !1,
                screen: !1,
                metadata: c.metadata,
                attributes: d.getAttributes()
            }, void 0, function(b, c) {
                if (b === null) {
                    L.Logger.error("Error publishing stream ", c);
                    f && f(void 0, c)
                } else {
                    L.Logger.info("Stream published");
                    d.getID = function() {
                        return b
                    };
                    d.sendData = function(a) {
                        i(d, a)
                    };
                    d.setAttributes = function(a) {
                        h(d, a)
                    };
                    a.localStreams[b] = d;
                    d.room = a;
                    f && f(b)
                }
            });
        else L.Logger.error("Trying to publish invalid stream"), f && f(void 0, "Invalid Stream")
    };
    a.startRecording = function(a,
        b) {
        a ? (L.Logger.debug("Start Recording stream: " + a.getID()), f("startRecorder", {
            to: a.getID()
        }, function(a, d) {
            null === a ? (L.Logger.error("Error on start recording", d), b && b(void 0, d)) : (L.Logger.info("Start recording", a), b && b(a))
        })) : (L.Logger.error("Trying to start recording on an invalid stream", a), b && b(void 0, "Invalid Stream"))
    };
    a.stopRecording = function(a, b) {
        f("stopRecorder", {
            id: a
        }, function(c, e) {
            null === c ? (L.Logger.error("Error on stop recording", e), b && b(void 0, e)) : (L.Logger.info("Stop recording", a), b &&
                b(!0))
        })
    };
    a.unpublish = function(b, c) {
        if (b && b.local) {
            f("unpublish", b.getID(), function(a, b) {
                null === a ? (L.Logger.error("Error unpublishing stream", b), c && c(void 0, b)) : (L.Logger.info("Stream unpublished"), c && c(!0))
            });
            var e = b.room && b.room.p2p;
            b.room = void 0;
            if ((b.hasAudio() || b.hasVideo() || b.hasScreen()) && void 0 === b.url)
                if (e)
                    for (var m in b.pc) b.pc[m].close(), b.pc[m] = void 0;
                else b.pc && b.pc.close(), b.pc = void 0;
            delete a.localStreams[b.getID()];
            b.getID = function() {};
            b.sendData = function() {};
            b.setAttributes = function() {}
        } else L.Logger.error(),
            c && c(void 0, "Cannot unpublish, stream does not exist or is not local")
    };
    a.subscribe = function(b, c, f) {
        c = c || {};
        if (b && !b.local) {
            if (b.hasVideo() || b.hasAudio() || b.hasScreen()) a.p2p ? (e("subscribe", {
                streamId: b.getID(),
                metadata: c.metadata
            }), f && f(!0)) : (L.Logger.info("Checking subscribe options for", b.getID()), b.checkOptions(c), e("subscribe", {
                    streamId: b.getID(),
                    audio: c.audio,
                    video: c.video,
                    data: c.data,
                    browser: Erizo.getBrowser(),
                    createOffer: c.createOffer,
                    metadata: c.metadata,
                    slideShowMode: c.slideShowMode
                }, void 0,
                function(m, h) {
                    null === m ? (L.Logger.error("Error subscribing to stream ", h), f && f(void 0, h)) : (L.Logger.info("Subscriber added"), b.pc = Erizo.Connection({
                            callback: function(a) {
                                L.Logger.info("Sending message", a);
                                e("signaling_message", {
                                    streamId: b.getID(),
                                    msg: a,
                                    browser: b.pc.browser
                                }, void 0, function() {})
                            },
                            nop2p: !0,
                            audio: c.audio,
                            video: c.video,
                            iceServers: a.iceServers
                        }), b.pc.onaddstream = function(c) {
                            L.Logger.info("Stream subscribed");
                            b.stream = c.stream;
                            c = Erizo.StreamEvent({
                                type: "stream-subscribed",
                                stream: b
                            });
                            a.dispatchEvent(c)
                        },
                        b.pc.oniceconnectionstatechange = function(c) {
                            "failed" === c && 0 !== a.state && b && !b.failed && (b.failed = !0, L.Logger.warning("Subscribing stream", b.getID(), "has failed after successful ICE checks"), c = Erizo.StreamEvent({
                                type: "stream-failed",
                                msg: "Subscribing stream failed after connection",
                                stream: b
                            }), a.dispatchEvent(c), a.unsubscribe(b))
                        }, b.pc.createOffer(!0), f && f(!0))
                }));
            else if (b.hasData() && !1 !== c.data) e("subscribe", {
                streamId: b.getID(),
                data: c.data,
                metadata: c.metadata
            }, void 0, function(c, e) {
                if (null === c) L.Logger.error("Error subscribing to stream ",
                    e), f && f(void 0, e);
                else {
                    L.Logger.info("Stream subscribed");
                    var k = Erizo.StreamEvent({
                        type: "stream-subscribed",
                        stream: b
                    });
                    a.dispatchEvent(k);
                    f && f(!0)
                }
            });
            else {
                L.Logger.warning("There's nothing to subscribe to");
                f && f(void 0, "Nothing to subscribe to");
                return
            }
            L.Logger.info("Subscribing to: " + b.getID())
        } else {
            var m = "Error on subscribe";
            b ? b.local && (L.Logger.warning("Cannot subscribe to local stream, you should subscribe to the remote version of your local stream"), m = "Local copy of stream") : (L.Logger.warning("Cannot subscribe to invalid stream",
                b), m = "Invalid or undefined stream");
            f && f(void 0, m)
        }
    };
    a.unsubscribe = function(b, c) {
        void 0 !== a.socket && b && !b.local && f("unsubscribe", b.getID(), function(a, e) {
            null === a ? c && c(void 0, e) : (j(b), c && c(!0))
        }, function() {
            L.Logger.error("Error calling unsubscribe.")
        })
    };
    a.getStreamsByAttribute = function(b, c) {
        var e = [],
            f, h;
        for (f in a.remoteStreams) a.remoteStreams.hasOwnProperty(f) && (h = a.remoteStreams[f], void 0 !== h.getAttributes() && void 0 !== h.getAttributes()[b] && h.getAttributes()[b] === c && e.push(h));
        return e
    };
    return a
};
var L = L || {};
L.Logger = function(b) {
    return {
        DEBUG: 0,
        TRACE: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4,
        NONE: 5,
        enableLogPanel: function() {
            b.Logger.panel = document.createElement("textarea");
            b.Logger.panel.setAttribute("id", "licode-logs");
            b.Logger.panel.setAttribute("style", "width: 100%; height: 100%; display: none");
            b.Logger.panel.setAttribute("rows", 20);
            b.Logger.panel.setAttribute("cols", 20);
            b.Logger.panel.setAttribute("readOnly", !0);
            document.body.appendChild(b.Logger.panel)
        },
        setLogLevel: function(a) {
            a > b.Logger.NONE ? a = b.Logger.NONE : a <
                b.Logger.DEBUG && (a = b.Logger.DEBUG);
            b.Logger.logLevel = a
        },
        log: function(a) {
            var c = "";
            if (!(a < b.Logger.logLevel)) {
                a === b.Logger.DEBUG ? c += "DEBUG" : a === b.Logger.TRACE ? c += "TRACE" : a === b.Logger.INFO ? c += "INFO" : a === b.Logger.WARNING ? c += "WARNING" : a === b.Logger.ERROR && (c += "ERROR");
                for (var c = c + ": ", f = [], e = 0; e < arguments.length; e++) f[e] = arguments[e];
                f = f.slice(1);
                f = [c].concat(f);
                if (void 0 !== b.Logger.panel) {
                    c = "";
                    for (e = 0; e < f.length; e++) c += f[e];
                    b.Logger.panel.value = b.Logger.panel.value + "\n" + c
                } else console.log.apply(console,
                    f)
            }
        },
        debug: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.DEBUG].concat(a))
        },
        trace: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.TRACE].concat(a))
        },
        info: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.INFO].concat(a))
        },
        warning: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.WARNING].concat(a))
        },
        error: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.ERROR].concat(a))
        }
    }
}(L);
L = L || {};
L.Base64 = function() {
    var b, a, c, f, e, i, h, j, d;
    b = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");
    a = [];
    for (e = 0; e < b.length; e += 1) a[b[e]] = e;
    i = function(a) {
        c = a;
        f = 0
    };
    h = function() {
        var a;
        if (!c || f >= c.length) return -1;
        a = c.charCodeAt(f) & 255;
        f += 1;
        return a
    };
    j = function() {
        if (!c) return -1;
        for (;;) {
            if (f >= c.length) return -1;
            var b = c.charAt(f);
            f += 1;
            if (a[b]) return a[b];
            if ("A" === b) return 0
        }
    };
    d = function(a) {
        a = a.toString(16);
        1 === a.length && (a =
            "0" + a);
        return unescape("%" + a)
    };
    return {
        encodeBase64: function(a) {
            var d, c, e;
            i(a);
            a = "";
            d = Array(3);
            c = 0;
            for (e = !1; !e && -1 !== (d[0] = h());)
                if (d[1] = h(), d[2] = h(), a += b[d[0] >> 2], -1 !== d[1] ? (a += b[d[0] << 4 & 48 | d[1] >> 4], -1 !== d[2] ? (a += b[d[1] << 2 & 60 | d[2] >> 6], a += b[d[2] & 63]) : (a += b[d[1] << 2 & 60], a += "=", e = !0)) : (a += b[d[0] << 4 & 48], a += "=", a += "=", e = !0), c += 4, 76 <= c) a += "\n", c = 0;
            return a
        },
        decodeBase64: function(a) {
            var b, c;
            i(a);
            a = "";
            b = Array(4);
            for (c = !1; !c && -1 !== (b[0] = j()) && -1 !== (b[1] = j());) b[2] = j(), b[3] = j(), a += d(b[0] << 2 & 255 | b[1] >> 4), -1 !==
                b[2] ? (a += d(b[1] << 4 & 255 | b[2] >> 2), -1 !== b[3] ? a += d(b[2] << 6 & 255 | b[3]) : c = !0) : c = !0;
            return a
        }
    }
}(L);
(function() {
    function b() {
        (new c.ElementQueries).init()
    }

    function a(a, b) {
        var c = Object.prototype.toString.call(a),
            f = 0,
            d = a.length;
        if ("[object Array]" === c || "[object NodeList]" === c || "[object HTMLCollection]" === c || "undefined" !== typeof jQuery && a instanceof jQuery || "undefined" !== typeof Elements && a instanceof Elements)
            for (; f < d; f++) b(a[f]);
        else b(a)
    }
    var c = this.L = this.L || {};
    c.ElementQueries = function() {
        function a(b) {
            b || (b = document.documentElement);
            b = getComputedStyle(b, "fontSize");
            return parseFloat(b) || 16
        }

        function b(d,
            c) {
            var f = c.replace(/[0-9]*/, ""),
                c = parseFloat(c);
            switch (f) {
                case "px":
                    return c;
                case "em":
                    return c * a(d);
                case "rem":
                    return c * a();
                case "vw":
                    return c * document.documentElement.clientWidth / 100;
                case "vh":
                    return c * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    return c * (0, Math["vmin" === f ? "min" : "max"])(document.documentElement.clientWidth / 100, document.documentElement.clientHeight / 100);
                default:
                    return c
            }
        }

        function f(a) {
            this.element = a;
            this.options = [];
            var d, c, e, h = 0,
                g = 0,
                k, j, q, p, w;
            this.addOption =
                function(a) {
                    this.options.push(a)
                };
            var u = ["min-width", "min-height", "max-width", "max-height"];
            this.call = function() {
                h = this.element.offsetWidth;
                g = this.element.offsetHeight;
                q = {};
                d = 0;
                for (c = this.options.length; d < c; d++) e = this.options[d], k = b(this.element, e.value), j = "width" === e.property ? h : g, w = e.mode + "-" + e.property, p = "", "min" === e.mode && j >= k && (p += e.value), "max" === e.mode && j <= k && (p += e.value), q[w] || (q[w] = ""), p && -1 === (" " + q[w] + " ").indexOf(" " + p + " ") && (q[w] += " " + p);
                for (var a in u) q[u[a]] ? this.element.setAttribute(u[a],
                    q[u[a]].substr(1)) : this.element.removeAttribute(u[a])
            }
        }

        function j(a, b) {
            a.elementQueriesSetupInformation ? a.elementQueriesSetupInformation.addOption(b) : (a.elementQueriesSetupInformation = new f(a), a.elementQueriesSetupInformation.addOption(b), new c.ResizeSensor(a, function() {
                a.elementQueriesSetupInformation.call()
            }));
            a.elementQueriesSetupInformation.call()
        }

        function d(a) {
            for (var b, a = a.replace(/'/g, '"'); null !== (b = g.exec(a));)
                if (5 < b.length) {
                    var d = b[1] || b[5],
                        c = b[2],
                        e = b[3];
                    b = b[4];
                    var f = void 0;
                    document.querySelectorAll &&
                        (f = document.querySelectorAll.bind(document));
                    !f && "undefined" !== typeof $$ && (f = $$);
                    !f && "undefined" !== typeof jQuery && (f = jQuery);
                    if (!f) throw "No document.querySelectorAll, jQuery or Mootools's $$ found.";
                    for (var d = f(d), f = 0, h = d.length; f < h; f++) j(d[f], {
                        mode: c,
                        property: e,
                        value: b
                    })
                }
        }

        function k(a) {
            var b = "";
            if (a)
                if ("string" === typeof a) a = a.toLowerCase(), (-1 !== a.indexOf("min-width") || -1 !== a.indexOf("max-width")) && d(a);
                else
                    for (var c = 0, e = a.length; c < e; c++) 1 === a[c].type ? (b = a[c].selectorText || a[c].cssText, -1 !== b.indexOf("min-height") ||
                        -1 !== b.indexOf("max-height") ? d(b) : (-1 !== b.indexOf("min-width") || -1 !== b.indexOf("max-width")) && d(b)) : 4 === a[c].type && k(a[c].cssRules || a[c].rules)
        }
        var g = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;
        this.init = function() {
            for (var a = 0, b = document.styleSheets.length; a < b; a++) k(document.styleSheets[a].cssText || document.styleSheets[a].cssRules || document.styleSheets[a].rules)
        }
    };
    window.addEventListener ? window.addEventListener("load", b, !1) : window.attachEvent("onload",
        b);
    var f = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(a) {
        return window.setTimeout(a, 20)
    };
    c.ResizeSensor = function(b, i) {
        function h() {
            var a = [];
            this.add = function(b) {
                a.push(b)
            };
            var b, c;
            this.call = function() {
                b = 0;
                for (c = a.length; b < c; b++) a[b].call()
            };
            this.remove = function(e) {
                var f = [];
                b = 0;
                for (c = a.length; b < c; b++) a[b] !== e && f.push(a[b]);
                a = f
            };
            this.length = function() {
                return a.length
            }
        }

        function j(a, b) {
            if (a.resizedAttached) {
                if (a.resizedAttached) {
                    a.resizedAttached.add(b);
                    return
                }
            } else a.resizedAttached = new h, a.resizedAttached.add(b);
            a.resizeSensor = document.createElement("div");
            a.resizeSensor.className = "resize-sensor";
            a.resizeSensor.style.cssText = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;";
            a.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s;"></div></div><div class="resize-sensor-shrink" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s; width: 200%; height: 200%"></div></div>';
            a.appendChild(a.resizeSensor);
            if ("static" === (a.currentStyle ? a.currentStyle.position : window.getComputedStyle ? window.getComputedStyle(a, null).getPropertyValue("position") : a.style.position)) a.style.position = "relative";
            var c = a.resizeSensor.childNodes[0],
                e = c.childNodes[0],
                i = a.resizeSensor.childNodes[1],
                j = function() {
                    e.style.width = "100000px";
                    e.style.height = "100000px";
                    c.scrollLeft = 1E5;
                    c.scrollTop = 1E5;
                    i.scrollLeft = 1E5;
                    i.scrollTop = 1E5
                };
            j();
            var t = !1,
                v = function() {
                    a.resizedAttached && (t && (a.resizedAttached.call(),
                        t = !1), f(v))
                };
            f(v);
            var x, D, r, q, p = function() {
                    if ((r = a.offsetWidth) !== x || (q = a.offsetHeight) !== D) t = !0, x = r, D = q;
                    j()
                },
                w = function(a, b, c) {
                    a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c)
                };
            w(c, "scroll", p);
            w(i, "scroll", p)
        }
        a(b, function(a) {
            j(a, i)
        });
        this.detach = function(a) {
            c.ResizeSensor.detach(b, a)
        }
    };
    c.ResizeSensor.detach = function(b, c) {
        a(b, function(a) {
            if (a.resizedAttached && "function" === typeof c && (a.resizedAttached.remove(c), a.resizedAttached.length())) return;
            a.resizeSensor && (a.contains(a.resizeSensor) &&
                a.removeChild(a.resizeSensor), delete a.resizeSensor, delete a.resizedAttached)
        })
    }
})();
Erizo = Erizo || {};
Erizo.View = function() {
    var b = Erizo.EventDispatcher({});
    b.url = "";
    return b
};
Erizo = Erizo || {};
Erizo.VideoPlayer = function(b) {
    var a = Erizo.View({}),
        c, f;
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    c = function() {
        a.bar.display()
    };
    f = function() {
        a.bar.hide()
    };
    a.destroy = function() {
        a.video.pause();
        delete a.resizer;
        a.parentNode.removeChild(a.div)
    };
    a.resize = function() {
        var c = a.container.offsetWidth,
            f = a.container.offsetHeight;
        if (b.stream.screen || !1 === b.options.crop) 0.5625 * c < f ? (a.video.style.width = c + "px", a.video.style.height = 0.5625 * c + "px", a.video.style.top = -(0.5625 * c / 2 - f / 2) + "px", a.video.style.left =
            "0px") : (a.video.style.height = f + "px", a.video.style.width = 16 / 9 * f + "px", a.video.style.left = -(16 / 9 * f / 2 - c / 2) + "px", a.video.style.top = "0px");
        else if (c !== a.containerWidth || f !== a.containerHeight) 0.75 * c > f ? (a.video.style.width = c + "px", a.video.style.height = 0.75 * c + "px", a.video.style.top = -(0.75 * c / 2 - f / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = f + "px", a.video.style.width = 4 / 3 * f + "px", a.video.style.left = -(4 / 3 * f / 2 - c / 2) + "px", a.video.style.top = "0px");
        a.containerWidth = c;
        a.containerHeight = f
    };
    L.Logger.debug("Creating URL from stream " +
        a.stream);
    a.streamUrl = (window.URL || webkitURL).createObjectURL(a.stream);
    a.div = document.createElement("div");
    a.div.setAttribute("id", "player_" + a.id);
    a.div.setAttribute("class", "player");
    a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;");
    !1 !== b.options.loader && (a.loader = document.createElement("img"), a.loader.setAttribute("style", "width: 16px; height: 16px; position: absolute; top: 50%; left: 50%; margin-top: -8px; margin-left: -8px"),
        a.loader.setAttribute("id", "back_" + a.id), a.loader.setAttribute("class", "loader"), a.loader.setAttribute("src", a.url + "/images/loader.gif"));
    a.video = document.createElement("video");
    a.video.setAttribute("id", "stream" + a.id);
    a.video.setAttribute("class", "stream");
    a.video.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.video.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.video.volume = 0);
    a.container = void 0 !== a.elementID ? "object" === typeof a.elementID && "function" === typeof a.elementID.appendChild ?
        a.elementID : document.getElementById(a.elementID) : document.body;
    a.container.appendChild(a.div);
    a.parentNode = a.div.parentNode;
    a.loader && a.div.appendChild(a.loader);
    a.div.appendChild(a.video);
    a.containerWidth = 0;
    a.containerHeight = 0;
    !1 !== b.options.resizer && (a.resizer = new L.ResizeSensor(a.container, a.resize), a.resize());
    !1 !== b.options.bar ? (a.bar = new Erizo.Bar({
        elementID: "player_" + a.id,
        id: a.id,
        stream: b.stream,
        media: a.video,
        options: b.options
    }), a.div.onmouseover = c, a.div.onmouseout = f) : a.media = a.video;
    a.video.src =
        a.streamUrl;
    return a
};
Erizo = Erizo || {};
Erizo.AudioPlayer = function(b) {
    var a = Erizo.View({}),
        c, f;
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.streamUrl = (window.URL || webkitURL).createObjectURL(a.stream);
    a.audio = document.createElement("audio");
    a.audio.setAttribute("id", "stream" + a.id);
    a.audio.setAttribute("class", "stream");
    a.audio.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.audio.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.audio.volume =
        0);
    b.stream.local && (a.audio.volume = 0);
    void 0 !== a.elementID ? (a.destroy = function() {
            a.audio.pause();
            a.parentNode.removeChild(a.div)
        }, c = function() {
            a.bar.display()
        }, f = function() {
            a.bar.hide()
        }, a.div = document.createElement("div"), a.div.setAttribute("id", "player_" + a.id), a.div.setAttribute("class", "player"), a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;"), a.container = "object" === typeof a.elementID && "function" === typeof a.elementID.appendChild ? a.elementID : document.getElementById(a.elementID),
        a.container.appendChild(a.div), a.parentNode = a.div.parentNode, a.div.appendChild(a.audio), !1 !== b.options.bar ? (a.bar = new Erizo.Bar({
            elementID: "player_" + a.id,
            id: a.id,
            stream: b.stream,
            media: a.audio,
            options: b.options
        }), a.div.onmouseover = c, a.div.onmouseout = f) : a.media = a.audio) : (a.destroy = function() {
        a.audio.pause();
        a.parentNode.removeChild(a.audio)
    }, document.body.appendChild(a.audio), a.parentNode = document.body);
    a.audio.src = a.streamUrl;
    return a
};
Erizo = Erizo || {};
Erizo.Bar = function(b) {
    var a = Erizo.View({}),
        c, f;
    console.log("Create Bar: ",b);
    a.elementID = b.elementID;
    a.id = b.id;
    a.div = document.createElement("div");
    a.div.setAttribute("id", "bar_" + a.id);
    a.div.setAttribute("class", "bar");
    a.bar = document.createElement("div");
    a.bar.setAttribute("style", "width: 100%; height: 15%; max-height: 30px; position: absolute; bottom: 0; right: 0; background-color: rgba(255,255,255,0.62)");
    a.bar.setAttribute("id", "subbar_" + a.id);
    a.bar.setAttribute("class", "subbar");
    /*ThanhDC3*/
    var bar_username = b.stream.getAttributes().name;
    a.userNameDIV = document.createElement("a");
    a.userNameDIV.setAttribute("style","position: absolute;top: 50%;left:50%;transform: translateY(-50%) translateX(-50%);");
    a.userNameDIV.innerHTML  = bar_username;
    /*END ThanhDC3 */
    a.link = document.createElement("a");
    a.link.setAttribute("href",
        "http://www.fpt.vn/");
     a.link.setAttribute("class", "link");
     a.link.setAttribute("target", "_blank");
   
    a.logo = document.createElement("img");
    a.logo.setAttribute("style", "width: 100%; height: 100%; max-width: 30px; position: absolute; top: 0; left: 2px;");
    a.logo.setAttribute("class", "logo");
    a.logo.setAttribute("alt", "FPT");
    a.logo.setAttribute("src", a.url + "/images/FPT_logo.png");
    f = function(b) {
        "block" !== b ? b = "none" : clearTimeout(c);
        a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; bottom: 0; right: 0; display:" +
            b)
    };
    a.display = function() {
        f("block")
    };
    a.hide = function() {
        c = setTimeout(f, 1E3)
    };
    document.getElementById(a.elementID).appendChild(a.div);
    a.div.appendChild(a.bar);
    a.bar.appendChild(a.link);
    /*ThanhDC3*/
        a.bar.appendChild(a.userNameDIV);
    /*END THANHDC3 */
    a.link.appendChild(a.logo);
    if (!b.stream.screen && (void 0 === b.options || void 0 === b.options.speaker || !0 === b.options.speaker)) a.speaker = new Erizo.Speaker({
        elementID: "subbar_" + a.id,
        id: a.id,
        stream: b.stream,
        media: b.media
    });
    a.display();
    a.hide();
    return a
};
Erizo = Erizo || {};
Erizo.Speaker = function(b) {
    var a = Erizo.View({}),
        c, f, e, i = 50;
    a.elementID = b.elementID;
    a.media = b.media;
    a.id = b.id;
    a.stream = b.stream;
    a.div = document.createElement("div");
    a.div.setAttribute("style", "width: 40%; height: 100%; max-width: 32px; position: absolute; right: 0;z-index:0;");
    a.icon = document.createElement("img");
    a.icon.setAttribute("id", "volume_" + a.id);
    a.icon.setAttribute("src", a.url + "/images/sound.png");
    a.icon.setAttribute("style", "width: 80%; height: 100%; position: absolute;");
    a.div.appendChild(a.icon);
    a.stream.local ? (f = function() {
        a.media.muted = !0;
        a.icon.setAttribute("src", a.url + "/images/mute.png");
        a.stream.stream.getAudioTracks()[0].enabled = !1
    }, e = function() {
        a.media.muted = !1;
        a.icon.setAttribute("src", a.url + "/images/sound.png");
        a.stream.stream.getAudioTracks()[0].enabled = !0
    }, a.icon.onclick = function() {
        a.media.muted ? e() : f()
    }) : (a.picker = document.createElement("input"), a.picker.setAttribute("id", "picker_" + a.id), a.picker.type = "range", a.picker.min = 0, a.picker.max = 100, a.picker.step = 10, a.picker.value =
        i, a.picker.setAttribute("orient", "vertical"), a.div.appendChild(a.picker), a.media.volume = a.picker.value / 100, a.media.muted = !1, a.picker.oninput = function() {
            0 < a.picker.value ? (a.media.muted = !1, a.icon.setAttribute("src", a.url + "/images/sound.png")) : (a.media.muted = !0, a.icon.setAttribute("src", a.url + "/images/mute.png"));
            a.media.volume = a.picker.value / 100
        }, c = function(b) {
            a.picker.setAttribute("style", "background: transparent; width: 32px; height: 100px; position: absolute; bottom: 90%; z-index: 1;" + a.div.offsetHeight +
                "px; right: 0px; -webkit-appearance: slider-vertical; display: " + b)
        }, f = function() {
            a.icon.setAttribute("src", a.url + "/images/mute.png");
            i = a.picker.value;
            a.picker.value = 0;
            a.media.volume = 0;
            a.media.muted = !0
        }, e = function() {
            a.icon.setAttribute("src", a.url + "/images/sound.png");
            a.picker.value = i;
            a.media.volume = a.picker.value / 100;
            a.media.muted = !1
        }, a.icon.onclick = function() {
            a.media.muted ? e() : f()
        }, a.div.onmouseover = function() {
            c("block")
        }, a.div.onmouseout = function() {
            c("none")
        }, c("none"));
    document.getElementById(a.elementID).appendChild(a.div);
    return a
};