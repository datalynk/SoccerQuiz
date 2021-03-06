function defineCloud(k) {
    function u(b, a, d) {
        if (void 0 === a) throw "Argument " + b + " was not provided!";
        if (typeof a != d) throw "Argument " + b + " was an unexpected type! Expected: " + d + ", Received: " + typeof a;
    }
    function q(b, a) {
        u("data", b, "object");
        u("callback", a, "function");
        w(this);
        this.url || (this.url = this.restNamespace + "/" + this.restMethod + ".json");
        var d = void 0 == k.useSecure ? !0 : k.useSecure;
        k.debug && Ti.API.info("ACS Request: { url: \"" + this.url + "\", verb: \"" + this.verb + "\", secure: " + (d ? "YES" : "NO") + ", data: " + JSON.stringify(b) + " })");
        g.send(this.url, this.verb, b, d, function(c) {
            if (a) {
                var d = c.response || {};
                c.meta && "ok" == c.meta.status ? (d.success = !0, d.error = !1, d.meta = c.meta, k.debug && Ti.API.info(JSON.stringify(d))) : (d.success = !1, d.error = !0, d.code = c.meta ? c.meta.code : c.statusCode, d.message = c.meta ? c.meta.message : c.message || c.statusText, k.debug && Ti.API.error(d.code + ": " + d.message));
                a(d);
            }
        });
    }
    function l() {
        q.call(this, 2 == arguments.length ? arguments[0] : {}, 2 == arguments.length ? arguments[1] : arguments[0]);
    }
    function x(b) {
        q.call(this, {}, b);
    }
    function w(b) {
        b.restNamespace || (b.restNamespace = b.property.toLowerCase());
        b.restMethod || (b.restMethod = b.method.toLowerCase());
    }
    function B(b, a) {
        u("callback", a, "function");
        var d = {};
        d.useSecure = void 0 == k.useSecure ? !0 : k.useSecure;
        d.params = b || {};
        d.params.cb = function(c) {
            if (a) {
                var d = c || {};
                c && c.access_token ? (d.success = !0, d.error = !1, k.debug && Ti.API.info("ACS Token: " + c.access_token + " Expires: " + c.expires_in)) : (d.success = !1, d.error = !0, d.message = "Cancelled", k.debug && Ti.API.error("ACS " + d.message));
                a(d);
            }
        };
        g.secureSend(this.method, d);
    }
    function y() {
        B.call(this, 2 == arguments.length ? arguments[0] : {}, 2 == arguments.length ? arguments[1] : arguments[0]);
    }
    function v(b, a) {
        b[a >> 5] |= 128 << 24 - a % 32;
        b[(a + 64 >> 9 << 4) + 15] = a;
        for (var d = Array(80), c = 1732584193, h = -271733879, f = -1732584194, e = 271733878, i = -1009589776, m = 0; m < b.length; m += 16) {
            for (var g = c, k = h, s = f, l = e, p = i, n = 0; 80 > n; n++) {
                d[n] = 16 > n ? b[m + n] : (d[n - 3] ^ d[n - 8] ^ d[n - 14] ^ d[n - 16]) << 1 | (d[n - 3] ^ d[n - 8] ^ d[n - 14] ^ d[n - 16]) >>> 31;
                var o = c << 5 | c >>> 27, q;
                q = 20 > n ? h & f | ~h & e : 40 > n ? h ^ f ^ e : 60 > n ? h & f | h & e | f & e : h ^ f ^ e;
                o = r(r(o, q), r(r(i, d[n]), 20 > n ? 1518500249 : 40 > n ? 1859775393 : 60 > n ? -1894007588 : -899497514));
                i = e;
                e = f;
                f = h << 30 | h >>> 2;
                h = c;
                c = o;
            }
            c = r(c, g);
            h = r(h, k);
            f = r(f, s);
            e = r(e, l);
            i = r(i, p);
        }
        return [ c, h, f, e, i ];
    }
    function r(b, a) {
        var d = (b & 65535) + (a & 65535);
        return (b >> 16) + (a >> 16) + (d >> 16) << 16 | d & 65535;
    }
    function z(b) {
        for (var a = [], d = (1 << o) - 1, c = 0; c < b.length * o; c += o) a[c >> 5] |= (b.charCodeAt(c / o) & d) << 32 - o - c % 32;
        return a;
    }
    function p(e, a, d, c) {
        var h = !1;
        a ? (this.oauthKey = e, this.oauthSecret = a) : this.appKey = e;
        this.apiBaseURL = d ? d : b.sdk.url.baseURL;
        this.authBaseURL = c ? c : b.sdk.url.authBaseURL;
        this.useThreeLegged = function(a) {
            h = a;
            this.oauthKey || (this.oauthKey = this.appKey);
        };
        this.isThreeLegged = function() {
            return h;
        };
        return this;
    }
    var b, t = {
        PROPERTY_TYPE_ONLY_LATEST: 0,
        PROPERTY_TYPE_SLASH_COMBINE: 1,
        PROPERTY_TYPE_IGNORE: 2
    };
    t.build = function a(d, c) {
        var b = c.children || [], e;
        for (e in b) if (b.hasOwnProperty(e)) {
            var j = b[e], i = j.propertyTypes || c.propertyTypes || {};
            i.children = t.PROPERTY_TYPE_IGNORE;
            for (var m in c) if (c.hasOwnProperty(m)) switch (i[m] || t.PROPERTY_TYPE_ONLY_LATEST) {
              case t.PROPERTY_TYPE_ONLY_LATEST:
                j[m] = void 0 === j[m] ? c[m] : j[m];
                break;
              case t.PROPERTY_TYPE_SLASH_COMBINE:
                var g = [];
                c[m] && g.push(c[m]);
                j[m] && g.push(j[m]);
                j[m] = g.join("/");
            }
            j.method && !j.children ? d[j.method] = function(a) {
                return function() {
                    return a.executor.apply(a, arguments);
                };
            }(j) : j.property && a(d[j.property] = {}, j);
        }
    };
    t.build(k, {
        verb: "GET",
        executor: q,
        children: [ {
            method: "hasStoredSession",
            executor: function() {
                Ti.API.warn("Cloud.hasStoredSession has been deprecated. Use Cloud.sessionId property");
                return g.hasStoredSession();
            }
        }, {
            method: "retrieveStoredSession",
            executor: function() {
                Ti.API.warn("Cloud.retrieveStoredSession has been deprecated. Use Cloud.sessionId property");
                return g.retrieveStoredSession();
            }
        }, {
            property: "ACLs",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "show"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            }, {
                method: "addUser",
                restMethod: "add",
                verb: "POST"
            }, {
                method: "removeUser",
                restMethod: "remove",
                verb: "DELETE"
            }, {
                method: "checkUser",
                restMethod: "check"
            } ]
        }, {
            property: "Chats",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "query"
            }, {
                method: "getChatGroups",
                restMethod: "get_chat_groups",
                executor: l
            } ]
        }, {
            property: "Checkins",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "query",
                executor: l
            }, {
                method: "show"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "Clients",
            children: [ {
                method: "geolocate",
                executor: l
            } ]
        }, {
            property: "Objects",
            executor: function(a, d) {
                var c;
                a && "object" == typeof a && (u("data.classname", a.classname, "string"), w(this), this.url = this.restNamespace + "/" + a.classname + "/" + this.restMethod + ".json", c = a.classname, delete a.classname);
                q.call(this, a, d);
                a.classname = c;
            },
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            }, {
                method: "query"
            } ]
        }, {
            property: "Emails",
            restNamespace: "custom_mailer",
            children: [ {
                method: "send",
                verb: "POST",
                restMethod: "email_from_template"
            } ]
        }, {
            property: "Events",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "showOccurrences",
                restMethod: "show/occurrences"
            }, {
                method: "query",
                executor: l
            }, {
                method: "queryOccurrences",
                restMethod: "query/occurrences",
                executor: l
            }, {
                method: "search",
                executor: l
            }, {
                method: "searchOccurrences",
                restMethod: "search/occurrences",
                executor: l
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "Files",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "query",
                executor: l
            }, {
                method: "show"
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "Friends",
            children: [ {
                method: "add",
                verb: "POST"
            }, {
                method: "requests",
                executor: l
            }, {
                method: "approve",
                verb: "PUT"
            }, {
                method: "remove",
                verb: "DELETE"
            }, {
                method: "search"
            } ]
        }, {
            property: "KeyValues",
            children: [ {
                method: "set",
                verb: "PUT"
            }, {
                method: "get"
            }, {
                method: "append",
                verb: "PUT"
            }, {
                method: "increment",
                restMethod: "incrby",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "Messages",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "reply",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "showInbox",
                restMethod: "show/inbox",
                executor: l
            }, {
                method: "showSent",
                restMethod: "show/sent",
                executor: l
            }, {
                method: "showThreads",
                restMethod: "show/threads",
                executor: l
            }, {
                method: "showThread",
                restMethod: "show/thread"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            }, {
                method: "removeThread",
                restMethod: "delete/thread",
                verb: "DELETE"
            } ]
        }, {
            property: "Photos",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "search"
            }, {
                method: "query",
                executor: l
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "PhotoCollections",
            restNamespace: "collections",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "search"
            }, {
                method: "showSubcollections",
                restMethod: "show/subcollections"
            }, {
                method: "showPhotos",
                restMethod: "show/photos"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "Places",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "search",
                executor: l
            }, {
                method: "show"
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            }, {
                method: "query",
                executor: l
            } ]
        }, {
            property: "Posts",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "query",
                executor: l
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "PushNotifications",
            restNamespace: "push_notification",
            verb: "POST",
            children: [ {
                method: "subscribe"
            }, {
                method: "unsubscribe",
                verb: "DELETE"
            }, {
                method: "notify"
            } ]
        }, {
            property: "Reviews",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "query"
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE"
            } ]
        }, {
            property: "SocialIntegrations",
            restNamespace: "users",
            children: [ {
                method: "externalAccountLogin",
                restMethod: "external_account_login",
                verb: "POST"
            }, {
                method: "externalAccountLink",
                restMethod: "external_account_link",
                verb: "POST"
            }, {
                method: "externalAccountUnlink",
                restMethod: "external_account_unlink",
                verb: "DELETE"
            }, {
                method: "searchFacebookFriends",
                restNamespace: "social",
                restMethod: "facebook/search_friends",
                executor: x
            } ]
        }, {
            property: "Statuses",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "search"
            }, {
                method: "query",
                executor: l
            } ]
        }, {
            property: "Users",
            children: [ {
                method: "create",
                verb: "POST"
            }, {
                method: "login",
                verb: "POST"
            }, {
                method: "show"
            }, {
                method: "showMe",
                restMethod: "show/me",
                executor: x
            }, {
                method: "search",
                executor: l
            }, {
                method: "query",
                executor: l
            }, {
                method: "update",
                verb: "PUT"
            }, {
                method: "logout",
                executor: function(a) {
                    q.call(this, {}, function(d) {
                        g.reset();
                        a(d);
                    });
                }
            }, {
                method: "remove",
                restMethod: "delete",
                verb: "DELETE",
                executor: function() {
                    var a = arguments;
                    q.call(this, 2 == a.length ? a[0] : {}, function(d) {
                        g.reset();
                        (2 == a.length ? a[1] : a[0])(d);
                    });
                }
            }, {
                method: "requestResetPassword",
                restMethod: "request_reset_password"
            }, {
                method: "secureCreate",
                executor: y
            }, {
                method: "secureLogin",
                executor: y
            }, {
                method: "secureStatus",
                executor: function() {
                    return g.checkStatus();
                }
            } ]
        } ]
    });
    var e;
    null == e && (e = {});
    e.setProperties = function(a, d) {
        if (null != a && null != d) for (var c in d) a[c] = d[c];
        return a;
    };
    e.setProperties(e, {
        percentEncode: function(a) {
            if (null == a) return "";
            if (a instanceof Array) {
                for (var d = ""; 0 < a.length; ++a) "" != d && (d += "&"), d += e.percentEncode(a[0]);
                return d;
            }
            a = encodeURIComponent(a);
            a = a.replace(/\!/g, "%21");
            a = a.replace(/\*/g, "%2A");
            a = a.replace(/\'/g, "%27");
            a = a.replace(/\(/g, "%28");
            return a = a.replace(/\)/g, "%29");
        },
        decodePercent: function(a) {
            null != a && (a = a.replace(/\+/g, " "));
            return decodeURIComponent(a);
        },
        getParameterList: function(a) {
            if (null == a) return [];
            if ("object" != typeof a) return e.decodeForm(a + "");
            if (a instanceof Array) return a;
            var d = [], c;
            for (c in a) d.push([ c, a[c] ]);
            return d;
        },
        getParameterMap: function(a) {
            if (null == a) return {};
            if ("object" != typeof a) return e.getParameterMap(e.decodeForm(a + ""));
            if (a instanceof Array) {
                for (var d = {}, c = 0; c < a.length; ++c) {
                    var b = a[c][0];
                    void 0 === d[b] && (d[b] = a[c][1]);
                }
                return d;
            }
            return a;
        },
        getParameter: function(a, d) {
            if (a instanceof Array) {
                for (var c = 0; c < a.length; ++c) if (a[c][0] == d) return a[c][1];
                return null;
            }
            return e.getParameterMap(a)[d];
        },
        formEncode: function(a) {
            for (var d = "", a = e.getParameterList(a), c = 0; c < a.length; ++c) {
                var b = a[c][1];
                null == b && (b = "");
                "" != d && (d += "&");
                d += e.percentEncode(a[c][0]) + "=" + e.percentEncode(b);
            }
            return d;
        },
        decodeForm: function(a) {
            for (var d = [], a = a.split("&"), c = 0; c < a.length; ++c) {
                var b = a[c];
                if ("" != b) {
                    var f = b.indexOf("="), j;
                    0 > f ? (j = e.decodePercent(b), b = null) : (j = e.decodePercent(b.substring(0, f)), b = e.decodePercent(b.substring(f + 1)));
                    d.push([ j, b ]);
                }
            }
            return d;
        },
        setParameter: function(a, d, c) {
            var b = a.parameters;
            if (b instanceof Array) {
                for (a = 0; a < b.length; ++a) b[a][0] == d && (void 0 === c ? b.splice(a, 1) : (b[a][1] = c, c = void 0));
                void 0 !== c && b.push([ d, c ]);
            } else b = e.getParameterMap(b), b[d] = c, a.parameters = b;
        },
        setParameters: function(a, d) {
            for (var c = e.getParameterList(d), b = 0; b < c.length; ++b) e.setParameter(a, c[b][0], c[b][1]);
        },
        completeRequest: function(a, d) {
            null == a.method && (a.method = "GET");
            var c = e.getParameterMap(a.parameters);
            null == c.oauth_consumer_key && e.setParameter(a, "oauth_consumer_key", d.consumerKey || "");
            null == c.oauth_token && null != d.token && e.setParameter(a, "oauth_token", d.token);
            null == c.oauth_version && e.setParameter(a, "oauth_version", "1.0");
            null == c.oauth_timestamp && e.setParameter(a, "oauth_timestamp", e.timestamp());
            null == c.oauth_nonce && e.setParameter(a, "oauth_nonce", e.nonce(6));
            e.SignatureMethod.sign(a, d);
        },
        setTimestampAndNonce: function(a) {
            e.setParameter(a, "oauth_timestamp", e.timestamp());
            e.setParameter(a, "oauth_nonce", e.nonce(6));
        },
        addToURL: function(a, d) {
            newURL = a;
            if (null != d) {
                var c = e.formEncode(d);
                0 < c.length && (newURL = 0 > a.indexOf("?") ? newURL + "?" : newURL + "&", newURL += c);
            }
            return newURL;
        },
        getAuthorizationHeader: function(a, d) {
            for (var c = "OAuth realm=\"" + e.percentEncode(a) + "\"", b = e.getParameterList(d), f = 0; f < b.length; ++f) {
                var j = b[f], i = j[0];
                0 == i.indexOf("oauth_") && (c += "," + e.percentEncode(i) + "=\"" + e.percentEncode(j[1]) + "\"");
            }
            return c;
        },
        correctTimestamp: function(a) {
            e.timeCorrectionMsec = 1000 * a - (new Date).getTime();
        },
        timeCorrectionMsec: 0,
        timestamp: function() {
            var a = (new Date).getTime() + e.timeCorrectionMsec;
            return Math.floor(a / 1000);
        },
        nonce: function(a) {
            for (var d = e.nonce.CHARS, c = "", b = 0; b < a; ++b) var f = Math.floor(Math.random() * d.length), c = c + d.substring(f, f + 1);
            return c;
        }
    });
    e.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    e.declareClass = function(a, d, c) {
        var b = a[d];
        a[d] = c;
        if (null != c && null != b) for (var e in b) "prototype" != e && (c[e] = b[e]);
        return c;
    };
    e.declareClass(e, "SignatureMethod", function() {});
    e.setProperties(e.SignatureMethod.prototype, {
        sign: function(a) {
            var d = this.getSignature(e.SignatureMethod.getBaseString(a));
            e.setParameter(a, "oauth_signature", d);
            return d;
        },
        initialize: function(a, d) {
            var c;
            c = null != d.accessorSecret && 9 < a.length && "-Accessor" == a.substring(a.length - 9) ? d.accessorSecret : d.consumerSecret;
            this.key = e.percentEncode(c) + "&" + e.percentEncode(d.tokenSecret);
        }
    });
    e.setProperties(e.SignatureMethod, {
        sign: function(a, d) {
            var c = e.getParameterMap(a.parameters).oauth_signature_method;
            if (null == c || "" == c) c = "HMAC-SHA1", e.setParameter(a, "oauth_signature_method", c);
            e.SignatureMethod.newMethod(c, d).sign(a);
        },
        newMethod: function(a, d) {
            var c = e.SignatureMethod.REGISTERED[a];
            if (null != c) {
                var b = new c;
                b.initialize(a, d);
                return b;
            }
            var c = Error("signature_method_rejected"), f = "";
            for (b in e.SignatureMethod.REGISTERED) "" != f && (f += "&"), f += e.percentEncode(b);
            c.oauth_acceptable_signature_methods = f;
            throw c;
        },
        REGISTERED: {},
        registerMethodClass: function(a, d) {
            for (var c = 0; c < a.length; ++c) e.SignatureMethod.REGISTERED[a[c]] = d;
        },
        makeSubclass: function(a) {
            var d = e.SignatureMethod, c = function() {
                d.call(this);
            };
            c.prototype = new d;
            c.prototype.getSignature = a;
            return c.prototype.constructor = c;
        },
        getBaseString: function(a) {
            var d = a.action, c = d.indexOf("?");
            if (0 > c) c = a.parameters; else for (var c = e.decodeForm(d.substring(c + 1)), b = e.getParameterList(a.parameters), f = 0; f < b.length; ++f) c.push(b[f]);
            return e.percentEncode(a.method.toUpperCase()) + "&" + e.percentEncode(e.SignatureMethod.normalizeUrl(d)) + "&" + e.percentEncode(e.SignatureMethod.normalizeParameters(c));
        },
        normalizeUrl: function(a) {
            var d = e.SignatureMethod.parseUri(a), a = d.protocol.toLowerCase(), c = d.authority.toLowerCase();
            if ("http" == a && 80 == d.port || "https" == a && 443 == d.port) {
                var b = c.lastIndexOf(":");
                0 <= b && (c = c.substring(0, b));
            }
            (d = d.path) || (d = "/");
            return a + "://" + c + d;
        },
        parseUri: function(a) {
            for (var b = "source,protocol,authority,userInfo,user,password,host,port,relative,path,directory,file,query,anchor".split(","), a = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(a), c = {}, e = 14; e--; ) c[b[e]] = a[e] || "";
            return c;
        },
        normalizeParameters: function(a) {
            if (null == a) return "";
            for (var b = e.getParameterList(a), a = [], c = 0; c < b.length; ++c) {
                var h = b[c];
                "oauth_signature" != h[0] && a.push([ e.percentEncode(h[0]) + " " + e.percentEncode(h[1]), h ]);
            }
            a.sort(function(a, c) {
                return a[0] < c[0] ? -1 : a[0] > c[0] ? 1 : 0;
            });
            b = [];
            for (c = 0; c < a.length; ++c) b.push(a[c][1]);
            return e.formEncode(b);
        }
    });
    e.SignatureMethod.registerMethodClass([ "PLAINTEXT", "PLAINTEXT-Accessor" ], e.SignatureMethod.makeSubclass(function() {
        return this.key;
    }));
    e.SignatureMethod.registerMethodClass([ "HMAC-SHA1", "HMAC-SHA1-Accessor" ], e.SignatureMethod.makeSubclass(function(a) {
        A = "=";
        var b = this.key, c = z(b);
        16 < c.length && (c = v(c, b.length * o));
        for (var e = Array(16), b = Array(16), f = 0; 16 > f; f++) e[f] = c[f] ^ 909522486, b[f] = c[f] ^ 1549556828;
        a = v(e.concat(z(a)), 512 + a.length * o);
        a = v(b.concat(a), 672);
        c = "";
        for (b = 0; b < 4 * a.length; b += 3) {
            e = (a[b >> 2] >> 8 * (3 - b % 4) & 255) << 16 | (a[b + 1 >> 2] >> 8 * (3 - (b + 1) % 4) & 255) << 8 | a[b + 2 >> 2] >> 8 * (3 - (b + 2) % 4) & 255;
            for (f = 0; 4 > f; f++) c = 8 * b + 6 * f > 32 * a.length ? c + A : c + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 6 * (3 - f) & 63);
        }
        return c;
    }));
    var A = "", o = 8;
    p.prototype.sendRequest = function(a, d, c, h, f) {
        var j = b.js.sdk.utils.getAuthType(this);
        if (j == b.constants.unknown) f(b.constants.noAppKeyError); else {
            var i = "", i = h ? i + b.sdk.url.https : i + b.sdk.url.http, i = i + (this.apiBaseURL + "/" + b.sdk.url.version + "/" + a), i = j == b.constants.app_key ? i + (b.constants.keyParam + this.appKey) : i + (b.constants.oauthKeyParam + this.oauthKey);
            null == c && (c = {});
            d = d ? d.toUpperCase() : b.constants.get_method;
            c[b.constants.suppressCode] = "true";
            this.isThreeLegged() || (h = b.js.sdk.utils.getCookie(b.constants.sessionId), h || (h = this.session_id), h && (i = -1 != i.indexOf("?") ? i + ("&" + b.constants.sessionId + "=" + h) : i + ("?" + b.constants.sessionId + "=" + h)));
            if (this.isThreeLegged()) {
                !this.accessToken && (h = this.getSession()) && (this.accessToken = h.access_token);
                this.accessToken && (c[b.constants.accessToken] = this.accessToken);
            }
            h = c;
            if (Ti.App.analytics) {
                var g = h.analytics || {};
                g.id = Ti.Platform.createUUID();
                Ti.Platform.id && (g.mid = Ti.Platform.id);
                g.aguid = Ti.App.guid;
                g.event = "cloud." + a.replace(/\//g, ".").replace(/\.json/, "");
                g.deploytype = Ti.App.deployType || "development";
                g.sid = Ti.App.sessionId;
                h.ti_analytics = JSON.stringify(g);
            }
            c = b.js.sdk.utils.cleanInvalidData(c);
            if (a = b.js.sdk.utils.getFileObject(c)) {
                try {
                    var k;
                    k = a.toString().match(/TiFilesystemFile/) ? a.read() : a;
                    if (!k) {
                        f(b.constants.fileLoadError);
                        return;
                    }
                    c[b.constants.file] ? (delete c[b.constants.file], c[b.constants.file] = k) : c[b.constants.photo] && (delete c[b.constants.photo], c[b.constants.photo] = k);
                } catch (l) {
                    f(b.constants.fileLoadError);
                    return;
                }
                k = {};
                if (j == b.constants.oauth || j == b.constants.three_legged_oauth) j = {
                    method: d,
                    action: i,
                    parameters: []
                }, b.js.sdk.utils.populateOAuthParameters(j.parameters, this.oauthKey), this.oauthSecret && e.completeRequest(j, {
                    consumerSecret: this.oauthSecret
                }), k[b.constants.oauth_header] = e.getAuthorizationHeader("", j.parameters);
            } else if (k = {}, j == b.constants.oauth || j == b.constants.three_legged_oauth) {
                var j = {
                    method: d,
                    action: i,
                    parameters: []
                }, s;
                for (s in c) c.hasOwnProperty(s) && j.parameters.push([ s, c[s] ]);
                b.js.sdk.utils.populateOAuthParameters(j.parameters, this.oauthKey);
                this.oauthSecret && e.completeRequest(j, {
                    consumerSecret: this.oauthSecret
                });
                k[b.constants.oauth_header] = e.getAuthorizationHeader("", j.parameters);
            }
            b.js.sdk.utils.sendAppceleratorRequest(i, d, c, k, f, this);
        }
    };
    p.prototype.sendAuthRequest = function(a) {
        if (b.js.sdk.utils.getAuthType(this) !== b.constants.three_legged_oauth) alert("wrong authorization type!"); else {
            var a = a || {}, d = !1;
            "boolean" == typeof a.useSecure && (d = a.useSecure);
            var c = "", c = d ? c + b.sdk.url.https : c + b.sdk.url.http, c = c + this.authBaseURL, c = c + "/oauth/authorize" + (b.constants.clientIdParam + this.oauthKey), c = c + (b.constants.responseTypeParam + "token"), a = a.params || {};
            a.action = "login";
            a.url = c;
            var e = this, f = a.cb;
            f && delete a.cb;
            b.js.sdk.ui(a, function(a) {
                e.saveSession(a);
                f && f(a);
            });
        }
    };
    p.prototype.signUpRequest = function(a) {
        if (b.js.sdk.utils.getAuthType(this) !== b.constants.three_legged_oauth) alert("wrong authorization type!"); else {
            var a = a || {}, d = !1;
            "boolean" == typeof a.useSecure && (d = a.useSecure);
            var c = "", c = d ? c + b.sdk.url.https : c + b.sdk.url.http, c = c + this.authBaseURL, c = c + "/users/sign_up" + (b.constants.clientIdParam + this.oauthKey), a = a.params || {};
            a.action = "signup";
            a.url = c;
            var e = this, f = a.cb;
            f && delete a.cb;
            b.js.sdk.ui(a, function(a) {
                e.saveSession(a);
                f && f(a);
            });
        }
    };
    p.prototype.saveSession = function(a) {
        if (!a || !a.access_token) return this.authorized = !1;
        b.js.sdk.utils.setCookie(b.constants.accessToken, a.access_token);
        b.js.sdk.utils.setCookie(b.constants.expiresIn, a.expires_in);
        this.accessToken = a.access_token;
        this.expiresIn = a.expires_in;
        return this.authorized = !0;
    };
    p.prototype.getSession = function() {
        var a = {};
        a.access_token = b.js.sdk.utils.getCookie(b.constants.accessToken);
        a.expires_in = b.js.sdk.utils.getCookie(b.constants.expiresIn);
        if (!a.access_token) return this.authorized = !1;
        this.accessToken = a.access_token;
        this.expiresIn = a.expires_in;
        this.authorized = !0;
        return a;
    };
    p.prototype.clearSession = function() {
        b.js.sdk.utils.setCookie(b.constants.accessToken, "");
        b.js.sdk.utils.setCookie(b.constants.expiresIn, "");
        delete this.accessToken;
        delete this.expiresIn;
        this.authorized = !1;
    };
    p.prototype.checkStatus = function() {
        return this.getSession() ? !0 : !1;
    };
    b = void 0;
    b = {
        constants: {},
        js: {}
    };
    b.js.sdk = {};
    b.js.sdk.utils = {};
    b.sdk = {};
    b.sdk.url = {};
    b.sdk.url.http = "http://";
    b.sdk.url.https = "https://";
    b.sdk.url.baseURL = "api.cloud.appcelerator.com";
    b.sdk.url.authBaseURL = "secure-identity.cloud.appcelerator.com";
    b.sdk.url.version = "v1";
    b.constants.get_method = "GET";
    b.constants.post_method = "POST";
    b.constants.put_method = "PUT";
    b.constants.delete_method = "DELETE";
    b.constants.app_key = 1;
    b.constants.oauth = 2;
    b.constants.three_legged_oauth = 3;
    b.constants.unknown = -1;
    b.constants.keyParam = "?key=";
    b.constants.oauthKeyParam = "?oauth_consumer_key=";
    b.constants.clientIdParam = "?client_id=";
    b.constants.redirectUriParam = "&redirect_uri=";
    b.constants.responseTypeParam = "&response_type=";
    b.constants.accessToken = "access_token";
    b.constants.expiresIn = "expires_in";
    b.constants.appKey = "app_key";
    b.constants.json = "json";
    b.constants.sessionId = "_session_id";
    b.constants.sessionCookieName = "Cookie";
    b.constants.responseCookieName = "Set-Cookie";
    b.constants.file = "file";
    b.constants.suppressCode = "suppress_response_codes";
    b.constants.response_wrapper = "response_wrapper";
    b.constants.photo = "photo";
    b.constants.method = "_method";
    b.constants.name = "name";
    b.constants.value = "value";
    b.constants.oauth_header = "Authorization";
    b.constants.noAppKeyError = {
        meta: {
            status: "fail",
            code: 409,
            message: "Application key is not provided."
        }
    };
    b.constants.fileLoadError = {
        meta: {
            status: "fail",
            code: 400,
            message: "Unable to load file"
        }
    };
    b.js.sdk.utils.getSessionParams = function() {
        var a = null, d = b.js.sdk.utils.getCookie(b.constants.sessionId);
        d && (a = b.constants.sessionId + "=" + d);
        return a;
    };
    b.js.sdk.utils.cookieMap = [];
    b.js.sdk.utils.cookieMap[b.constants.sessionId] = "sessionId";
    b.js.sdk.utils.cookieMap[b.constants.accessToken] = "accessToken";
    b.js.sdk.utils.cookieMap[b.constants.expiresIn] = "expiresIn";
    b.js.sdk.utils.getCookie = function(a) {
        return (a = b.js.sdk.utils.cookieMap[a]) && k[a] || null;
    };
    b.js.sdk.utils.setCookie = function(a, d) {
        var c = b.js.sdk.utils.cookieMap[a];
        c && ("" === d ? delete k[c] : k[c] = d);
    };
    b.js.sdk.utils.deleteCookie = function(a) {
        (a = b.js.sdk.utils.cookieMap[a]) && delete k[a];
    };
    b.js.sdk.utils.getAuthType = function(a) {
        if (a) {
            if (a.isThreeLegged()) return b.constants.three_legged_oauth;
            if (a.appKey) return b.constants.app_key;
            if (a.oauthKey && a.oauthSecret) return b.constants.oauth;
        }
        return b.constants.unknown;
    };
    b.js.sdk.utils.getFileObject = function(a) {
        if (a) for (var d in a) if (a.hasOwnProperty(d) && (d == b.constants.photo || d == b.constants.file)) return a[d];
        return null;
    };
    b.js.sdk.utils.cleanInvalidData = function(a) {
        if (a) {
            for (var d in a) if (a.hasOwnProperty(d)) {
                null == a[d] && delete a[d];
                if ("object" == typeof a[d]) {
                    if (d == b.constants.photo || d == b.constants.file) continue;
                    a[d] = JSON.stringify(a[d]);
                }
                if (!0 === a[d] || !1 === a[d]) a[d] = a[d] ? 1 : 0;
            }
            return a;
        }
        return {};
    };
    b.js.sdk.utils.uploadMessageCallback = function(a) {
        return a && a.data ? JSON.parse(a.data) : {};
    };
    b.js.sdk.utils.getOAuthParameters = function(a) {
        var b = "";
        if (a) for (var a = e.getParameterList(a), c = 0; c < a.length; ++c) {
            var h = a[c], f = h[0];
            0 == f.indexOf("oauth_") && "oauth_token" != f && (b += "&" + e.percentEncode(f) + "=" + e.percentEncode(h[1]));
        }
        0 < b.length && (b = b.substring(1));
        return b;
    };
    b.js.sdk.utils.populateOAuthParameters = function(a, b) {
        a && b && (a.push([ "oauth_version", "1.0" ]), a.push([ "oauth_consumer_key", b ]), a.push([ "oauth_signature_method", "HMAC-SHA1" ]), a.push([ "oauth_nonce", e.nonce(15) ]));
    };
    b.js.sdk.utils.sendAppceleratorRequest = function(a, d, c, h, f, g) {
        var i = Ti.Network.createHTTPClient({
            timeout: 60000,
            onsendstream: function(b) {
                k.onsendstream && k.onsendstream({
                    url: a,
                    progress: b.progress
                });
            },
            ondatastream: function(b) {
                k.ondatastream && k.ondatastream({
                    url: a,
                    progress: b.progress
                });
            },
            onerror: function(a) {
                var b = {}, c = this.responseText;
                try {
                    (c = c.trim()) && 0 < c.length && (b = JSON.parse(c));
                } catch (d) {
                    b = d;
                }
                b.message || (b.message = a.error);
                b.error = !0;
                b.statusText = this.statusText;
                b.status = this.status;
                b.meta && (b.metaString = JSON.stringify(b.meta));
                f(b);
            },
            onload: function() {
                var a = JSON.parse(this.responseText);
                if (a && a.meta && (a.metaString = JSON.stringify(a.meta), a.meta.session_id)) {
                    var c = a.meta.session_id;
                    b.js.sdk.utils.setCookie(b.constants.sessionId, c);
                    g.session_id = c;
                }
                f(a);
            }
        }), m = a;
        if (d.toUpperCase() == b.constants.get_method || d.toUpperCase() == b.constants.delete_method) {
            var l = "", o;
            for (o in c) c.hasOwnProperty(o) && (l += "&" + o + "=" + e.percentEncode(c[o]));
            0 < l.length && (m = 0 < a.indexOf("?") ? m + l : m + ("?" + l.substring(1)), c = {});
        }
        k.debug && (Ti.API.info(d + ": " + m), Ti.API.info("header: " + JSON.stringify(h)), Ti.API.info("data: " + JSON.stringify(c)));
        i.open(d, m);
        "mobileweb" != Ti.Platform.osname && i.setRequestHeader("Accept-Encoding", "gzip,deflate");
        if (h) for (o in h) h.hasOwnProperty(o) && i.setRequestHeader(o, h[o]);
        i.send(c);
    };
    b.js.sdk.utils.decodeQS = function(a) {
        var b = decodeURIComponent, c = {}, a = a.split("&"), e, f;
        for (e = 0; e < a.length; e++) (f = a[e].split("=", 2)) && f[0] && (c[b(f[0])] = b(f[1]));
        return c;
    };
    b.js.sdk.utils.guid = function() {
        return "f" + (1073741824 * Math.random()).toString(16).replace(".", "");
    };
    b.js.sdk.utils.copy = function(a, b, c, e) {
        for (var f in b) if (c || "undefined" == typeof a[f]) a[f] = e ? e(b[f]) : b[f];
        return a;
    };
    var g = {
        session: null,
        fetchSetting: function(a, b) {
            var c, e = "production" == Ti.App.deployType.toLowerCase() ? "production" : "development";
            return (c = Ti.App.Properties.getString(a + "-" + e)) && "undefined" != c || (c = Ti.App.Properties.getString(a)) && "undefined" != c ? c : b;
        },
        fetchSession: function() {
            var a = g.fetchSetting("acs-api-key", null), d = g.fetchSetting("acs-base-url", b.sdk.url.baseURL), c = g.fetchSetting("acs-authbase-url", b.sdk.url.authBaseURL), e = g.fetchSetting("acs-oauth-key", null), f = g.fetchSetting("acs-oauth-secret", null);
            if (e && f) return new p(e, f, d, c);
            if (a) return new p(a, null, d, c);
            throw "ACS CREDENTIALS NOT SPECIFIED!";
        }
    };
    g.getSession = function() {
        null == g.session && (g.session = g.fetchSession());
        return g.session;
    };
    g.send = function(a, b, c, e, f) {
        g.getSession().sendRequest(a, b, c, e, f);
    };
    g.hasStoredSession = function() {
        return !!b.js.sdk.utils.getCookie(b.constants.sessionId);
    };
    g.retrieveStoredSession = function() {
        return b.js.sdk.utils.getCookie(b.constants.sessionId);
    };
    g.reset = function() {
        b.js.sdk.utils.deleteCookie(b.constants.sessionId);
        g.session && (g.session.clearSession(), g.session = null);
    };
    g.secureSend = function(a, b) {
        var c = g.getSession();
        c.useThreeLegged(!0);
        "secureCreate" === a ? c.signUpRequest(b) : "secureLogin" === a && c.sendAuthRequest(b);
    };
    g.checkStatus = function() {
        return g.getSession().checkStatus();
    };
    b.js.sdk.UIManager = {
        redirect_uri: "acsconnect://success",
        displayModal: function(a) {
            function d(a) {
                var i = /^acsconnect:\/\/([^#]*)#(.*)/.exec(decodeURIComponent(a.url));
                if (i && 3 == i.length) {
                    var k = null;
                    if ("success" == i[1]) k = b.js.sdk.utils.decodeQS(i[2]); else if ("cancel" != i[1]) return;
                    e.removeEventListener("beforeload", d);
                    e.removeEventListener("load", d);
                    g = k;
                    c && c.close();
                }
                f && "load" == a.type && (c.remove(f), f = null);
            }
            k.debug && Ti.API.info("ThreeLegged Request url: " + a.url);
            var c = Ti.UI.createWindow({
                modal: !0,
                title: a.params.title || "Appcelerator Cloud Service"
            }), e = Ti.UI.createWebView({
                url: a.url,
                scalesPageToFit: !1,
                showScrollbars: !0
            }), f = Ti.UI.createLabel({
                text: "Loading, please wait...",
                color: "black",
                width: Ti.UI.SIZE || "auto",
                height: Ti.UI.SIZE || "auto",
                zIndex: 100
            }), g;
            e.addEventListener("beforeload", d);
            e.addEventListener("load", d);
            c.addEventListener("close", function() {
                a && (a.cb && a.cb(g), e = c = f = a = g = null);
            });
            if ("android" != Ti.Platform.osname) {
                var i = Ti.UI.createButton({
                    title: "close",
                    width: "50%",
                    height: "20%"
                });
                i.addEventListener("click", function() {
                    c.close();
                });
                c.rightNavButton = i;
            }
            c.add(e);
            c.add(f);
            c.open();
        },
        processParams: function(a, d) {
            return {
                cb: d,
                url: a.url + b.constants.redirectUriParam + b.js.sdk.UIManager.redirect_uri,
                params: a
            };
        }
    };
    b.js.sdk.ui = function(a, d) {
        if ("mobileweb" === Ti.Platform.osname) alert("Three Legged OAuth is not currently supported on MobileWeb"); else if (a.action) {
            var c = b.js.sdk.UIManager.processParams(a, d);
            c && b.js.sdk.UIManager.displayModal(c);
        } else alert("\"action\" is a required parameter for com.cocoafish.js.sdk.ui().");
    };
    return k;
}

defineCloud(exports);