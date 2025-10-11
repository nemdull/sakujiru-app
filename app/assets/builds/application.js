(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: typeof console !== "undefined" ? console : void 0,
        WebSocket: typeof WebSocket !== "undefined" ? WebSocket : void 0
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => (/* @__PURE__ */ new Date()).getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordMessage() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        // Private
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(
            () => {
              this.reconnectIfStale();
              this.poll();
            },
            this.getPollInterval()
          );
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(
              () => {
                if (this.connectionIsStale() || !this.connection.isOpen()) {
                  logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                  this.connection.reopen();
                }
              },
              200
            );
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart",
          "remote": "remote"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            const socketProtocols = [...protocols, ...this.consumer.subprotocols || []];
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, socketProtocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isOpen()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error) {
              logger_default.log("Failed to reopen WebSocket", error);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        triedToReconnect() {
          return this.monitor.reconnectAttempts > 0;
        }
        // Private
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          this.monitor.recordMessage();
          switch (type) {
            case message_types.welcome:
              if (this.triedToReconnect()) {
                this.reconnectAttempted = true;
              }
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return null;
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              if (this.reconnectAttempted) {
                this.reconnectAttempted = false;
                return this.subscriptions.notify(identifier, "connected", { reconnected: true });
              } else {
                return this.subscriptions.notify(identifier, "connected", { reconnected: false });
              }
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        // Perform a channel action with the optional data passed as an attribute
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(
            () => {
              if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
                this.pendingSubscriptions.map((subscription) => {
                  logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                  this.subscriptions.subscribe(subscription);
                });
              }
            },
            500
          );
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      init_subscription_guarantor();
      init_logger();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        // Private
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s) => s.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
          this.subprotocols = [];
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
        addSubProtocol(subprotocol) {
          this.subprotocols = [...this.subprotocols, subprotocol];
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_subscription_guarantor();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/jquery/dist/jquery.js
  var require_jquery = __commonJS({
    "node_modules/jquery/dist/jquery.js"(exports, module) {
      (function(global, factory) {
        "use strict";
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
              throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
          };
        } else {
          factory(global);
        }
      })(typeof window !== "undefined" ? window : exports, function(window2, noGlobal) {
        "use strict";
        var arr = [];
        var getProto = Object.getPrototypeOf;
        var slice = arr.slice;
        var flat = arr.flat ? function(array) {
          return arr.flat.call(array);
        } : function(array) {
          return arr.concat.apply([], array);
        };
        var push = arr.push;
        var indexOf2 = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);
        var support = {};
        var isFunction = function isFunction2(obj) {
          return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
        };
        var isWindow = function isWindow2(obj) {
          return obj != null && obj === obj.window;
        };
        var document2 = window2.document;
        var preservedScriptAttributes = {
          type: true,
          src: true,
          nonce: true,
          noModule: true
        };
        function DOMEval(code, node, doc) {
          doc = doc || document2;
          var i, val, script = doc.createElement("script");
          script.text = code;
          if (node) {
            for (i in preservedScriptAttributes) {
              val = node[i] || node.getAttribute && node.getAttribute(i);
              if (val) {
                script.setAttribute(i, val);
              }
            }
          }
          doc.head.appendChild(script).parentNode.removeChild(script);
        }
        function toType(obj) {
          if (obj == null) {
            return obj + "";
          }
          return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        }
        var version = "3.6.0", jQuery2 = function(selector, context) {
          return new jQuery2.fn.init(selector, context);
        };
        jQuery2.fn = jQuery2.prototype = {
          // The current version of jQuery being used
          jquery: version,
          constructor: jQuery2,
          // The default length of a jQuery object is 0
          length: 0,
          toArray: function() {
            return slice.call(this);
          },
          // Get the Nth element in the matched element set OR
          // Get the whole matched element set as a clean array
          get: function(num) {
            if (num == null) {
              return slice.call(this);
            }
            return num < 0 ? this[num + this.length] : this[num];
          },
          // Take an array of elements and push it onto the stack
          // (returning the new matched element set)
          pushStack: function(elems) {
            var ret = jQuery2.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
          },
          // Execute a callback for every element in the matched set.
          each: function(callback) {
            return jQuery2.each(this, callback);
          },
          map: function(callback) {
            return this.pushStack(jQuery2.map(this, function(elem, i) {
              return callback.call(elem, i, elem);
            }));
          },
          slice: function() {
            return this.pushStack(slice.apply(this, arguments));
          },
          first: function() {
            return this.eq(0);
          },
          last: function() {
            return this.eq(-1);
          },
          even: function() {
            return this.pushStack(jQuery2.grep(this, function(_elem, i) {
              return (i + 1) % 2;
            }));
          },
          odd: function() {
            return this.pushStack(jQuery2.grep(this, function(_elem, i) {
              return i % 2;
            }));
          },
          eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
          },
          end: function() {
            return this.prevObject || this.constructor();
          },
          // For internal use only.
          // Behaves like an Array's method, not like a jQuery method.
          push,
          sort: arr.sort,
          splice: arr.splice
        };
        jQuery2.extend = jQuery2.fn.extend = function() {
          var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
          if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
          }
          if (typeof target !== "object" && !isFunction(target)) {
            target = {};
          }
          if (i === length) {
            target = this;
            i--;
          }
          for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
              for (name in options) {
                copy = options[name];
                if (name === "__proto__" || target === copy) {
                  continue;
                }
                if (deep && copy && (jQuery2.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                  src = target[name];
                  if (copyIsArray && !Array.isArray(src)) {
                    clone = [];
                  } else if (!copyIsArray && !jQuery2.isPlainObject(src)) {
                    clone = {};
                  } else {
                    clone = src;
                  }
                  copyIsArray = false;
                  target[name] = jQuery2.extend(deep, clone, copy);
                } else if (copy !== void 0) {
                  target[name] = copy;
                }
              }
            }
          }
          return target;
        };
        jQuery2.extend({
          // Unique for each copy of jQuery on the page
          expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
          // Assume jQuery is ready without the ready module
          isReady: true,
          error: function(msg) {
            throw new Error(msg);
          },
          noop: function() {
          },
          isPlainObject: function(obj) {
            var proto, Ctor;
            if (!obj || toString.call(obj) !== "[object Object]") {
              return false;
            }
            proto = getProto(obj);
            if (!proto) {
              return true;
            }
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
          },
          isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
              return false;
            }
            return true;
          },
          // Evaluates a script in a provided context; falls back to the global one
          // if not specified.
          globalEval: function(code, options, doc) {
            DOMEval(code, { nonce: options && options.nonce }, doc);
          },
          each: function(obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
              length = obj.length;
              for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            } else {
              for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            }
            return obj;
          },
          // results is for internal usage only
          makeArray: function(arr2, results) {
            var ret = results || [];
            if (arr2 != null) {
              if (isArrayLike(Object(arr2))) {
                jQuery2.merge(
                  ret,
                  typeof arr2 === "string" ? [arr2] : arr2
                );
              } else {
                push.call(ret, arr2);
              }
            }
            return ret;
          },
          inArray: function(elem, arr2, i) {
            return arr2 == null ? -1 : indexOf2.call(arr2, elem, i);
          },
          // Support: Android <=4.0 only, PhantomJS 1 only
          // push.apply(_, arraylike) throws on ancient WebKit
          merge: function(first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
              first[i++] = second[j];
            }
            first.length = i;
            return first;
          },
          grep: function(elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            for (; i < length; i++) {
              callbackInverse = !callback(elems[i], i);
              if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
              }
            }
            return matches;
          },
          // arg is for internal usage only
          map: function(elems, callback, arg) {
            var length, value, i = 0, ret = [];
            if (isArrayLike(elems)) {
              length = elems.length;
              for (; i < length; i++) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            } else {
              for (i in elems) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            }
            return flat(ret);
          },
          // A global GUID counter for objects
          guid: 1,
          // jQuery.support is not used in Core but other projects attach their
          // properties to it so it needs to exist.
          support
        });
        if (typeof Symbol === "function") {
          jQuery2.fn[Symbol.iterator] = arr[Symbol.iterator];
        }
        jQuery2.each(
          "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
          function(_i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
          }
        );
        function isArrayLike(obj) {
          var length = !!obj && "length" in obj && obj.length, type = toType(obj);
          if (isFunction(obj) || isWindow(obj)) {
            return false;
          }
          return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
        }
        var Sizzle = (
          /*!
           * Sizzle CSS Selector Engine v2.3.6
           * https://sizzlejs.com/
           *
           * Copyright JS Foundation and other contributors
           * Released under the MIT license
           * https://js.foundation/
           *
           * Date: 2021-02-16
           */
          (function(window3) {
            var i, support2, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document3, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + 1 * /* @__PURE__ */ new Date(), preferredDoc = window3.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
              if (a === b) {
                hasDuplicate = true;
              }
              return 0;
            }, hasOwn2 = {}.hasOwnProperty, arr2 = [], pop = arr2.pop, pushNative = arr2.push, push2 = arr2.push, slice2 = arr2.slice, indexOf3 = function(list, elem) {
              var i2 = 0, len = list.length;
              for (; i2 < len; i2++) {
                if (list[i2] === elem) {
                  return i2;
                }
              }
              return -1;
            }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
            "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5]
            // or strings [capture 3 or capture 4]"
            `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rtrim2 = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
              "ID": new RegExp("^#(" + identifier + ")"),
              "CLASS": new RegExp("^\\.(" + identifier + ")"),
              "TAG": new RegExp("^(" + identifier + "|[*])"),
              "ATTR": new RegExp("^" + attributes),
              "PSEUDO": new RegExp("^" + pseudos),
              "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
              "bool": new RegExp("^(?:" + booleans + ")$", "i"),
              // For use in libraries implementing .is()
              // We use this for POS matching in `select`
              "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
            }, rhtml2 = /HTML$/i, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
              var high = "0x" + escape.slice(1) - 65536;
              return nonHex ? (
                // Strip the backslash prefix from a non-hex escape sequence
                nonHex
              ) : (
                // Replace a hexadecimal escape sequence with the encoded Unicode code point
                // Support: IE <=11+
                // For values outside the Basic Multilingual Plane (BMP), manually construct a
                // surrogate pair
                high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320)
              );
            }, rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, fcssescape = function(ch, asCodePoint) {
              if (asCodePoint) {
                if (ch === "\0") {
                  return "\uFFFD";
                }
                return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
              }
              return "\\" + ch;
            }, unloadHandler = function() {
              setDocument();
            }, inDisabledFieldset = addCombinator(
              function(elem) {
                return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
              },
              { dir: "parentNode", next: "legend" }
            );
            try {
              push2.apply(
                arr2 = slice2.call(preferredDoc.childNodes),
                preferredDoc.childNodes
              );
              arr2[preferredDoc.childNodes.length].nodeType;
            } catch (e) {
              push2 = {
                apply: arr2.length ? (
                  // Leverage slice if possible
                  function(target, els) {
                    pushNative.apply(target, slice2.call(els));
                  }
                ) : (
                  // Support: IE<9
                  // Otherwise append directly
                  function(target, els) {
                    var j = target.length, i2 = 0;
                    while (target[j++] = els[i2++]) {
                    }
                    target.length = j - 1;
                  }
                )
              };
            }
            function Sizzle2(selector, context, results, seed) {
              var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
              results = results || [];
              if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
                return results;
              }
              if (!seed) {
                setDocument(context);
                context = context || document3;
                if (documentIsHTML) {
                  if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                    if (m = match[1]) {
                      if (nodeType === 9) {
                        if (elem = context.getElementById(m)) {
                          if (elem.id === m) {
                            results.push(elem);
                            return results;
                          }
                        } else {
                          return results;
                        }
                      } else {
                        if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                          results.push(elem);
                          return results;
                        }
                      }
                    } else if (match[2]) {
                      push2.apply(results, context.getElementsByTagName(selector));
                      return results;
                    } else if ((m = match[3]) && support2.getElementsByClassName && context.getElementsByClassName) {
                      push2.apply(results, context.getElementsByClassName(m));
                      return results;
                    }
                  }
                  if (support2.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && // Support: IE 8 only
                  // Exclude object elements
                  (nodeType !== 1 || context.nodeName.toLowerCase() !== "object")) {
                    newSelector = selector;
                    newContext = context;
                    if (nodeType === 1 && (rdescend.test(selector) || rcombinators.test(selector))) {
                      newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                      if (newContext !== context || !support2.scope) {
                        if (nid = context.getAttribute("id")) {
                          nid = nid.replace(rcssescape, fcssescape);
                        } else {
                          context.setAttribute("id", nid = expando);
                        }
                      }
                      groups = tokenize(selector);
                      i2 = groups.length;
                      while (i2--) {
                        groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                      }
                      newSelector = groups.join(",");
                    }
                    try {
                      push2.apply(
                        results,
                        newContext.querySelectorAll(newSelector)
                      );
                      return results;
                    } catch (qsaError) {
                      nonnativeSelectorCache(selector, true);
                    } finally {
                      if (nid === expando) {
                        context.removeAttribute("id");
                      }
                    }
                  }
                }
              }
              return select(selector.replace(rtrim2, "$1"), context, results, seed);
            }
            function createCache() {
              var keys = [];
              function cache2(key, value) {
                if (keys.push(key + " ") > Expr.cacheLength) {
                  delete cache2[keys.shift()];
                }
                return cache2[key + " "] = value;
              }
              return cache2;
            }
            function markFunction(fn) {
              fn[expando] = true;
              return fn;
            }
            function assert(fn) {
              var el = document3.createElement("fieldset");
              try {
                return !!fn(el);
              } catch (e) {
                return false;
              } finally {
                if (el.parentNode) {
                  el.parentNode.removeChild(el);
                }
                el = null;
              }
            }
            function addHandle(attrs, handler) {
              var arr3 = attrs.split("|"), i2 = arr3.length;
              while (i2--) {
                Expr.attrHandle[arr3[i2]] = handler;
              }
            }
            function siblingCheck(a, b) {
              var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;
              if (diff) {
                return diff;
              }
              if (cur) {
                while (cur = cur.nextSibling) {
                  if (cur === b) {
                    return -1;
                  }
                }
              }
              return a ? 1 : -1;
            }
            function createInputPseudo(type) {
              return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
              };
            }
            function createButtonPseudo(type) {
              return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
              };
            }
            function createDisabledPseudo(disabled) {
              return function(elem) {
                if ("form" in elem) {
                  if (elem.parentNode && elem.disabled === false) {
                    if ("label" in elem) {
                      if ("label" in elem.parentNode) {
                        return elem.parentNode.disabled === disabled;
                      } else {
                        return elem.disabled === disabled;
                      }
                    }
                    return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                    /* jshint -W018 */
                    elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
                  }
                  return elem.disabled === disabled;
                } else if ("label" in elem) {
                  return elem.disabled === disabled;
                }
                return false;
              };
            }
            function createPositionalPseudo(fn) {
              return markFunction(function(argument) {
                argument = +argument;
                return markFunction(function(seed, matches2) {
                  var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
                  while (i2--) {
                    if (seed[j = matchIndexes[i2]]) {
                      seed[j] = !(matches2[j] = seed[j]);
                    }
                  }
                });
              });
            }
            function testContext(context) {
              return context && typeof context.getElementsByTagName !== "undefined" && context;
            }
            support2 = Sizzle2.support = {};
            isXML = Sizzle2.isXML = function(elem) {
              var namespace = elem && elem.namespaceURI, docElem2 = elem && (elem.ownerDocument || elem).documentElement;
              return !rhtml2.test(namespace || docElem2 && docElem2.nodeName || "HTML");
            };
            setDocument = Sizzle2.setDocument = function(node) {
              var hasCompare, subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
              if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
                return document3;
              }
              document3 = doc;
              docElem = document3.documentElement;
              documentIsHTML = !isXML(document3);
              if (preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
                if (subWindow.addEventListener) {
                  subWindow.addEventListener("unload", unloadHandler, false);
                } else if (subWindow.attachEvent) {
                  subWindow.attachEvent("onunload", unloadHandler);
                }
              }
              support2.scope = assert(function(el) {
                docElem.appendChild(el).appendChild(document3.createElement("div"));
                return typeof el.querySelectorAll !== "undefined" && !el.querySelectorAll(":scope fieldset div").length;
              });
              support2.attributes = assert(function(el) {
                el.className = "i";
                return !el.getAttribute("className");
              });
              support2.getElementsByTagName = assert(function(el) {
                el.appendChild(document3.createComment(""));
                return !el.getElementsByTagName("*").length;
              });
              support2.getElementsByClassName = rnative.test(document3.getElementsByClassName);
              support2.getById = assert(function(el) {
                docElem.appendChild(el).id = expando;
                return !document3.getElementsByName || !document3.getElementsByName(expando).length;
              });
              if (support2.getById) {
                Expr.filter["ID"] = function(id) {
                  var attrId = id.replace(runescape, funescape);
                  return function(elem) {
                    return elem.getAttribute("id") === attrId;
                  };
                };
                Expr.find["ID"] = function(id, context) {
                  if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                    var elem = context.getElementById(id);
                    return elem ? [elem] : [];
                  }
                };
              } else {
                Expr.filter["ID"] = function(id) {
                  var attrId = id.replace(runescape, funescape);
                  return function(elem) {
                    var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                    return node2 && node2.value === attrId;
                  };
                };
                Expr.find["ID"] = function(id, context) {
                  if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                    var node2, i2, elems, elem = context.getElementById(id);
                    if (elem) {
                      node2 = elem.getAttributeNode("id");
                      if (node2 && node2.value === id) {
                        return [elem];
                      }
                      elems = context.getElementsByName(id);
                      i2 = 0;
                      while (elem = elems[i2++]) {
                        node2 = elem.getAttributeNode("id");
                        if (node2 && node2.value === id) {
                          return [elem];
                        }
                      }
                    }
                    return [];
                  }
                };
              }
              Expr.find["TAG"] = support2.getElementsByTagName ? function(tag, context) {
                if (typeof context.getElementsByTagName !== "undefined") {
                  return context.getElementsByTagName(tag);
                } else if (support2.qsa) {
                  return context.querySelectorAll(tag);
                }
              } : function(tag, context) {
                var elem, tmp = [], i2 = 0, results = context.getElementsByTagName(tag);
                if (tag === "*") {
                  while (elem = results[i2++]) {
                    if (elem.nodeType === 1) {
                      tmp.push(elem);
                    }
                  }
                  return tmp;
                }
                return results;
              };
              Expr.find["CLASS"] = support2.getElementsByClassName && function(className, context) {
                if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                  return context.getElementsByClassName(className);
                }
              };
              rbuggyMatches = [];
              rbuggyQSA = [];
              if (support2.qsa = rnative.test(document3.querySelectorAll)) {
                assert(function(el) {
                  var input;
                  docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>";
                  if (el.querySelectorAll("[msallowcapture^='']").length) {
                    rbuggyQSA.push("[*^$]=" + whitespace + `*(?:''|"")`);
                  }
                  if (!el.querySelectorAll("[selected]").length) {
                    rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                  }
                  if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
                    rbuggyQSA.push("~=");
                  }
                  input = document3.createElement("input");
                  input.setAttribute("name", "");
                  el.appendChild(input);
                  if (!el.querySelectorAll("[name='']").length) {
                    rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
                  }
                  if (!el.querySelectorAll(":checked").length) {
                    rbuggyQSA.push(":checked");
                  }
                  if (!el.querySelectorAll("a#" + expando + "+*").length) {
                    rbuggyQSA.push(".#.+[+~]");
                  }
                  el.querySelectorAll("\\\f");
                  rbuggyQSA.push("[\\r\\n\\f]");
                });
                assert(function(el) {
                  el.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                  var input = document3.createElement("input");
                  input.setAttribute("type", "hidden");
                  el.appendChild(input).setAttribute("name", "D");
                  if (el.querySelectorAll("[name=d]").length) {
                    rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                  }
                  if (el.querySelectorAll(":enabled").length !== 2) {
                    rbuggyQSA.push(":enabled", ":disabled");
                  }
                  docElem.appendChild(el).disabled = true;
                  if (el.querySelectorAll(":disabled").length !== 2) {
                    rbuggyQSA.push(":enabled", ":disabled");
                  }
                  el.querySelectorAll("*,:x");
                  rbuggyQSA.push(",.*:");
                });
              }
              if (support2.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
                assert(function(el) {
                  support2.disconnectedMatch = matches.call(el, "*");
                  matches.call(el, "[s!='']:x");
                  rbuggyMatches.push("!=", pseudos);
                });
              }
              rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
              rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
              hasCompare = rnative.test(docElem.compareDocumentPosition);
              contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
              } : function(a, b) {
                if (b) {
                  while (b = b.parentNode) {
                    if (b === a) {
                      return true;
                    }
                  }
                }
                return false;
              };
              sortOrder = hasCompare ? function(a, b) {
                if (a === b) {
                  hasDuplicate = true;
                  return 0;
                }
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                if (compare) {
                  return compare;
                }
                compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
                  // Otherwise we know they are disconnected
                  1
                );
                if (compare & 1 || !support2.sortDetached && b.compareDocumentPosition(a) === compare) {
                  if (a == document3 || a.ownerDocument == preferredDoc && contains(preferredDoc, a)) {
                    return -1;
                  }
                  if (b == document3 || b.ownerDocument == preferredDoc && contains(preferredDoc, b)) {
                    return 1;
                  }
                  return sortInput ? indexOf3(sortInput, a) - indexOf3(sortInput, b) : 0;
                }
                return compare & 4 ? -1 : 1;
              } : function(a, b) {
                if (a === b) {
                  hasDuplicate = true;
                  return 0;
                }
                var cur, i2 = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
                if (!aup || !bup) {
                  return a == document3 ? -1 : b == document3 ? 1 : (
                    /* eslint-enable eqeqeq */
                    aup ? -1 : bup ? 1 : sortInput ? indexOf3(sortInput, a) - indexOf3(sortInput, b) : 0
                  );
                } else if (aup === bup) {
                  return siblingCheck(a, b);
                }
                cur = a;
                while (cur = cur.parentNode) {
                  ap.unshift(cur);
                }
                cur = b;
                while (cur = cur.parentNode) {
                  bp.unshift(cur);
                }
                while (ap[i2] === bp[i2]) {
                  i2++;
                }
                return i2 ? (
                  // Do a sibling check if the nodes have a common ancestor
                  siblingCheck(ap[i2], bp[i2])
                ) : (
                  // Otherwise nodes in our document sort first
                  // Support: IE 11+, Edge 17 - 18+
                  // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
                  // two documents; shallow comparisons work.
                  /* eslint-disable eqeqeq */
                  ap[i2] == preferredDoc ? -1 : bp[i2] == preferredDoc ? 1 : (
                    /* eslint-enable eqeqeq */
                    0
                  )
                );
              };
              return document3;
            };
            Sizzle2.matches = function(expr, elements) {
              return Sizzle2(expr, null, null, elements);
            };
            Sizzle2.matchesSelector = function(elem, expr) {
              setDocument(elem);
              if (support2.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
                try {
                  var ret = matches.call(elem, expr);
                  if (ret || support2.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                  // fragment in IE 9
                  elem.document && elem.document.nodeType !== 11) {
                    return ret;
                  }
                } catch (e) {
                  nonnativeSelectorCache(expr, true);
                }
              }
              return Sizzle2(expr, document3, null, [elem]).length > 0;
            };
            Sizzle2.contains = function(context, elem) {
              if ((context.ownerDocument || context) != document3) {
                setDocument(context);
              }
              return contains(context, elem);
            };
            Sizzle2.attr = function(elem, name) {
              if ((elem.ownerDocument || elem) != document3) {
                setDocument(elem);
              }
              var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn2.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
              return val !== void 0 ? val : support2.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
            };
            Sizzle2.escape = function(sel) {
              return (sel + "").replace(rcssescape, fcssescape);
            };
            Sizzle2.error = function(msg) {
              throw new Error("Syntax error, unrecognized expression: " + msg);
            };
            Sizzle2.uniqueSort = function(results) {
              var elem, duplicates = [], j = 0, i2 = 0;
              hasDuplicate = !support2.detectDuplicates;
              sortInput = !support2.sortStable && results.slice(0);
              results.sort(sortOrder);
              if (hasDuplicate) {
                while (elem = results[i2++]) {
                  if (elem === results[i2]) {
                    j = duplicates.push(i2);
                  }
                }
                while (j--) {
                  results.splice(duplicates[j], 1);
                }
              }
              sortInput = null;
              return results;
            };
            getText = Sizzle2.getText = function(elem) {
              var node, ret = "", i2 = 0, nodeType = elem.nodeType;
              if (!nodeType) {
                while (node = elem[i2++]) {
                  ret += getText(node);
                }
              } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof elem.textContent === "string") {
                  return elem.textContent;
                } else {
                  for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText(elem);
                  }
                }
              } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
              }
              return ret;
            };
            Expr = Sizzle2.selectors = {
              // Can be adjusted by the user
              cacheLength: 50,
              createPseudo: markFunction,
              match: matchExpr,
              attrHandle: {},
              find: {},
              relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
              },
              preFilter: {
                "ATTR": function(match) {
                  match[1] = match[1].replace(runescape, funescape);
                  match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                  if (match[2] === "~=") {
                    match[3] = " " + match[3] + " ";
                  }
                  return match.slice(0, 4);
                },
                "CHILD": function(match) {
                  match[1] = match[1].toLowerCase();
                  if (match[1].slice(0, 3) === "nth") {
                    if (!match[3]) {
                      Sizzle2.error(match[0]);
                    }
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                    match[5] = +(match[7] + match[8] || match[3] === "odd");
                  } else if (match[3]) {
                    Sizzle2.error(match[0]);
                  }
                  return match;
                },
                "PSEUDO": function(match) {
                  var excess, unquoted = !match[6] && match[2];
                  if (matchExpr["CHILD"].test(match[0])) {
                    return null;
                  }
                  if (match[3]) {
                    match[2] = match[4] || match[5] || "";
                  } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
                  (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
                  (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                    match[0] = match[0].slice(0, excess);
                    match[2] = unquoted.slice(0, excess);
                  }
                  return match.slice(0, 3);
                }
              },
              filter: {
                "TAG": function(nodeNameSelector) {
                  var nodeName2 = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                  return nodeNameSelector === "*" ? function() {
                    return true;
                  } : function(elem) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName2;
                  };
                },
                "CLASS": function(className) {
                  var pattern = classCache[className + " "];
                  return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(
                    className,
                    function(elem) {
                      return pattern.test(
                        typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                      );
                    }
                  );
                },
                "ATTR": function(name, operator, check) {
                  return function(elem) {
                    var result = Sizzle2.attr(elem, name);
                    if (result == null) {
                      return operator === "!=";
                    }
                    if (!operator) {
                      return true;
                    }
                    result += "";
                    return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
                  };
                },
                "CHILD": function(type, what, _argument, first, last) {
                  var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                  return first === 1 && last === 0 ? (
                    // Shortcut for :nth-*(n)
                    function(elem) {
                      return !!elem.parentNode;
                    }
                  ) : function(elem, _context, xml) {
                    var cache2, uniqueCache, outerCache, node, nodeIndex, start3, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                    if (parent) {
                      if (simple) {
                        while (dir2) {
                          node = elem;
                          while (node = node[dir2]) {
                            if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                              return false;
                            }
                          }
                          start3 = dir2 = type === "only" && !start3 && "nextSibling";
                        }
                        return true;
                      }
                      start3 = [forward ? parent.firstChild : parent.lastChild];
                      if (forward && useCache) {
                        node = parent;
                        outerCache = node[expando] || (node[expando] = {});
                        uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                        cache2 = uniqueCache[type] || [];
                        nodeIndex = cache2[0] === dirruns && cache2[1];
                        diff = nodeIndex && cache2[2];
                        node = nodeIndex && parent.childNodes[nodeIndex];
                        while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                        (diff = nodeIndex = 0) || start3.pop()) {
                          if (node.nodeType === 1 && ++diff && node === elem) {
                            uniqueCache[type] = [dirruns, nodeIndex, diff];
                            break;
                          }
                        }
                      } else {
                        if (useCache) {
                          node = elem;
                          outerCache = node[expando] || (node[expando] = {});
                          uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                          cache2 = uniqueCache[type] || [];
                          nodeIndex = cache2[0] === dirruns && cache2[1];
                          diff = nodeIndex;
                        }
                        if (diff === false) {
                          while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start3.pop()) {
                            if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                              if (useCache) {
                                outerCache = node[expando] || (node[expando] = {});
                                uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                                uniqueCache[type] = [dirruns, diff];
                              }
                              if (node === elem) {
                                break;
                              }
                            }
                          }
                        }
                      }
                      diff -= last;
                      return diff === first || diff % first === 0 && diff / first >= 0;
                    }
                  };
                },
                "PSEUDO": function(pseudo, argument) {
                  var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle2.error("unsupported pseudo: " + pseudo);
                  if (fn[expando]) {
                    return fn(argument);
                  }
                  if (fn.length > 1) {
                    args = [pseudo, pseudo, "", argument];
                    return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                      var idx, matched = fn(seed, argument), i2 = matched.length;
                      while (i2--) {
                        idx = indexOf3(seed, matched[i2]);
                        seed[idx] = !(matches2[idx] = matched[i2]);
                      }
                    }) : function(elem) {
                      return fn(elem, 0, args);
                    };
                  }
                  return fn;
                }
              },
              pseudos: {
                // Potentially complex pseudos
                "not": markFunction(function(selector) {
                  var input = [], results = [], matcher = compile(selector.replace(rtrim2, "$1"));
                  return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                    var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                    while (i2--) {
                      if (elem = unmatched[i2]) {
                        seed[i2] = !(matches2[i2] = elem);
                      }
                    }
                  }) : function(elem, _context, xml) {
                    input[0] = elem;
                    matcher(input, null, xml, results);
                    input[0] = null;
                    return !results.pop();
                  };
                }),
                "has": markFunction(function(selector) {
                  return function(elem) {
                    return Sizzle2(selector, elem).length > 0;
                  };
                }),
                "contains": markFunction(function(text) {
                  text = text.replace(runescape, funescape);
                  return function(elem) {
                    return (elem.textContent || getText(elem)).indexOf(text) > -1;
                  };
                }),
                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                "lang": markFunction(function(lang) {
                  if (!ridentifier.test(lang || "")) {
                    Sizzle2.error("unsupported lang: " + lang);
                  }
                  lang = lang.replace(runescape, funescape).toLowerCase();
                  return function(elem) {
                    var elemLang;
                    do {
                      if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                        elemLang = elemLang.toLowerCase();
                        return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                      }
                    } while ((elem = elem.parentNode) && elem.nodeType === 1);
                    return false;
                  };
                }),
                // Miscellaneous
                "target": function(elem) {
                  var hash = window3.location && window3.location.hash;
                  return hash && hash.slice(1) === elem.id;
                },
                "root": function(elem) {
                  return elem === docElem;
                },
                "focus": function(elem) {
                  return elem === document3.activeElement && (!document3.hasFocus || document3.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                // Boolean properties
                "enabled": createDisabledPseudo(false),
                "disabled": createDisabledPseudo(true),
                "checked": function(elem) {
                  var nodeName2 = elem.nodeName.toLowerCase();
                  return nodeName2 === "input" && !!elem.checked || nodeName2 === "option" && !!elem.selected;
                },
                "selected": function(elem) {
                  if (elem.parentNode) {
                    elem.parentNode.selectedIndex;
                  }
                  return elem.selected === true;
                },
                // Contents
                "empty": function(elem) {
                  for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeType < 6) {
                      return false;
                    }
                  }
                  return true;
                },
                "parent": function(elem) {
                  return !Expr.pseudos["empty"](elem);
                },
                // Element/input types
                "header": function(elem) {
                  return rheader.test(elem.nodeName);
                },
                "input": function(elem) {
                  return rinputs.test(elem.nodeName);
                },
                "button": function(elem) {
                  var name = elem.nodeName.toLowerCase();
                  return name === "input" && elem.type === "button" || name === "button";
                },
                "text": function(elem) {
                  var attr;
                  return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && // Support: IE<8
                  // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                  ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
                },
                // Position-in-collection
                "first": createPositionalPseudo(function() {
                  return [0];
                }),
                "last": createPositionalPseudo(function(_matchIndexes, length) {
                  return [length - 1];
                }),
                "eq": createPositionalPseudo(function(_matchIndexes, length, argument) {
                  return [argument < 0 ? argument + length : argument];
                }),
                "even": createPositionalPseudo(function(matchIndexes, length) {
                  var i2 = 0;
                  for (; i2 < length; i2 += 2) {
                    matchIndexes.push(i2);
                  }
                  return matchIndexes;
                }),
                "odd": createPositionalPseudo(function(matchIndexes, length) {
                  var i2 = 1;
                  for (; i2 < length; i2 += 2) {
                    matchIndexes.push(i2);
                  }
                  return matchIndexes;
                }),
                "lt": createPositionalPseudo(function(matchIndexes, length, argument) {
                  var i2 = argument < 0 ? argument + length : argument > length ? length : argument;
                  for (; --i2 >= 0; ) {
                    matchIndexes.push(i2);
                  }
                  return matchIndexes;
                }),
                "gt": createPositionalPseudo(function(matchIndexes, length, argument) {
                  var i2 = argument < 0 ? argument + length : argument;
                  for (; ++i2 < length; ) {
                    matchIndexes.push(i2);
                  }
                  return matchIndexes;
                })
              }
            };
            Expr.pseudos["nth"] = Expr.pseudos["eq"];
            for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
              Expr.pseudos[i] = createInputPseudo(i);
            }
            for (i in { submit: true, reset: true }) {
              Expr.pseudos[i] = createButtonPseudo(i);
            }
            function setFilters() {
            }
            setFilters.prototype = Expr.filters = Expr.pseudos;
            Expr.setFilters = new setFilters();
            tokenize = Sizzle2.tokenize = function(selector, parseOnly) {
              var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
              if (cached) {
                return parseOnly ? 0 : cached.slice(0);
              }
              soFar = selector;
              groups = [];
              preFilters = Expr.preFilter;
              while (soFar) {
                if (!matched || (match = rcomma.exec(soFar))) {
                  if (match) {
                    soFar = soFar.slice(match[0].length) || soFar;
                  }
                  groups.push(tokens = []);
                }
                matched = false;
                if (match = rcombinators.exec(soFar)) {
                  matched = match.shift();
                  tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace(rtrim2, " ")
                  });
                  soFar = soFar.slice(matched.length);
                }
                for (type in Expr.filter) {
                  if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                    matched = match.shift();
                    tokens.push({
                      value: matched,
                      type,
                      matches: match
                    });
                    soFar = soFar.slice(matched.length);
                  }
                }
                if (!matched) {
                  break;
                }
              }
              return parseOnly ? soFar.length : soFar ? Sizzle2.error(selector) : (
                // Cache the tokens
                tokenCache(selector, groups).slice(0)
              );
            };
            function toSelector(tokens) {
              var i2 = 0, len = tokens.length, selector = "";
              for (; i2 < len; i2++) {
                selector += tokens[i2].value;
              }
              return selector;
            }
            function addCombinator(matcher, combinator, base) {
              var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
              return combinator.first ? (
                // Check against closest ancestor/preceding element
                function(elem, context, xml) {
                  while (elem = elem[dir2]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      return matcher(elem, context, xml);
                    }
                  }
                  return false;
                }
              ) : (
                // Check against all ancestor/preceding elements
                function(elem, context, xml) {
                  var oldCache, uniqueCache, outerCache, newCache = [dirruns, doneName];
                  if (xml) {
                    while (elem = elem[dir2]) {
                      if (elem.nodeType === 1 || checkNonElements) {
                        if (matcher(elem, context, xml)) {
                          return true;
                        }
                      }
                    }
                  } else {
                    while (elem = elem[dir2]) {
                      if (elem.nodeType === 1 || checkNonElements) {
                        outerCache = elem[expando] || (elem[expando] = {});
                        uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});
                        if (skip && skip === elem.nodeName.toLowerCase()) {
                          elem = elem[dir2] || elem;
                        } else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                          return newCache[2] = oldCache[2];
                        } else {
                          uniqueCache[key] = newCache;
                          if (newCache[2] = matcher(elem, context, xml)) {
                            return true;
                          }
                        }
                      }
                    }
                  }
                  return false;
                }
              );
            }
            function elementMatcher(matchers) {
              return matchers.length > 1 ? function(elem, context, xml) {
                var i2 = matchers.length;
                while (i2--) {
                  if (!matchers[i2](elem, context, xml)) {
                    return false;
                  }
                }
                return true;
              } : matchers[0];
            }
            function multipleContexts(selector, contexts, results) {
              var i2 = 0, len = contexts.length;
              for (; i2 < len; i2++) {
                Sizzle2(selector, contexts[i2], results);
              }
              return results;
            }
            function condense(unmatched, map, filter, context, xml) {
              var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
              for (; i2 < len; i2++) {
                if (elem = unmatched[i2]) {
                  if (!filter || filter(elem, context, xml)) {
                    newUnmatched.push(elem);
                    if (mapped) {
                      map.push(i2);
                    }
                  }
                }
              }
              return newUnmatched;
            }
            function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
              if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
              }
              if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
              }
              return markFunction(function(seed, results, context, xml) {
                var temp, i2, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
                  selector || "*",
                  context.nodeType ? [context] : context,
                  []
                ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? (
                  // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                  postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                    // ...intermediate processing is necessary
                    []
                  ) : (
                    // ...otherwise use results directly
                    results
                  )
                ) : matcherIn;
                if (matcher) {
                  matcher(matcherIn, matcherOut, context, xml);
                }
                if (postFilter) {
                  temp = condense(matcherOut, postMap);
                  postFilter(temp, [], context, xml);
                  i2 = temp.length;
                  while (i2--) {
                    if (elem = temp[i2]) {
                      matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                    }
                  }
                }
                if (seed) {
                  if (postFinder || preFilter) {
                    if (postFinder) {
                      temp = [];
                      i2 = matcherOut.length;
                      while (i2--) {
                        if (elem = matcherOut[i2]) {
                          temp.push(matcherIn[i2] = elem);
                        }
                      }
                      postFinder(null, matcherOut = [], temp, xml);
                    }
                    i2 = matcherOut.length;
                    while (i2--) {
                      if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf3(seed, elem) : preMap[i2]) > -1) {
                        seed[temp] = !(results[temp] = elem);
                      }
                    }
                  }
                } else {
                  matcherOut = condense(
                    matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
                  );
                  if (postFinder) {
                    postFinder(null, results, matcherOut, xml);
                  } else {
                    push2.apply(results, matcherOut);
                  }
                }
              });
            }
            function matcherFromTokens(tokens) {
              var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
                return elem === checkContext;
              }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
                return indexOf3(checkContext, elem) > -1;
              }, implicitRelative, true), matchers = [function(elem, context, xml) {
                var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                checkContext = null;
                return ret;
              }];
              for (; i2 < len; i2++) {
                if (matcher = Expr.relative[tokens[i2].type]) {
                  matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                  matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
                  if (matcher[expando]) {
                    j = ++i2;
                    for (; j < len; j++) {
                      if (Expr.relative[tokens[j].type]) {
                        break;
                      }
                    }
                    return setMatcher(
                      i2 > 1 && elementMatcher(matchers),
                      i2 > 1 && toSelector(
                        // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                        tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                      ).replace(rtrim2, "$1"),
                      matcher,
                      i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                      j < len && matcherFromTokens(tokens = tokens.slice(j)),
                      j < len && toSelector(tokens)
                    );
                  }
                  matchers.push(matcher);
                }
              }
              return elementMatcher(matchers);
            }
            function matcherFromGroupMatchers(elementMatchers, setMatchers) {
              var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
                var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find["TAG"]("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
                if (outermost) {
                  outermostContext = context == document3 || context || outermost;
                }
                for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
                  if (byElement && elem) {
                    j = 0;
                    if (!context && elem.ownerDocument != document3) {
                      setDocument(elem);
                      xml = !documentIsHTML;
                    }
                    while (matcher = elementMatchers[j++]) {
                      if (matcher(elem, context || document3, xml)) {
                        results.push(elem);
                        break;
                      }
                    }
                    if (outermost) {
                      dirruns = dirrunsUnique;
                    }
                  }
                  if (bySet) {
                    if (elem = !matcher && elem) {
                      matchedCount--;
                    }
                    if (seed) {
                      unmatched.push(elem);
                    }
                  }
                }
                matchedCount += i2;
                if (bySet && i2 !== matchedCount) {
                  j = 0;
                  while (matcher = setMatchers[j++]) {
                    matcher(unmatched, setMatched, context, xml);
                  }
                  if (seed) {
                    if (matchedCount > 0) {
                      while (i2--) {
                        if (!(unmatched[i2] || setMatched[i2])) {
                          setMatched[i2] = pop.call(results);
                        }
                      }
                    }
                    setMatched = condense(setMatched);
                  }
                  push2.apply(results, setMatched);
                  if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                    Sizzle2.uniqueSort(results);
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                  outermostContext = contextBackup;
                }
                return unmatched;
              };
              return bySet ? markFunction(superMatcher) : superMatcher;
            }
            compile = Sizzle2.compile = function(selector, match) {
              var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
              if (!cached) {
                if (!match) {
                  match = tokenize(selector);
                }
                i2 = match.length;
                while (i2--) {
                  cached = matcherFromTokens(match[i2]);
                  if (cached[expando]) {
                    setMatchers.push(cached);
                  } else {
                    elementMatchers.push(cached);
                  }
                }
                cached = compilerCache(
                  selector,
                  matcherFromGroupMatchers(elementMatchers, setMatchers)
                );
                cached.selector = selector;
              }
              return cached;
            };
            select = Sizzle2.select = function(selector, context, results, seed) {
              var i2, tokens, token, type, find, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
              results = results || [];
              if (match.length === 1) {
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                  context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                  if (!context) {
                    return results;
                  } else if (compiled) {
                    context = context.parentNode;
                  }
                  selector = selector.slice(tokens.shift().value.length);
                }
                i2 = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                while (i2--) {
                  token = tokens[i2];
                  if (Expr.relative[type = token.type]) {
                    break;
                  }
                  if (find = Expr.find[type]) {
                    if (seed = find(
                      token.matches[0].replace(runescape, funescape),
                      rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                    )) {
                      tokens.splice(i2, 1);
                      selector = seed.length && toSelector(tokens);
                      if (!selector) {
                        push2.apply(results, seed);
                        return results;
                      }
                      break;
                    }
                  }
                }
              }
              (compiled || compile(selector, match))(
                seed,
                context,
                !documentIsHTML,
                results,
                !context || rsibling.test(selector) && testContext(context.parentNode) || context
              );
              return results;
            };
            support2.sortStable = expando.split("").sort(sortOrder).join("") === expando;
            support2.detectDuplicates = !!hasDuplicate;
            setDocument();
            support2.sortDetached = assert(function(el) {
              return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
            });
            if (!assert(function(el) {
              el.innerHTML = "<a href='#'></a>";
              return el.firstChild.getAttribute("href") === "#";
            })) {
              addHandle("type|href|height|width", function(elem, name, isXML2) {
                if (!isXML2) {
                  return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                }
              });
            }
            if (!support2.attributes || !assert(function(el) {
              el.innerHTML = "<input/>";
              el.firstChild.setAttribute("value", "");
              return el.firstChild.getAttribute("value") === "";
            })) {
              addHandle("value", function(elem, _name, isXML2) {
                if (!isXML2 && elem.nodeName.toLowerCase() === "input") {
                  return elem.defaultValue;
                }
              });
            }
            if (!assert(function(el) {
              return el.getAttribute("disabled") == null;
            })) {
              addHandle(booleans, function(elem, name, isXML2) {
                var val;
                if (!isXML2) {
                  return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                }
              });
            }
            return Sizzle2;
          })(window2)
        );
        jQuery2.find = Sizzle;
        jQuery2.expr = Sizzle.selectors;
        jQuery2.expr[":"] = jQuery2.expr.pseudos;
        jQuery2.uniqueSort = jQuery2.unique = Sizzle.uniqueSort;
        jQuery2.text = Sizzle.getText;
        jQuery2.isXMLDoc = Sizzle.isXML;
        jQuery2.contains = Sizzle.contains;
        jQuery2.escapeSelector = Sizzle.escape;
        var dir = function(elem, dir2, until) {
          var matched = [], truncate = until !== void 0;
          while ((elem = elem[dir2]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
              if (truncate && jQuery2(elem).is(until)) {
                break;
              }
              matched.push(elem);
            }
          }
          return matched;
        };
        var siblings = function(n, elem) {
          var matched = [];
          for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
              matched.push(n);
            }
          }
          return matched;
        };
        var rneedsContext = jQuery2.expr.match.needsContext;
        function nodeName(elem, name) {
          return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        }
        var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function winnow(elements, qualifier, not) {
          if (isFunction(qualifier)) {
            return jQuery2.grep(elements, function(elem, i) {
              return !!qualifier.call(elem, i, elem) !== not;
            });
          }
          if (qualifier.nodeType) {
            return jQuery2.grep(elements, function(elem) {
              return elem === qualifier !== not;
            });
          }
          if (typeof qualifier !== "string") {
            return jQuery2.grep(elements, function(elem) {
              return indexOf2.call(qualifier, elem) > -1 !== not;
            });
          }
          return jQuery2.filter(qualifier, elements, not);
        }
        jQuery2.filter = function(expr, elems, not) {
          var elem = elems[0];
          if (not) {
            expr = ":not(" + expr + ")";
          }
          if (elems.length === 1 && elem.nodeType === 1) {
            return jQuery2.find.matchesSelector(elem, expr) ? [elem] : [];
          }
          return jQuery2.find.matches(expr, jQuery2.grep(elems, function(elem2) {
            return elem2.nodeType === 1;
          }));
        };
        jQuery2.fn.extend({
          find: function(selector) {
            var i, ret, len = this.length, self2 = this;
            if (typeof selector !== "string") {
              return this.pushStack(jQuery2(selector).filter(function() {
                for (i = 0; i < len; i++) {
                  if (jQuery2.contains(self2[i], this)) {
                    return true;
                  }
                }
              }));
            }
            ret = this.pushStack([]);
            for (i = 0; i < len; i++) {
              jQuery2.find(selector, self2[i], ret);
            }
            return len > 1 ? jQuery2.uniqueSort(ret) : ret;
          },
          filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false));
          },
          not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true));
          },
          is: function(selector) {
            return !!winnow(
              this,
              // If this is a positional/relative selector, check membership in the returned set
              // so $("p:first").is("p:last") won't return true for a doc with two "p".
              typeof selector === "string" && rneedsContext.test(selector) ? jQuery2(selector) : selector || [],
              false
            ).length;
          }
        });
        var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery2.fn.init = function(selector, context, root) {
          var match, elem;
          if (!selector) {
            return this;
          }
          root = root || rootjQuery;
          if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
              match = [null, selector, null];
            } else {
              match = rquickExpr.exec(selector);
            }
            if (match && (match[1] || !context)) {
              if (match[1]) {
                context = context instanceof jQuery2 ? context[0] : context;
                jQuery2.merge(this, jQuery2.parseHTML(
                  match[1],
                  context && context.nodeType ? context.ownerDocument || context : document2,
                  true
                ));
                if (rsingleTag.test(match[1]) && jQuery2.isPlainObject(context)) {
                  for (match in context) {
                    if (isFunction(this[match])) {
                      this[match](context[match]);
                    } else {
                      this.attr(match, context[match]);
                    }
                  }
                }
                return this;
              } else {
                elem = document2.getElementById(match[2]);
                if (elem) {
                  this[0] = elem;
                  this.length = 1;
                }
                return this;
              }
            } else if (!context || context.jquery) {
              return (context || root).find(selector);
            } else {
              return this.constructor(context).find(selector);
            }
          } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
          } else if (isFunction(selector)) {
            return root.ready !== void 0 ? root.ready(selector) : (
              // Execute immediately if ready is not present
              selector(jQuery2)
            );
          }
          return jQuery2.makeArray(selector, this);
        };
        init.prototype = jQuery2.fn;
        rootjQuery = jQuery2(document2);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
          children: true,
          contents: true,
          next: true,
          prev: true
        };
        jQuery2.fn.extend({
          has: function(target) {
            var targets = jQuery2(target, this), l = targets.length;
            return this.filter(function() {
              var i = 0;
              for (; i < l; i++) {
                if (jQuery2.contains(this, targets[i])) {
                  return true;
                }
              }
            });
          },
          closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery2(selectors);
            if (!rneedsContext.test(selectors)) {
              for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                  if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                    // Don't pass non-elements to Sizzle
                    cur.nodeType === 1 && jQuery2.find.matchesSelector(cur, selectors)
                  ))) {
                    matched.push(cur);
                    break;
                  }
                }
              }
            }
            return this.pushStack(matched.length > 1 ? jQuery2.uniqueSort(matched) : matched);
          },
          // Determine the position of an element within the set
          index: function(elem) {
            if (!elem) {
              return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
              return indexOf2.call(jQuery2(elem), this[0]);
            }
            return indexOf2.call(
              this,
              // If it receives a jQuery object, the first element is used
              elem.jquery ? elem[0] : elem
            );
          },
          add: function(selector, context) {
            return this.pushStack(
              jQuery2.uniqueSort(
                jQuery2.merge(this.get(), jQuery2(selector, context))
              )
            );
          },
          addBack: function(selector) {
            return this.add(
              selector == null ? this.prevObject : this.prevObject.filter(selector)
            );
          }
        });
        function sibling(cur, dir2) {
          while ((cur = cur[dir2]) && cur.nodeType !== 1) {
          }
          return cur;
        }
        jQuery2.each({
          parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
          },
          parents: function(elem) {
            return dir(elem, "parentNode");
          },
          parentsUntil: function(elem, _i, until) {
            return dir(elem, "parentNode", until);
          },
          next: function(elem) {
            return sibling(elem, "nextSibling");
          },
          prev: function(elem) {
            return sibling(elem, "previousSibling");
          },
          nextAll: function(elem) {
            return dir(elem, "nextSibling");
          },
          prevAll: function(elem) {
            return dir(elem, "previousSibling");
          },
          nextUntil: function(elem, _i, until) {
            return dir(elem, "nextSibling", until);
          },
          prevUntil: function(elem, _i, until) {
            return dir(elem, "previousSibling", until);
          },
          siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
          },
          children: function(elem) {
            return siblings(elem.firstChild);
          },
          contents: function(elem) {
            if (elem.contentDocument != null && // Support: IE 11+
            // <object> elements with no `data` attribute has an object
            // `contentDocument` with a `null` prototype.
            getProto(elem.contentDocument)) {
              return elem.contentDocument;
            }
            if (nodeName(elem, "template")) {
              elem = elem.content || elem;
            }
            return jQuery2.merge([], elem.childNodes);
          }
        }, function(name, fn) {
          jQuery2.fn[name] = function(until, selector) {
            var matched = jQuery2.map(this, fn, until);
            if (name.slice(-5) !== "Until") {
              selector = until;
            }
            if (selector && typeof selector === "string") {
              matched = jQuery2.filter(selector, matched);
            }
            if (this.length > 1) {
              if (!guaranteedUnique[name]) {
                jQuery2.uniqueSort(matched);
              }
              if (rparentsprev.test(name)) {
                matched.reverse();
              }
            }
            return this.pushStack(matched);
          };
        });
        var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
        function createOptions(options) {
          var object = {};
          jQuery2.each(options.match(rnothtmlwhite) || [], function(_, flag) {
            object[flag] = true;
          });
          return object;
        }
        jQuery2.Callbacks = function(options) {
          options = typeof options === "string" ? createOptions(options) : jQuery2.extend({}, options);
          var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
            locked = locked || options.once;
            fired = firing = true;
            for (; queue.length; firingIndex = -1) {
              memory = queue.shift();
              while (++firingIndex < list.length) {
                if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                  firingIndex = list.length;
                  memory = false;
                }
              }
            }
            if (!options.memory) {
              memory = false;
            }
            firing = false;
            if (locked) {
              if (memory) {
                list = [];
              } else {
                list = "";
              }
            }
          }, self2 = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
              if (list) {
                if (memory && !firing) {
                  firingIndex = list.length - 1;
                  queue.push(memory);
                }
                (function add(args) {
                  jQuery2.each(args, function(_, arg) {
                    if (isFunction(arg)) {
                      if (!options.unique || !self2.has(arg)) {
                        list.push(arg);
                      }
                    } else if (arg && arg.length && toType(arg) !== "string") {
                      add(arg);
                    }
                  });
                })(arguments);
                if (memory && !firing) {
                  fire();
                }
              }
              return this;
            },
            // Remove a callback from the list
            remove: function() {
              jQuery2.each(arguments, function(_, arg) {
                var index;
                while ((index = jQuery2.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1);
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              });
              return this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function(fn) {
              return fn ? jQuery2.inArray(fn, list) > -1 : list.length > 0;
            },
            // Remove all callbacks from the list
            empty: function() {
              if (list) {
                list = [];
              }
              return this;
            },
            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function() {
              locked = queue = [];
              list = memory = "";
              return this;
            },
            disabled: function() {
              return !list;
            },
            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function() {
              locked = queue = [];
              if (!memory && !firing) {
                list = memory = "";
              }
              return this;
            },
            locked: function() {
              return !!locked;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function(context, args) {
              if (!locked) {
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                queue.push(args);
                if (!firing) {
                  fire();
                }
              }
              return this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
              self2.fireWith(this, arguments);
              return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
              return !!fired;
            }
          };
          return self2;
        };
        function Identity(v) {
          return v;
        }
        function Thrower(ex) {
          throw ex;
        }
        function adoptValue(value, resolve, reject, noValue) {
          var method;
          try {
            if (value && isFunction(method = value.promise)) {
              method.call(value).done(resolve).fail(reject);
            } else if (value && isFunction(method = value.then)) {
              method.call(value, resolve, reject);
            } else {
              resolve.apply(void 0, [value].slice(noValue));
            }
          } catch (value2) {
            reject.apply(void 0, [value2]);
          }
        }
        jQuery2.extend({
          Deferred: function(func) {
            var tuples = [
              // action, add listener, callbacks,
              // ... .then handlers, argument index, [final state]
              [
                "notify",
                "progress",
                jQuery2.Callbacks("memory"),
                jQuery2.Callbacks("memory"),
                2
              ],
              [
                "resolve",
                "done",
                jQuery2.Callbacks("once memory"),
                jQuery2.Callbacks("once memory"),
                0,
                "resolved"
              ],
              [
                "reject",
                "fail",
                jQuery2.Callbacks("once memory"),
                jQuery2.Callbacks("once memory"),
                1,
                "rejected"
              ]
            ], state = "pending", promise = {
              state: function() {
                return state;
              },
              always: function() {
                deferred.done(arguments).fail(arguments);
                return this;
              },
              "catch": function(fn) {
                return promise.then(null, fn);
              },
              // Keep pipe for back-compat
              pipe: function() {
                var fns = arguments;
                return jQuery2.Deferred(function(newDefer) {
                  jQuery2.each(tuples, function(_i, tuple) {
                    var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                    deferred[tuple[1]](function() {
                      var returned = fn && fn.apply(this, arguments);
                      if (returned && isFunction(returned.promise)) {
                        returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                      } else {
                        newDefer[tuple[0] + "With"](
                          this,
                          fn ? [returned] : arguments
                        );
                      }
                    });
                  });
                  fns = null;
                }).promise();
              },
              then: function(onFulfilled, onRejected, onProgress) {
                var maxDepth = 0;
                function resolve(depth, deferred2, handler, special) {
                  return function() {
                    var that = this, args = arguments, mightThrow = function() {
                      var returned, then;
                      if (depth < maxDepth) {
                        return;
                      }
                      returned = handler.apply(that, args);
                      if (returned === deferred2.promise()) {
                        throw new TypeError("Thenable self-resolution");
                      }
                      then = returned && // Support: Promises/A+ section 2.3.4
                      // https://promisesaplus.com/#point-64
                      // Only check objects and functions for thenability
                      (typeof returned === "object" || typeof returned === "function") && returned.then;
                      if (isFunction(then)) {
                        if (special) {
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special)
                          );
                        } else {
                          maxDepth++;
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special),
                            resolve(
                              maxDepth,
                              deferred2,
                              Identity,
                              deferred2.notifyWith
                            )
                          );
                        }
                      } else {
                        if (handler !== Identity) {
                          that = void 0;
                          args = [returned];
                        }
                        (special || deferred2.resolveWith)(that, args);
                      }
                    }, process = special ? mightThrow : function() {
                      try {
                        mightThrow();
                      } catch (e) {
                        if (jQuery2.Deferred.exceptionHook) {
                          jQuery2.Deferred.exceptionHook(
                            e,
                            process.stackTrace
                          );
                        }
                        if (depth + 1 >= maxDepth) {
                          if (handler !== Thrower) {
                            that = void 0;
                            args = [e];
                          }
                          deferred2.rejectWith(that, args);
                        }
                      }
                    };
                    if (depth) {
                      process();
                    } else {
                      if (jQuery2.Deferred.getStackHook) {
                        process.stackTrace = jQuery2.Deferred.getStackHook();
                      }
                      window2.setTimeout(process);
                    }
                  };
                }
                return jQuery2.Deferred(function(newDefer) {
                  tuples[0][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onProgress) ? onProgress : Identity,
                      newDefer.notifyWith
                    )
                  );
                  tuples[1][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onFulfilled) ? onFulfilled : Identity
                    )
                  );
                  tuples[2][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onRejected) ? onRejected : Thrower
                    )
                  );
                }).promise();
              },
              // Get a promise for this deferred
              // If obj is provided, the promise aspect is added to the object
              promise: function(obj) {
                return obj != null ? jQuery2.extend(obj, promise) : promise;
              }
            }, deferred = {};
            jQuery2.each(tuples, function(i, tuple) {
              var list = tuple[2], stateString = tuple[5];
              promise[tuple[1]] = list.add;
              if (stateString) {
                list.add(
                  function() {
                    state = stateString;
                  },
                  // rejected_callbacks.disable
                  // fulfilled_callbacks.disable
                  tuples[3 - i][2].disable,
                  // rejected_handlers.disable
                  // fulfilled_handlers.disable
                  tuples[3 - i][3].disable,
                  // progress_callbacks.lock
                  tuples[0][2].lock,
                  // progress_handlers.lock
                  tuples[0][3].lock
                );
              }
              list.add(tuple[3].fire);
              deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
                return this;
              };
              deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
              func.call(deferred, deferred);
            }
            return deferred;
          },
          // Deferred helper
          when: function(singleValue) {
            var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery2.Deferred(), updateFunc = function(i2) {
              return function(value) {
                resolveContexts[i2] = this;
                resolveValues[i2] = arguments.length > 1 ? slice.call(arguments) : value;
                if (!--remaining) {
                  primary.resolveWith(resolveContexts, resolveValues);
                }
              };
            };
            if (remaining <= 1) {
              adoptValue(
                singleValue,
                primary.done(updateFunc(i)).resolve,
                primary.reject,
                !remaining
              );
              if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
                return primary.then();
              }
            }
            while (i--) {
              adoptValue(resolveValues[i], updateFunc(i), primary.reject);
            }
            return primary.promise();
          }
        });
        var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        jQuery2.Deferred.exceptionHook = function(error, stack) {
          if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
            window2.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
          }
        };
        jQuery2.readyException = function(error) {
          window2.setTimeout(function() {
            throw error;
          });
        };
        var readyList = jQuery2.Deferred();
        jQuery2.fn.ready = function(fn) {
          readyList.then(fn).catch(function(error) {
            jQuery2.readyException(error);
          });
          return this;
        };
        jQuery2.extend({
          // Is the DOM ready to be used? Set to true once it occurs.
          isReady: false,
          // A counter to track how many items to wait for before
          // the ready event fires. See #6781
          readyWait: 1,
          // Handle when the DOM is ready
          ready: function(wait) {
            if (wait === true ? --jQuery2.readyWait : jQuery2.isReady) {
              return;
            }
            jQuery2.isReady = true;
            if (wait !== true && --jQuery2.readyWait > 0) {
              return;
            }
            readyList.resolveWith(document2, [jQuery2]);
          }
        });
        jQuery2.ready.then = readyList.then;
        function completed() {
          document2.removeEventListener("DOMContentLoaded", completed);
          window2.removeEventListener("load", completed);
          jQuery2.ready();
        }
        if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
          window2.setTimeout(jQuery2.ready);
        } else {
          document2.addEventListener("DOMContentLoaded", completed);
          window2.addEventListener("load", completed);
        }
        var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
          var i = 0, len = elems.length, bulk = key == null;
          if (toType(key) === "object") {
            chainable = true;
            for (i in key) {
              access(elems, fn, i, key[i], true, emptyGet, raw);
            }
          } else if (value !== void 0) {
            chainable = true;
            if (!isFunction(value)) {
              raw = true;
            }
            if (bulk) {
              if (raw) {
                fn.call(elems, value);
                fn = null;
              } else {
                bulk = fn;
                fn = function(elem, _key, value2) {
                  return bulk.call(jQuery2(elem), value2);
                };
              }
            }
            if (fn) {
              for (; i < len; i++) {
                fn(
                  elems[i],
                  key,
                  raw ? value : value.call(elems[i], i, fn(elems[i], key))
                );
              }
            }
          }
          if (chainable) {
            return elems;
          }
          if (bulk) {
            return fn.call(elems);
          }
          return len ? fn(elems[0], key) : emptyGet;
        };
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
        function fcamelCase(_all, letter) {
          return letter.toUpperCase();
        }
        function camelCase(string) {
          return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        }
        var acceptData = function(owner) {
          return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
        };
        function Data() {
          this.expando = jQuery2.expando + Data.uid++;
        }
        Data.uid = 1;
        Data.prototype = {
          cache: function(owner) {
            var value = owner[this.expando];
            if (!value) {
              value = {};
              if (acceptData(owner)) {
                if (owner.nodeType) {
                  owner[this.expando] = value;
                } else {
                  Object.defineProperty(owner, this.expando, {
                    value,
                    configurable: true
                  });
                }
              }
            }
            return value;
          },
          set: function(owner, data, value) {
            var prop, cache2 = this.cache(owner);
            if (typeof data === "string") {
              cache2[camelCase(data)] = value;
            } else {
              for (prop in data) {
                cache2[camelCase(prop)] = data[prop];
              }
            }
            return cache2;
          },
          get: function(owner, key) {
            return key === void 0 ? this.cache(owner) : (
              // Always use camelCase key (gh-2257)
              owner[this.expando] && owner[this.expando][camelCase(key)]
            );
          },
          access: function(owner, key, value) {
            if (key === void 0 || key && typeof key === "string" && value === void 0) {
              return this.get(owner, key);
            }
            this.set(owner, key, value);
            return value !== void 0 ? value : key;
          },
          remove: function(owner, key) {
            var i, cache2 = owner[this.expando];
            if (cache2 === void 0) {
              return;
            }
            if (key !== void 0) {
              if (Array.isArray(key)) {
                key = key.map(camelCase);
              } else {
                key = camelCase(key);
                key = key in cache2 ? [key] : key.match(rnothtmlwhite) || [];
              }
              i = key.length;
              while (i--) {
                delete cache2[key[i]];
              }
            }
            if (key === void 0 || jQuery2.isEmptyObject(cache2)) {
              if (owner.nodeType) {
                owner[this.expando] = void 0;
              } else {
                delete owner[this.expando];
              }
            }
          },
          hasData: function(owner) {
            var cache2 = owner[this.expando];
            return cache2 !== void 0 && !jQuery2.isEmptyObject(cache2);
          }
        };
        var dataPriv = new Data();
        var dataUser = new Data();
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
        function getData(data) {
          if (data === "true") {
            return true;
          }
          if (data === "false") {
            return false;
          }
          if (data === "null") {
            return null;
          }
          if (data === +data + "") {
            return +data;
          }
          if (rbrace.test(data)) {
            return JSON.parse(data);
          }
          return data;
        }
        function dataAttr(elem, key, data) {
          var name;
          if (data === void 0 && elem.nodeType === 1) {
            name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === "string") {
              try {
                data = getData(data);
              } catch (e) {
              }
              dataUser.set(elem, key, data);
            } else {
              data = void 0;
            }
          }
          return data;
        }
        jQuery2.extend({
          hasData: function(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
          },
          data: function(elem, name, data) {
            return dataUser.access(elem, name, data);
          },
          removeData: function(elem, name) {
            dataUser.remove(elem, name);
          },
          // TODO: Now that all calls to _data and _removeData have been replaced
          // with direct calls to dataPriv methods, these can be deprecated.
          _data: function(elem, name, data) {
            return dataPriv.access(elem, name, data);
          },
          _removeData: function(elem, name) {
            dataPriv.remove(elem, name);
          }
        });
        jQuery2.fn.extend({
          data: function(key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            if (key === void 0) {
              if (this.length) {
                data = dataUser.get(elem);
                if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                  i = attrs.length;
                  while (i--) {
                    if (attrs[i]) {
                      name = attrs[i].name;
                      if (name.indexOf("data-") === 0) {
                        name = camelCase(name.slice(5));
                        dataAttr(elem, name, data[name]);
                      }
                    }
                  }
                  dataPriv.set(elem, "hasDataAttrs", true);
                }
              }
              return data;
            }
            if (typeof key === "object") {
              return this.each(function() {
                dataUser.set(this, key);
              });
            }
            return access(this, function(value2) {
              var data2;
              if (elem && value2 === void 0) {
                data2 = dataUser.get(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                data2 = dataAttr(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                return;
              }
              this.each(function() {
                dataUser.set(this, key, value2);
              });
            }, null, value, arguments.length > 1, null, true);
          },
          removeData: function(key) {
            return this.each(function() {
              dataUser.remove(this, key);
            });
          }
        });
        jQuery2.extend({
          queue: function(elem, type, data) {
            var queue;
            if (elem) {
              type = (type || "fx") + "queue";
              queue = dataPriv.get(elem, type);
              if (data) {
                if (!queue || Array.isArray(data)) {
                  queue = dataPriv.access(elem, type, jQuery2.makeArray(data));
                } else {
                  queue.push(data);
                }
              }
              return queue || [];
            }
          },
          dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery2.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery2._queueHooks(elem, type), next = function() {
              jQuery2.dequeue(elem, type);
            };
            if (fn === "inprogress") {
              fn = queue.shift();
              startLength--;
            }
            if (fn) {
              if (type === "fx") {
                queue.unshift("inprogress");
              }
              delete hooks.stop;
              fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
              hooks.empty.fire();
            }
          },
          // Not public - generate a queueHooks object, or return the current one
          _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
              empty: jQuery2.Callbacks("once memory").add(function() {
                dataPriv.remove(elem, [type + "queue", key]);
              })
            });
          }
        });
        jQuery2.fn.extend({
          queue: function(type, data) {
            var setter = 2;
            if (typeof type !== "string") {
              data = type;
              type = "fx";
              setter--;
            }
            if (arguments.length < setter) {
              return jQuery2.queue(this[0], type);
            }
            return data === void 0 ? this : this.each(function() {
              var queue = jQuery2.queue(this, type, data);
              jQuery2._queueHooks(this, type);
              if (type === "fx" && queue[0] !== "inprogress") {
                jQuery2.dequeue(this, type);
              }
            });
          },
          dequeue: function(type) {
            return this.each(function() {
              jQuery2.dequeue(this, type);
            });
          },
          clearQueue: function(type) {
            return this.queue(type || "fx", []);
          },
          // Get a promise resolved when queues of a certain type
          // are emptied (fx is the type by default)
          promise: function(type, obj) {
            var tmp, count = 1, defer = jQuery2.Deferred(), elements = this, i = this.length, resolve = function() {
              if (!--count) {
                defer.resolveWith(elements, [elements]);
              }
            };
            if (typeof type !== "string") {
              obj = type;
              type = void 0;
            }
            type = type || "fx";
            while (i--) {
              tmp = dataPriv.get(elements[i], type + "queueHooks");
              if (tmp && tmp.empty) {
                count++;
                tmp.empty.add(resolve);
              }
            }
            resolve();
            return defer.promise(obj);
          }
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
        var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
        var cssExpand = ["Top", "Right", "Bottom", "Left"];
        var documentElement = document2.documentElement;
        var isAttached = function(elem) {
          return jQuery2.contains(elem.ownerDocument, elem);
        }, composed = { composed: true };
        if (documentElement.getRootNode) {
          isAttached = function(elem) {
            return jQuery2.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
          };
        }
        var isHiddenWithinTree = function(elem, el) {
          elem = el || elem;
          return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
          // Support: Firefox <=43 - 45
          // Disconnected elements can have computed display: none, so first confirm that elem is
          // in the document.
          isAttached(elem) && jQuery2.css(elem, "display") === "none";
        };
        function adjustCSS(elem, prop, valueParts, tween) {
          var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
            return tween.cur();
          } : function() {
            return jQuery2.css(elem, prop, "");
          }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery2.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery2.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery2.css(elem, prop));
          if (initialInUnit && initialInUnit[3] !== unit) {
            initial = initial / 2;
            unit = unit || initialInUnit[3];
            initialInUnit = +initial || 1;
            while (maxIterations--) {
              jQuery2.style(elem, prop, initialInUnit + unit);
              if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
              }
              initialInUnit = initialInUnit / scale;
            }
            initialInUnit = initialInUnit * 2;
            jQuery2.style(elem, prop, initialInUnit + unit);
            valueParts = valueParts || [];
          }
          if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
            if (tween) {
              tween.unit = unit;
              tween.start = initialInUnit;
              tween.end = adjusted;
            }
          }
          return adjusted;
        }
        var defaultDisplayMap = {};
        function getDefaultDisplay(elem) {
          var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
          if (display) {
            return display;
          }
          temp = doc.body.appendChild(doc.createElement(nodeName2));
          display = jQuery2.css(temp, "display");
          temp.parentNode.removeChild(temp);
          if (display === "none") {
            display = "block";
          }
          defaultDisplayMap[nodeName2] = display;
          return display;
        }
        function showHide(elements, show) {
          var display, elem, values = [], index = 0, length = elements.length;
          for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
              continue;
            }
            display = elem.style.display;
            if (show) {
              if (display === "none") {
                values[index] = dataPriv.get(elem, "display") || null;
                if (!values[index]) {
                  elem.style.display = "";
                }
              }
              if (elem.style.display === "" && isHiddenWithinTree(elem)) {
                values[index] = getDefaultDisplay(elem);
              }
            } else {
              if (display !== "none") {
                values[index] = "none";
                dataPriv.set(elem, "display", display);
              }
            }
          }
          for (index = 0; index < length; index++) {
            if (values[index] != null) {
              elements[index].style.display = values[index];
            }
          }
          return elements;
        }
        jQuery2.fn.extend({
          show: function() {
            return showHide(this, true);
          },
          hide: function() {
            return showHide(this);
          },
          toggle: function(state) {
            if (typeof state === "boolean") {
              return state ? this.show() : this.hide();
            }
            return this.each(function() {
              if (isHiddenWithinTree(this)) {
                jQuery2(this).show();
              } else {
                jQuery2(this).hide();
              }
            });
          }
        });
        var rcheckableType = /^(?:checkbox|radio)$/i;
        var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
        (function() {
          var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
          input.setAttribute("type", "radio");
          input.setAttribute("checked", "checked");
          input.setAttribute("name", "t");
          div.appendChild(input);
          support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
          div.innerHTML = "<textarea>x</textarea>";
          support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
          div.innerHTML = "<option></option>";
          support.option = !!div.lastChild;
        })();
        var wrapMap = {
          // XHTML parsers do not magically insert elements in the
          // same way that tag soup parsers do. So we cannot shorten
          // this by omitting <tbody> or other required elements.
          thead: [1, "<table>", "</table>"],
          col: [2, "<table><colgroup>", "</colgroup></table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
          _default: [0, "", ""]
        };
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        if (!support.option) {
          wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
        }
        function getAll(context, tag) {
          var ret;
          if (typeof context.getElementsByTagName !== "undefined") {
            ret = context.getElementsByTagName(tag || "*");
          } else if (typeof context.querySelectorAll !== "undefined") {
            ret = context.querySelectorAll(tag || "*");
          } else {
            ret = [];
          }
          if (tag === void 0 || tag && nodeName(context, tag)) {
            return jQuery2.merge([context], ret);
          }
          return ret;
        }
        function setGlobalEval(elems, refElements) {
          var i = 0, l = elems.length;
          for (; i < l; i++) {
            dataPriv.set(
              elems[i],
              "globalEval",
              !refElements || dataPriv.get(refElements[i], "globalEval")
            );
          }
        }
        var rhtml = /<|&#?\w+;/;
        function buildFragment(elems, context, scripts, selection, ignored) {
          var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
          for (; i < l; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
              if (toType(elem) === "object") {
                jQuery2.merge(nodes, elem.nodeType ? [elem] : elem);
              } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));
              } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));
                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery2.htmlPrefilter(elem) + wrap[2];
                j = wrap[0];
                while (j--) {
                  tmp = tmp.lastChild;
                }
                jQuery2.merge(nodes, tmp.childNodes);
                tmp = fragment.firstChild;
                tmp.textContent = "";
              }
            }
          }
          fragment.textContent = "";
          i = 0;
          while (elem = nodes[i++]) {
            if (selection && jQuery2.inArray(elem, selection) > -1) {
              if (ignored) {
                ignored.push(elem);
              }
              continue;
            }
            attached = isAttached(elem);
            tmp = getAll(fragment.appendChild(elem), "script");
            if (attached) {
              setGlobalEval(tmp);
            }
            if (scripts) {
              j = 0;
              while (elem = tmp[j++]) {
                if (rscriptType.test(elem.type || "")) {
                  scripts.push(elem);
                }
              }
            }
          }
          return fragment;
        }
        var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
        function returnTrue() {
          return true;
        }
        function returnFalse() {
          return false;
        }
        function expectSync(elem, type) {
          return elem === safeActiveElement() === (type === "focus");
        }
        function safeActiveElement() {
          try {
            return document2.activeElement;
          } catch (err) {
          }
        }
        function on(elem, types, selector, data, fn, one) {
          var origFn, type;
          if (typeof types === "object") {
            if (typeof selector !== "string") {
              data = data || selector;
              selector = void 0;
            }
            for (type in types) {
              on(elem, type, selector, data, types[type], one);
            }
            return elem;
          }
          if (data == null && fn == null) {
            fn = selector;
            data = selector = void 0;
          } else if (fn == null) {
            if (typeof selector === "string") {
              fn = data;
              data = void 0;
            } else {
              fn = data;
              data = selector;
              selector = void 0;
            }
          }
          if (fn === false) {
            fn = returnFalse;
          } else if (!fn) {
            return elem;
          }
          if (one === 1) {
            origFn = fn;
            fn = function(event) {
              jQuery2().off(event);
              return origFn.apply(this, arguments);
            };
            fn.guid = origFn.guid || (origFn.guid = jQuery2.guid++);
          }
          return elem.each(function() {
            jQuery2.event.add(this, types, fn, data, selector);
          });
        }
        jQuery2.event = {
          global: {},
          add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
            if (!acceptData(elem)) {
              return;
            }
            if (handler.handler) {
              handleObjIn = handler;
              handler = handleObjIn.handler;
              selector = handleObjIn.selector;
            }
            if (selector) {
              jQuery2.find.matchesSelector(documentElement, selector);
            }
            if (!handler.guid) {
              handler.guid = jQuery2.guid++;
            }
            if (!(events = elemData.events)) {
              events = elemData.events = /* @__PURE__ */ Object.create(null);
            }
            if (!(eventHandle = elemData.handle)) {
              eventHandle = elemData.handle = function(e) {
                return typeof jQuery2 !== "undefined" && jQuery2.event.triggered !== e.type ? jQuery2.event.dispatch.apply(elem, arguments) : void 0;
              };
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                continue;
              }
              special = jQuery2.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              special = jQuery2.event.special[type] || {};
              handleObj = jQuery2.extend({
                type,
                origType,
                data,
                handler,
                guid: handler.guid,
                selector,
                needsContext: selector && jQuery2.expr.match.needsContext.test(selector),
                namespace: namespaces.join(".")
              }, handleObjIn);
              if (!(handlers = events[type])) {
                handlers = events[type] = [];
                handlers.delegateCount = 0;
                if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                  if (elem.addEventListener) {
                    elem.addEventListener(type, eventHandle);
                  }
                }
              }
              if (special.add) {
                special.add.call(elem, handleObj);
                if (!handleObj.handler.guid) {
                  handleObj.handler.guid = handler.guid;
                }
              }
              if (selector) {
                handlers.splice(handlers.delegateCount++, 0, handleObj);
              } else {
                handlers.push(handleObj);
              }
              jQuery2.event.global[type] = true;
            }
          },
          // Detach an event or set of events from an element
          remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (!elemData || !(events = elemData.events)) {
              return;
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                for (type in events) {
                  jQuery2.event.remove(elem, type + types[t], handler, selector, true);
                }
                continue;
              }
              special = jQuery2.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              handlers = events[type] || [];
              tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
              origCount = j = handlers.length;
              while (j--) {
                handleObj = handlers[j];
                if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                  handlers.splice(j, 1);
                  if (handleObj.selector) {
                    handlers.delegateCount--;
                  }
                  if (special.remove) {
                    special.remove.call(elem, handleObj);
                  }
                }
              }
              if (origCount && !handlers.length) {
                if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                  jQuery2.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
            if (jQuery2.isEmptyObject(events)) {
              dataPriv.remove(elem, "handle events");
            }
          },
          dispatch: function(nativeEvent) {
            var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery2.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery2.event.special[event.type] || {};
            args[0] = event;
            for (i = 1; i < arguments.length; i++) {
              args[i] = arguments[i];
            }
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
              return;
            }
            handlerQueue = jQuery2.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
              event.currentTarget = matched.elem;
              j = 0;
              while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                  event.handleObj = handleObj;
                  event.data = handleObj.data;
                  ret = ((jQuery2.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                  if (ret !== void 0) {
                    if ((event.result = ret) === false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                }
              }
            }
            if (special.postDispatch) {
              special.postDispatch.call(this, event);
            }
            return event.result;
          },
          handlers: function(event, handlers) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && // Support: IE <=9
            // Black-hole SVG <use> instance trees (trac-13180)
            cur.nodeType && // Support: Firefox <=42
            // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
            // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
            // Support: IE 11 only
            // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
            !(event.type === "click" && event.button >= 1)) {
              for (; cur !== this; cur = cur.parentNode || this) {
                if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                  matchedHandlers = [];
                  matchedSelectors = {};
                  for (i = 0; i < delegateCount; i++) {
                    handleObj = handlers[i];
                    sel = handleObj.selector + " ";
                    if (matchedSelectors[sel] === void 0) {
                      matchedSelectors[sel] = handleObj.needsContext ? jQuery2(sel, this).index(cur) > -1 : jQuery2.find(sel, this, null, [cur]).length;
                    }
                    if (matchedSelectors[sel]) {
                      matchedHandlers.push(handleObj);
                    }
                  }
                  if (matchedHandlers.length) {
                    handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                  }
                }
              }
            }
            cur = this;
            if (delegateCount < handlers.length) {
              handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
            }
            return handlerQueue;
          },
          addProp: function(name, hook) {
            Object.defineProperty(jQuery2.Event.prototype, name, {
              enumerable: true,
              configurable: true,
              get: isFunction(hook) ? function() {
                if (this.originalEvent) {
                  return hook(this.originalEvent);
                }
              } : function() {
                if (this.originalEvent) {
                  return this.originalEvent[name];
                }
              },
              set: function(value) {
                Object.defineProperty(this, name, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value
                });
              }
            });
          },
          fix: function(originalEvent) {
            return originalEvent[jQuery2.expando] ? originalEvent : new jQuery2.Event(originalEvent);
          },
          special: {
            load: {
              // Prevent triggered image.load events from bubbling to window.load
              noBubble: true
            },
            click: {
              // Utilize native event to ensure correct state for checkable inputs
              setup: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click", returnTrue);
                }
                return false;
              },
              trigger: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click");
                }
                return true;
              },
              // For cross-browser consistency, suppress native .click() on links
              // Also prevent it if we're currently inside a leveraged native-event stack
              _default: function(event) {
                var target = event.target;
                return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
              }
            },
            beforeunload: {
              postDispatch: function(event) {
                if (event.result !== void 0 && event.originalEvent) {
                  event.originalEvent.returnValue = event.result;
                }
              }
            }
          }
        };
        function leverageNative(el, type, expectSync2) {
          if (!expectSync2) {
            if (dataPriv.get(el, type) === void 0) {
              jQuery2.event.add(el, type, returnTrue);
            }
            return;
          }
          dataPriv.set(el, type, false);
          jQuery2.event.add(el, type, {
            namespace: false,
            handler: function(event) {
              var notAsync, result, saved = dataPriv.get(this, type);
              if (event.isTrigger & 1 && this[type]) {
                if (!saved.length) {
                  saved = slice.call(arguments);
                  dataPriv.set(this, type, saved);
                  notAsync = expectSync2(this, type);
                  this[type]();
                  result = dataPriv.get(this, type);
                  if (saved !== result || notAsync) {
                    dataPriv.set(this, type, false);
                  } else {
                    result = {};
                  }
                  if (saved !== result) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return result && result.value;
                  }
                } else if ((jQuery2.event.special[type] || {}).delegateType) {
                  event.stopPropagation();
                }
              } else if (saved.length) {
                dataPriv.set(this, type, {
                  value: jQuery2.event.trigger(
                    // Support: IE <=9 - 11+
                    // Extend with the prototype to reset the above stopImmediatePropagation()
                    jQuery2.extend(saved[0], jQuery2.Event.prototype),
                    saved.slice(1),
                    this
                  )
                });
                event.stopImmediatePropagation();
              }
            }
          });
        }
        jQuery2.removeEvent = function(elem, type, handle) {
          if (elem.removeEventListener) {
            elem.removeEventListener(type, handle);
          }
        };
        jQuery2.Event = function(src, props) {
          if (!(this instanceof jQuery2.Event)) {
            return new jQuery2.Event(src, props);
          }
          if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
            src.returnValue === false ? returnTrue : returnFalse;
            this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
          } else {
            this.type = src;
          }
          if (props) {
            jQuery2.extend(this, props);
          }
          this.timeStamp = src && src.timeStamp || Date.now();
          this[jQuery2.expando] = true;
        };
        jQuery2.Event.prototype = {
          constructor: jQuery2.Event,
          isDefaultPrevented: returnFalse,
          isPropagationStopped: returnFalse,
          isImmediatePropagationStopped: returnFalse,
          isSimulated: false,
          preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && !this.isSimulated) {
              e.preventDefault();
            }
          },
          stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopPropagation();
            }
          },
          stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopImmediatePropagation();
            }
            this.stopPropagation();
          }
        };
        jQuery2.each({
          altKey: true,
          bubbles: true,
          cancelable: true,
          changedTouches: true,
          ctrlKey: true,
          detail: true,
          eventPhase: true,
          metaKey: true,
          pageX: true,
          pageY: true,
          shiftKey: true,
          view: true,
          "char": true,
          code: true,
          charCode: true,
          key: true,
          keyCode: true,
          button: true,
          buttons: true,
          clientX: true,
          clientY: true,
          offsetX: true,
          offsetY: true,
          pointerId: true,
          pointerType: true,
          screenX: true,
          screenY: true,
          targetTouches: true,
          toElement: true,
          touches: true,
          which: true
        }, jQuery2.event.addProp);
        jQuery2.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
          jQuery2.event.special[type] = {
            // Utilize native event if possible so blur/focus sequence is correct
            setup: function() {
              leverageNative(this, type, expectSync);
              return false;
            },
            trigger: function() {
              leverageNative(this, type);
              return true;
            },
            // Suppress native focus or blur as it's already being fired
            // in leverageNative.
            _default: function() {
              return true;
            },
            delegateType
          };
        });
        jQuery2.each({
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout"
        }, function(orig, fix) {
          jQuery2.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
              var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
              if (!related || related !== target && !jQuery2.contains(target, related)) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply(this, arguments);
                event.type = fix;
              }
              return ret;
            }
          };
        });
        jQuery2.fn.extend({
          on: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn);
          },
          one: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn, 1);
          },
          off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
              handleObj = types.handleObj;
              jQuery2(types.delegateTarget).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
              );
              return this;
            }
            if (typeof types === "object") {
              for (type in types) {
                this.off(type, selector, types[type]);
              }
              return this;
            }
            if (selector === false || typeof selector === "function") {
              fn = selector;
              selector = void 0;
            }
            if (fn === false) {
              fn = returnFalse;
            }
            return this.each(function() {
              jQuery2.event.remove(this, types, fn, selector);
            });
          }
        });
        var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        function manipulationTarget(elem, content) {
          if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
            return jQuery2(elem).children("tbody")[0] || elem;
          }
          return elem;
        }
        function disableScript(elem) {
          elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
          return elem;
        }
        function restoreScript(elem) {
          if ((elem.type || "").slice(0, 5) === "true/") {
            elem.type = elem.type.slice(5);
          } else {
            elem.removeAttribute("type");
          }
          return elem;
        }
        function cloneCopyEvent(src, dest) {
          var i, l, type, pdataOld, udataOld, udataCur, events;
          if (dest.nodeType !== 1) {
            return;
          }
          if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.get(src);
            events = pdataOld.events;
            if (events) {
              dataPriv.remove(dest, "handle events");
              for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                  jQuery2.event.add(dest, type, events[type][i]);
                }
              }
            }
          }
          if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = jQuery2.extend({}, udataOld);
            dataUser.set(dest, udataCur);
          }
        }
        function fixInput(src, dest) {
          var nodeName2 = dest.nodeName.toLowerCase();
          if (nodeName2 === "input" && rcheckableType.test(src.type)) {
            dest.checked = src.checked;
          } else if (nodeName2 === "input" || nodeName2 === "textarea") {
            dest.defaultValue = src.defaultValue;
          }
        }
        function domManip(collection, args, callback, ignored) {
          args = flat(args);
          var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
          if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
            return collection.each(function(index) {
              var self2 = collection.eq(index);
              if (valueIsFunction) {
                args[0] = value.call(this, index, self2.html());
              }
              domManip(self2, args, callback, ignored);
            });
          }
          if (l) {
            fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
            first = fragment.firstChild;
            if (fragment.childNodes.length === 1) {
              fragment = first;
            }
            if (first || ignored) {
              scripts = jQuery2.map(getAll(fragment, "script"), disableScript);
              hasScripts = scripts.length;
              for (; i < l; i++) {
                node = fragment;
                if (i !== iNoClone) {
                  node = jQuery2.clone(node, true, true);
                  if (hasScripts) {
                    jQuery2.merge(scripts, getAll(node, "script"));
                  }
                }
                callback.call(collection[i], node, i);
              }
              if (hasScripts) {
                doc = scripts[scripts.length - 1].ownerDocument;
                jQuery2.map(scripts, restoreScript);
                for (i = 0; i < hasScripts; i++) {
                  node = scripts[i];
                  if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery2.contains(doc, node)) {
                    if (node.src && (node.type || "").toLowerCase() !== "module") {
                      if (jQuery2._evalUrl && !node.noModule) {
                        jQuery2._evalUrl(node.src, {
                          nonce: node.nonce || node.getAttribute("nonce")
                        }, doc);
                      }
                    } else {
                      DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                    }
                  }
                }
              }
            }
          }
          return collection;
        }
        function remove(elem, selector, keepData) {
          var node, nodes = selector ? jQuery2.filter(selector, elem) : elem, i = 0;
          for (; (node = nodes[i]) != null; i++) {
            if (!keepData && node.nodeType === 1) {
              jQuery2.cleanData(getAll(node));
            }
            if (node.parentNode) {
              if (keepData && isAttached(node)) {
                setGlobalEval(getAll(node, "script"));
              }
              node.parentNode.removeChild(node);
            }
          }
          return elem;
        }
        jQuery2.extend({
          htmlPrefilter: function(html) {
            return html;
          },
          clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery2.isXMLDoc(elem)) {
              destElements = getAll(clone);
              srcElements = getAll(elem);
              for (i = 0, l = srcElements.length; i < l; i++) {
                fixInput(srcElements[i], destElements[i]);
              }
            }
            if (dataAndEvents) {
              if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem);
                destElements = destElements || getAll(clone);
                for (i = 0, l = srcElements.length; i < l; i++) {
                  cloneCopyEvent(srcElements[i], destElements[i]);
                }
              } else {
                cloneCopyEvent(elem, clone);
              }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
              setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            return clone;
          },
          cleanData: function(elems) {
            var data, elem, type, special = jQuery2.event.special, i = 0;
            for (; (elem = elems[i]) !== void 0; i++) {
              if (acceptData(elem)) {
                if (data = elem[dataPriv.expando]) {
                  if (data.events) {
                    for (type in data.events) {
                      if (special[type]) {
                        jQuery2.event.remove(elem, type);
                      } else {
                        jQuery2.removeEvent(elem, type, data.handle);
                      }
                    }
                  }
                  elem[dataPriv.expando] = void 0;
                }
                if (elem[dataUser.expando]) {
                  elem[dataUser.expando] = void 0;
                }
              }
            }
          }
        });
        jQuery2.fn.extend({
          detach: function(selector) {
            return remove(this, selector, true);
          },
          remove: function(selector) {
            return remove(this, selector);
          },
          text: function(value) {
            return access(this, function(value2) {
              return value2 === void 0 ? jQuery2.text(this) : this.empty().each(function() {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  this.textContent = value2;
                }
              });
            }, null, value, arguments.length);
          },
          append: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.appendChild(elem);
              }
            });
          },
          prepend: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.insertBefore(elem, target.firstChild);
              }
            });
          },
          before: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this);
              }
            });
          },
          after: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this.nextSibling);
              }
            });
          },
          empty: function() {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
              if (elem.nodeType === 1) {
                jQuery2.cleanData(getAll(elem, false));
                elem.textContent = "";
              }
            }
            return this;
          },
          clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
              return jQuery2.clone(this, dataAndEvents, deepDataAndEvents);
            });
          },
          html: function(value) {
            return access(this, function(value2) {
              var elem = this[0] || {}, i = 0, l = this.length;
              if (value2 === void 0 && elem.nodeType === 1) {
                return elem.innerHTML;
              }
              if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
                value2 = jQuery2.htmlPrefilter(value2);
                try {
                  for (; i < l; i++) {
                    elem = this[i] || {};
                    if (elem.nodeType === 1) {
                      jQuery2.cleanData(getAll(elem, false));
                      elem.innerHTML = value2;
                    }
                  }
                  elem = 0;
                } catch (e) {
                }
              }
              if (elem) {
                this.empty().append(value2);
              }
            }, null, value, arguments.length);
          },
          replaceWith: function() {
            var ignored = [];
            return domManip(this, arguments, function(elem) {
              var parent = this.parentNode;
              if (jQuery2.inArray(this, ignored) < 0) {
                jQuery2.cleanData(getAll(this));
                if (parent) {
                  parent.replaceChild(elem, this);
                }
              }
            }, ignored);
          }
        });
        jQuery2.each({
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
        }, function(name, original) {
          jQuery2.fn[name] = function(selector) {
            var elems, ret = [], insert = jQuery2(selector), last = insert.length - 1, i = 0;
            for (; i <= last; i++) {
              elems = i === last ? this : this.clone(true);
              jQuery2(insert[i])[original](elems);
              push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
          };
        });
        var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
        var getStyles = function(elem) {
          var view = elem.ownerDocument.defaultView;
          if (!view || !view.opener) {
            view = window2;
          }
          return view.getComputedStyle(elem);
        };
        var swap = function(elem, options, callback) {
          var ret, name, old = {};
          for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
          }
          ret = callback.call(elem);
          for (name in options) {
            elem.style[name] = old[name];
          }
          return ret;
        };
        var rboxStyle = new RegExp(cssExpand.join("|"), "i");
        (function() {
          function computeStyleTests() {
            if (!div) {
              return;
            }
            container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
            div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
            documentElement.appendChild(container).appendChild(div);
            var divStyle = window2.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== "1%";
            reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
            div.style.right = "60%";
            pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
            boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
            div.style.position = "absolute";
            scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
            documentElement.removeChild(container);
            div = null;
          }
          function roundPixelMeasures(measure) {
            return Math.round(parseFloat(measure));
          }
          var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
          if (!div.style) {
            return;
          }
          div.style.backgroundClip = "content-box";
          div.cloneNode(true).style.backgroundClip = "";
          support.clearCloneStyle = div.style.backgroundClip === "content-box";
          jQuery2.extend(support, {
            boxSizingReliable: function() {
              computeStyleTests();
              return boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
              computeStyleTests();
              return pixelBoxStylesVal;
            },
            pixelPosition: function() {
              computeStyleTests();
              return pixelPositionVal;
            },
            reliableMarginLeft: function() {
              computeStyleTests();
              return reliableMarginLeftVal;
            },
            scrollboxSize: function() {
              computeStyleTests();
              return scrollboxSizeVal;
            },
            // Support: IE 9 - 11+, Edge 15 - 18+
            // IE/Edge misreport `getComputedStyle` of table rows with width/height
            // set in CSS while `offset*` properties report correct values.
            // Behavior in IE 9 is more subtle than in newer versions & it passes
            // some versions of this test; make sure not to make it pass there!
            //
            // Support: Firefox 70+
            // Only Firefox includes border widths
            // in computed dimensions. (gh-4529)
            reliableTrDimensions: function() {
              var table, tr, trChild, trStyle;
              if (reliableTrDimensionsVal == null) {
                table = document2.createElement("table");
                tr = document2.createElement("tr");
                trChild = document2.createElement("div");
                table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
                tr.style.cssText = "border:1px solid";
                tr.style.height = "1px";
                trChild.style.height = "9px";
                trChild.style.display = "block";
                documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
                trStyle = window2.getComputedStyle(tr);
                reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
                documentElement.removeChild(table);
              }
              return reliableTrDimensionsVal;
            }
          });
        })();
        function curCSS(elem, name, computed) {
          var width, minWidth, maxWidth, ret, style = elem.style;
          computed = computed || getStyles(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (ret === "" && !isAttached(elem)) {
              ret = jQuery2.style(elem, name);
            }
            if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
              width = style.width;
              minWidth = style.minWidth;
              maxWidth = style.maxWidth;
              style.minWidth = style.maxWidth = style.width = ret;
              ret = computed.width;
              style.width = width;
              style.minWidth = minWidth;
              style.maxWidth = maxWidth;
            }
          }
          return ret !== void 0 ? (
            // Support: IE <=9 - 11 only
            // IE returns zIndex value as an integer.
            ret + ""
          ) : ret;
        }
        function addGetHookIf(conditionFn, hookFn) {
          return {
            get: function() {
              if (conditionFn()) {
                delete this.get;
                return;
              }
              return (this.get = hookFn).apply(this, arguments);
            }
          };
        }
        var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
        function vendorPropName(name) {
          var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
          while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in emptyStyle) {
              return name;
            }
          }
        }
        function finalPropName(name) {
          var final = jQuery2.cssProps[name] || vendorProps[name];
          if (final) {
            return final;
          }
          if (name in emptyStyle) {
            return name;
          }
          return vendorProps[name] = vendorPropName(name) || name;
        }
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/, rcustomProp = /^--/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
          letterSpacing: "0",
          fontWeight: "400"
        };
        function setPositiveNumber(_elem, value, subtract) {
          var matches = rcssNum.exec(value);
          return matches ? (
            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
          ) : value;
        }
        function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
          var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0;
          if (box === (isBorderBox ? "border" : "content")) {
            return 0;
          }
          for (; i < 4; i += 2) {
            if (box === "margin") {
              delta += jQuery2.css(elem, box + cssExpand[i], true, styles);
            }
            if (!isBorderBox) {
              delta += jQuery2.css(elem, "padding" + cssExpand[i], true, styles);
              if (box !== "padding") {
                delta += jQuery2.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              } else {
                extra += jQuery2.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            } else {
              if (box === "content") {
                delta -= jQuery2.css(elem, "padding" + cssExpand[i], true, styles);
              }
              if (box !== "margin") {
                delta -= jQuery2.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            }
          }
          if (!isBorderBox && computedVal >= 0) {
            delta += Math.max(0, Math.ceil(
              elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
              // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
              // Use an explicit zero to avoid NaN (gh-3964)
            )) || 0;
          }
          return delta;
        }
        function getWidthOrHeight(elem, dimension, extra) {
          var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
          if (rnumnonpx.test(val)) {
            if (!extra) {
              return val;
            }
            val = "auto";
          }
          if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Interestingly, in some cases IE 9 doesn't suffer from this issue.
          !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
          // This happens for inline elements with no explicit setting (gh-3571)
          val === "auto" || // Support: Android <=4.1 - 4.3 only
          // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
          !parseFloat(val) && jQuery2.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
          elem.getClientRects().length) {
            isBorderBox = jQuery2.css(elem, "boxSizing", false, styles) === "border-box";
            valueIsBorderBox = offsetProp in elem;
            if (valueIsBorderBox) {
              val = elem[offsetProp];
            }
          }
          val = parseFloat(val) || 0;
          return val + boxModelAdjustment(
            elem,
            dimension,
            extra || (isBorderBox ? "border" : "content"),
            valueIsBorderBox,
            styles,
            // Provide the current computed size to request scroll gutter calculation (gh-3589)
            val
          ) + "px";
        }
        jQuery2.extend({
          // Add in style property hooks for overriding the default
          // behavior of getting and setting a style property
          cssHooks: {
            opacity: {
              get: function(elem, computed) {
                if (computed) {
                  var ret = curCSS(elem, "opacity");
                  return ret === "" ? "1" : ret;
                }
              }
            }
          },
          // Don't automatically add "px" to these possibly-unitless properties
          cssNumber: {
            "animationIterationCount": true,
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "gridArea": true,
            "gridColumn": true,
            "gridColumnEnd": true,
            "gridColumnStart": true,
            "gridRow": true,
            "gridRowEnd": true,
            "gridRowStart": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
          },
          // Add in properties whose names you wish to fix before
          // setting or getting the value
          cssProps: {},
          // Get and set the style property on a DOM Node
          style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
              return;
            }
            var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
            if (value !== void 0) {
              type = typeof value;
              if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name, ret);
                type = "number";
              }
              if (value == null || value !== value) {
                return;
              }
              if (type === "number" && !isCustomProp) {
                value += ret && ret[3] || (jQuery2.cssNumber[origName] ? "" : "px");
              }
              if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                style[name] = "inherit";
              }
              if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
                if (isCustomProp) {
                  style.setProperty(name, value);
                } else {
                  style[name] = value;
                }
              }
            } else {
              if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
                return ret;
              }
              return style[name];
            }
          },
          css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
            if (hooks && "get" in hooks) {
              val = hooks.get(elem, true, extra);
            }
            if (val === void 0) {
              val = curCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
              val = cssNormalTransform[name];
            }
            if (extra === "" || extra) {
              num = parseFloat(val);
              return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
          }
        });
        jQuery2.each(["height", "width"], function(_i, dimension) {
          jQuery2.cssHooks[dimension] = {
            get: function(elem, computed, extra) {
              if (computed) {
                return rdisplayswap.test(jQuery2.css(elem, "display")) && // Support: Safari 8+
                // Table columns in Safari have non-zero offsetWidth & zero
                // getBoundingClientRect().width unless display is changed.
                // Support: IE <=11 only
                // Running getBoundingClientRect on a disconnected node
                // in IE throws an error.
                (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                  return getWidthOrHeight(elem, dimension, extra);
                }) : getWidthOrHeight(elem, dimension, extra);
              }
            },
            set: function(elem, value, extra) {
              var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
                elem,
                dimension,
                extra,
                isBorderBox,
                styles
              ) : 0;
              if (isBorderBox && scrollboxSizeBuggy) {
                subtract -= Math.ceil(
                  elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
                );
              }
              if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = jQuery2.css(elem, dimension);
              }
              return setPositiveNumber(elem, value, subtract);
            }
          };
        });
        jQuery2.cssHooks.marginLeft = addGetHookIf(
          support.reliableMarginLeft,
          function(elem, computed) {
            if (computed) {
              return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
                return elem.getBoundingClientRect().left;
              })) + "px";
            }
          }
        );
        jQuery2.each({
          margin: "",
          padding: "",
          border: "Width"
        }, function(prefix, suffix) {
          jQuery2.cssHooks[prefix + suffix] = {
            expand: function(value) {
              var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
              for (; i < 4; i++) {
                expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
              }
              return expanded;
            }
          };
          if (prefix !== "margin") {
            jQuery2.cssHooks[prefix + suffix].set = setPositiveNumber;
          }
        });
        jQuery2.fn.extend({
          css: function(name, value) {
            return access(this, function(elem, name2, value2) {
              var styles, len, map = {}, i = 0;
              if (Array.isArray(name2)) {
                styles = getStyles(elem);
                len = name2.length;
                for (; i < len; i++) {
                  map[name2[i]] = jQuery2.css(elem, name2[i], false, styles);
                }
                return map;
              }
              return value2 !== void 0 ? jQuery2.style(elem, name2, value2) : jQuery2.css(elem, name2);
            }, name, value, arguments.length > 1);
          }
        });
        function Tween(elem, options, prop, end, easing) {
          return new Tween.prototype.init(elem, options, prop, end, easing);
        }
        jQuery2.Tween = Tween;
        Tween.prototype = {
          constructor: Tween,
          init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery2.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery2.cssNumber[prop] ? "" : "px");
          },
          cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
          },
          run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
              this.pos = eased = jQuery2.easing[this.easing](
                percent,
                this.options.duration * percent,
                0,
                1,
                this.options.duration
              );
            } else {
              this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
              this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
              hooks.set(this);
            } else {
              Tween.propHooks._default.set(this);
            }
            return this;
          }
        };
        Tween.prototype.init.prototype = Tween.prototype;
        Tween.propHooks = {
          _default: {
            get: function(tween) {
              var result;
              if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
                return tween.elem[tween.prop];
              }
              result = jQuery2.css(tween.elem, tween.prop, "");
              return !result || result === "auto" ? 0 : result;
            },
            set: function(tween) {
              if (jQuery2.fx.step[tween.prop]) {
                jQuery2.fx.step[tween.prop](tween);
              } else if (tween.elem.nodeType === 1 && (jQuery2.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
                jQuery2.style(tween.elem, tween.prop, tween.now + tween.unit);
              } else {
                tween.elem[tween.prop] = tween.now;
              }
            }
          }
        };
        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
          set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
              tween.elem[tween.prop] = tween.now;
            }
          }
        };
        jQuery2.easing = {
          linear: function(p) {
            return p;
          },
          swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
          },
          _default: "swing"
        };
        jQuery2.fx = Tween.prototype.init;
        jQuery2.fx.step = {};
        var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
        function schedule() {
          if (inProgress) {
            if (document2.hidden === false && window2.requestAnimationFrame) {
              window2.requestAnimationFrame(schedule);
            } else {
              window2.setTimeout(schedule, jQuery2.fx.interval);
            }
            jQuery2.fx.tick();
          }
        }
        function createFxNow() {
          window2.setTimeout(function() {
            fxNow = void 0;
          });
          return fxNow = Date.now();
        }
        function genFx(type, includeWidth) {
          var which, i = 0, attrs = { height: type };
          includeWidth = includeWidth ? 1 : 0;
          for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
          }
          if (includeWidth) {
            attrs.opacity = attrs.width = type;
          }
          return attrs;
        }
        function createTween(value, prop, animation) {
          var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
          for (; index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {
              return tween;
            }
          }
        }
        function defaultPrefilter(elem, props, opts) {
          var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
          if (!opts.queue) {
            hooks = jQuery2._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
              hooks.unqueued = 0;
              oldfire = hooks.empty.fire;
              hooks.empty.fire = function() {
                if (!hooks.unqueued) {
                  oldfire();
                }
              };
            }
            hooks.unqueued++;
            anim.always(function() {
              anim.always(function() {
                hooks.unqueued--;
                if (!jQuery2.queue(elem, "fx").length) {
                  hooks.empty.fire();
                }
              });
            });
          }
          for (prop in props) {
            value = props[prop];
            if (rfxtypes.test(value)) {
              delete props[prop];
              toggle = toggle || value === "toggle";
              if (value === (hidden ? "hide" : "show")) {
                if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                  hidden = true;
                } else {
                  continue;
                }
              }
              orig[prop] = dataShow && dataShow[prop] || jQuery2.style(elem, prop);
            }
          }
          propTween = !jQuery2.isEmptyObject(props);
          if (!propTween && jQuery2.isEmptyObject(orig)) {
            return;
          }
          if (isBox && elem.nodeType === 1) {
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];
            restoreDisplay = dataShow && dataShow.display;
            if (restoreDisplay == null) {
              restoreDisplay = dataPriv.get(elem, "display");
            }
            display = jQuery2.css(elem, "display");
            if (display === "none") {
              if (restoreDisplay) {
                display = restoreDisplay;
              } else {
                showHide([elem], true);
                restoreDisplay = elem.style.display || restoreDisplay;
                display = jQuery2.css(elem, "display");
                showHide([elem]);
              }
            }
            if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
              if (jQuery2.css(elem, "float") === "none") {
                if (!propTween) {
                  anim.done(function() {
                    style.display = restoreDisplay;
                  });
                  if (restoreDisplay == null) {
                    display = style.display;
                    restoreDisplay = display === "none" ? "" : display;
                  }
                }
                style.display = "inline-block";
              }
            }
          }
          if (opts.overflow) {
            style.overflow = "hidden";
            anim.always(function() {
              style.overflow = opts.overflow[0];
              style.overflowX = opts.overflow[1];
              style.overflowY = opts.overflow[2];
            });
          }
          propTween = false;
          for (prop in orig) {
            if (!propTween) {
              if (dataShow) {
                if ("hidden" in dataShow) {
                  hidden = dataShow.hidden;
                }
              } else {
                dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
              }
              if (toggle) {
                dataShow.hidden = !hidden;
              }
              if (hidden) {
                showHide([elem], true);
              }
              anim.done(function() {
                if (!hidden) {
                  showHide([elem]);
                }
                dataPriv.remove(elem, "fxshow");
                for (prop in orig) {
                  jQuery2.style(elem, prop, orig[prop]);
                }
              });
            }
            propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
            if (!(prop in dataShow)) {
              dataShow[prop] = propTween.start;
              if (hidden) {
                propTween.end = propTween.start;
                propTween.start = 0;
              }
            }
          }
        }
        function propFilter(props, specialEasing) {
          var index, name, easing, value, hooks;
          for (index in props) {
            name = camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (Array.isArray(value)) {
              easing = value[1];
              value = props[index] = value[0];
            }
            if (index !== name) {
              props[name] = value;
              delete props[index];
            }
            hooks = jQuery2.cssHooks[name];
            if (hooks && "expand" in hooks) {
              value = hooks.expand(value);
              delete props[name];
              for (index in value) {
                if (!(index in props)) {
                  props[index] = value[index];
                  specialEasing[index] = easing;
                }
              }
            } else {
              specialEasing[name] = easing;
            }
          }
        }
        function Animation(elem, properties, options) {
          var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery2.Deferred().always(function() {
            delete tick.elem;
          }), tick = function() {
            if (stopped) {
              return false;
            }
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(percent);
            }
            deferred.notifyWith(elem, [animation, percent, remaining]);
            if (percent < 1 && length2) {
              return remaining;
            }
            if (!length2) {
              deferred.notifyWith(elem, [animation, 1, 0]);
            }
            deferred.resolveWith(elem, [animation]);
            return false;
          }, animation = deferred.promise({
            elem,
            props: jQuery2.extend({}, properties),
            opts: jQuery2.extend(true, {
              specialEasing: {},
              easing: jQuery2.easing._default
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
              var tween = jQuery2.Tween(
                elem,
                animation.opts,
                prop,
                end,
                animation.opts.specialEasing[prop] || animation.opts.easing
              );
              animation.tweens.push(tween);
              return tween;
            },
            stop: function(gotoEnd) {
              var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
              if (stopped) {
                return this;
              }
              stopped = true;
              for (; index2 < length2; index2++) {
                animation.tweens[index2].run(1);
              }
              if (gotoEnd) {
                deferred.notifyWith(elem, [animation, 1, 0]);
                deferred.resolveWith(elem, [animation, gotoEnd]);
              } else {
                deferred.rejectWith(elem, [animation, gotoEnd]);
              }
              return this;
            }
          }), props = animation.props;
          propFilter(props, animation.opts.specialEasing);
          for (; index < length; index++) {
            result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
              if (isFunction(result.stop)) {
                jQuery2._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
              }
              return result;
            }
          }
          jQuery2.map(props, createTween, animation);
          if (isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
          }
          animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
          jQuery2.fx.timer(
            jQuery2.extend(tick, {
              elem,
              anim: animation,
              queue: animation.opts.queue
            })
          );
          return animation;
        }
        jQuery2.Animation = jQuery2.extend(Animation, {
          tweeners: {
            "*": [function(prop, value) {
              var tween = this.createTween(prop, value);
              adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
              return tween;
            }]
          },
          tweener: function(props, callback) {
            if (isFunction(props)) {
              callback = props;
              props = ["*"];
            } else {
              props = props.match(rnothtmlwhite);
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
              prop = props[index];
              Animation.tweeners[prop] = Animation.tweeners[prop] || [];
              Animation.tweeners[prop].unshift(callback);
            }
          },
          prefilters: [defaultPrefilter],
          prefilter: function(callback, prepend) {
            if (prepend) {
              Animation.prefilters.unshift(callback);
            } else {
              Animation.prefilters.push(callback);
            }
          }
        });
        jQuery2.speed = function(speed, easing, fn) {
          var opt = speed && typeof speed === "object" ? jQuery2.extend({}, speed) : {
            complete: fn || !fn && easing || isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !isFunction(easing) && easing
          };
          if (jQuery2.fx.off) {
            opt.duration = 0;
          } else {
            if (typeof opt.duration !== "number") {
              if (opt.duration in jQuery2.fx.speeds) {
                opt.duration = jQuery2.fx.speeds[opt.duration];
              } else {
                opt.duration = jQuery2.fx.speeds._default;
              }
            }
          }
          if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
          }
          opt.old = opt.complete;
          opt.complete = function() {
            if (isFunction(opt.old)) {
              opt.old.call(this);
            }
            if (opt.queue) {
              jQuery2.dequeue(this, opt.queue);
            }
          };
          return opt;
        };
        jQuery2.fn.extend({
          fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
          },
          animate: function(prop, speed, easing, callback) {
            var empty = jQuery2.isEmptyObject(prop), optall = jQuery2.speed(speed, easing, callback), doAnimation = function() {
              var anim = Animation(this, jQuery2.extend({}, prop), optall);
              if (empty || dataPriv.get(this, "finish")) {
                anim.stop(true);
              }
            };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
          },
          stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
              var stop = hooks.stop;
              delete hooks.stop;
              stop(gotoEnd);
            };
            if (typeof type !== "string") {
              gotoEnd = clearQueue;
              clearQueue = type;
              type = void 0;
            }
            if (clearQueue) {
              this.queue(type || "fx", []);
            }
            return this.each(function() {
              var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery2.timers, data = dataPriv.get(this);
              if (index) {
                if (data[index] && data[index].stop) {
                  stopQueue(data[index]);
                }
              } else {
                for (index in data) {
                  if (data[index] && data[index].stop && rrun.test(index)) {
                    stopQueue(data[index]);
                  }
                }
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                  timers[index].anim.stop(gotoEnd);
                  dequeue = false;
                  timers.splice(index, 1);
                }
              }
              if (dequeue || !gotoEnd) {
                jQuery2.dequeue(this, type);
              }
            });
          },
          finish: function(type) {
            if (type !== false) {
              type = type || "fx";
            }
            return this.each(function() {
              var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery2.timers, length = queue ? queue.length : 0;
              data.finish = true;
              jQuery2.queue(this, type, []);
              if (hooks && hooks.stop) {
                hooks.stop.call(this, true);
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && timers[index].queue === type) {
                  timers[index].anim.stop(true);
                  timers.splice(index, 1);
                }
              }
              for (index = 0; index < length; index++) {
                if (queue[index] && queue[index].finish) {
                  queue[index].finish.call(this);
                }
              }
              delete data.finish;
            });
          }
        });
        jQuery2.each(["toggle", "show", "hide"], function(_i, name) {
          var cssFn = jQuery2.fn[name];
          jQuery2.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
          };
        });
        jQuery2.each({
          slideDown: genFx("show"),
          slideUp: genFx("hide"),
          slideToggle: genFx("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" }
        }, function(name, props) {
          jQuery2.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
          };
        });
        jQuery2.timers = [];
        jQuery2.fx.tick = function() {
          var timer, i = 0, timers = jQuery2.timers;
          fxNow = Date.now();
          for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
              timers.splice(i--, 1);
            }
          }
          if (!timers.length) {
            jQuery2.fx.stop();
          }
          fxNow = void 0;
        };
        jQuery2.fx.timer = function(timer) {
          jQuery2.timers.push(timer);
          jQuery2.fx.start();
        };
        jQuery2.fx.interval = 13;
        jQuery2.fx.start = function() {
          if (inProgress) {
            return;
          }
          inProgress = true;
          schedule();
        };
        jQuery2.fx.stop = function() {
          inProgress = null;
        };
        jQuery2.fx.speeds = {
          slow: 600,
          fast: 200,
          // Default speed
          _default: 400
        };
        jQuery2.fn.delay = function(time, type) {
          time = jQuery2.fx ? jQuery2.fx.speeds[time] || time : time;
          type = type || "fx";
          return this.queue(type, function(next, hooks) {
            var timeout = window2.setTimeout(next, time);
            hooks.stop = function() {
              window2.clearTimeout(timeout);
            };
          });
        };
        (function() {
          var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
          input.type = "checkbox";
          support.checkOn = input.value !== "";
          support.optSelected = opt.selected;
          input = document2.createElement("input");
          input.value = "t";
          input.type = "radio";
          support.radioValue = input.value === "t";
        })();
        var boolHook, attrHandle = jQuery2.expr.attrHandle;
        jQuery2.fn.extend({
          attr: function(name, value) {
            return access(this, jQuery2.attr, name, value, arguments.length > 1);
          },
          removeAttr: function(name) {
            return this.each(function() {
              jQuery2.removeAttr(this, name);
            });
          }
        });
        jQuery2.extend({
          attr: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (typeof elem.getAttribute === "undefined") {
              return jQuery2.prop(elem, name, value);
            }
            if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
              hooks = jQuery2.attrHooks[name.toLowerCase()] || (jQuery2.expr.match.bool.test(name) ? boolHook : void 0);
            }
            if (value !== void 0) {
              if (value === null) {
                jQuery2.removeAttr(elem, name);
                return;
              }
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              elem.setAttribute(name, value + "");
              return value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            ret = jQuery2.find.attr(elem, name);
            return ret == null ? void 0 : ret;
          },
          attrHooks: {
            type: {
              set: function(elem, value) {
                if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                  var val = elem.value;
                  elem.setAttribute("type", value);
                  if (val) {
                    elem.value = val;
                  }
                  return value;
                }
              }
            }
          },
          removeAttr: function(elem, value) {
            var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
            if (attrNames && elem.nodeType === 1) {
              while (name = attrNames[i++]) {
                elem.removeAttribute(name);
              }
            }
          }
        });
        boolHook = {
          set: function(elem, value, name) {
            if (value === false) {
              jQuery2.removeAttr(elem, name);
            } else {
              elem.setAttribute(name, name);
            }
            return name;
          }
        };
        jQuery2.each(jQuery2.expr.match.bool.source.match(/\w+/g), function(_i, name) {
          var getter = attrHandle[name] || jQuery2.find.attr;
          attrHandle[name] = function(elem, name2, isXML) {
            var ret, handle, lowercaseName = name2.toLowerCase();
            if (!isXML) {
              handle = attrHandle[lowercaseName];
              attrHandle[lowercaseName] = ret;
              ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
              attrHandle[lowercaseName] = handle;
            }
            return ret;
          };
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
        jQuery2.fn.extend({
          prop: function(name, value) {
            return access(this, jQuery2.prop, name, value, arguments.length > 1);
          },
          removeProp: function(name) {
            return this.each(function() {
              delete this[jQuery2.propFix[name] || name];
            });
          }
        });
        jQuery2.extend({
          prop: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
              name = jQuery2.propFix[name] || name;
              hooks = jQuery2.propHooks[name];
            }
            if (value !== void 0) {
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              return elem[name] = value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            return elem[name];
          },
          propHooks: {
            tabIndex: {
              get: function(elem) {
                var tabindex = jQuery2.find.attr(elem, "tabindex");
                if (tabindex) {
                  return parseInt(tabindex, 10);
                }
                if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                  return 0;
                }
                return -1;
              }
            }
          },
          propFix: {
            "for": "htmlFor",
            "class": "className"
          }
        });
        if (!support.optSelected) {
          jQuery2.propHooks.selected = {
            get: function(elem) {
              var parent = elem.parentNode;
              if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
              return null;
            },
            set: function(elem) {
              var parent = elem.parentNode;
              if (parent) {
                parent.selectedIndex;
                if (parent.parentNode) {
                  parent.parentNode.selectedIndex;
                }
              }
            }
          };
        }
        jQuery2.each([
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable"
        ], function() {
          jQuery2.propFix[this.toLowerCase()] = this;
        });
        function stripAndCollapse(value) {
          var tokens = value.match(rnothtmlwhite) || [];
          return tokens.join(" ");
        }
        function getClass(elem) {
          return elem.getAttribute && elem.getAttribute("class") || "";
        }
        function classesToArray(value) {
          if (Array.isArray(value)) {
            return value;
          }
          if (typeof value === "string") {
            return value.match(rnothtmlwhite) || [];
          }
          return [];
        }
        jQuery2.fn.extend({
          addClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (isFunction(value)) {
              return this.each(function(j2) {
                jQuery2(this).addClass(value.call(this, j2, getClass(this)));
              });
            }
            classes = classesToArray(value);
            if (classes.length) {
              while (elem = this[i++]) {
                curValue = getClass(elem);
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  j = 0;
                  while (clazz = classes[j++]) {
                    if (cur.indexOf(" " + clazz + " ") < 0) {
                      cur += clazz + " ";
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                  }
                }
              }
            }
            return this;
          },
          removeClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (isFunction(value)) {
              return this.each(function(j2) {
                jQuery2(this).removeClass(value.call(this, j2, getClass(this)));
              });
            }
            if (!arguments.length) {
              return this.attr("class", "");
            }
            classes = classesToArray(value);
            if (classes.length) {
              while (elem = this[i++]) {
                curValue = getClass(elem);
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  j = 0;
                  while (clazz = classes[j++]) {
                    while (cur.indexOf(" " + clazz + " ") > -1) {
                      cur = cur.replace(" " + clazz + " ", " ");
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                  }
                }
              }
            }
            return this;
          },
          toggleClass: function(value, stateVal) {
            var type = typeof value, isValidValue = type === "string" || Array.isArray(value);
            if (typeof stateVal === "boolean" && isValidValue) {
              return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            if (isFunction(value)) {
              return this.each(function(i) {
                jQuery2(this).toggleClass(
                  value.call(this, i, getClass(this), stateVal),
                  stateVal
                );
              });
            }
            return this.each(function() {
              var className, i, self2, classNames;
              if (isValidValue) {
                i = 0;
                self2 = jQuery2(this);
                classNames = classesToArray(value);
                while (className = classNames[i++]) {
                  if (self2.hasClass(className)) {
                    self2.removeClass(className);
                  } else {
                    self2.addClass(className);
                  }
                }
              } else if (value === void 0 || type === "boolean") {
                className = getClass(this);
                if (className) {
                  dataPriv.set(this, "__className__", className);
                }
                if (this.setAttribute) {
                  this.setAttribute(
                    "class",
                    className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                  );
                }
              }
            });
          },
          hasClass: function(selector) {
            var className, elem, i = 0;
            className = " " + selector + " ";
            while (elem = this[i++]) {
              if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                return true;
              }
            }
            return false;
          }
        });
        var rreturn = /\r/g;
        jQuery2.fn.extend({
          val: function(value) {
            var hooks, ret, valueIsFunction, elem = this[0];
            if (!arguments.length) {
              if (elem) {
                hooks = jQuery2.valHooks[elem.type] || jQuery2.valHooks[elem.nodeName.toLowerCase()];
                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                  return ret;
                }
                ret = elem.value;
                if (typeof ret === "string") {
                  return ret.replace(rreturn, "");
                }
                return ret == null ? "" : ret;
              }
              return;
            }
            valueIsFunction = isFunction(value);
            return this.each(function(i) {
              var val;
              if (this.nodeType !== 1) {
                return;
              }
              if (valueIsFunction) {
                val = value.call(this, i, jQuery2(this).val());
              } else {
                val = value;
              }
              if (val == null) {
                val = "";
              } else if (typeof val === "number") {
                val += "";
              } else if (Array.isArray(val)) {
                val = jQuery2.map(val, function(value2) {
                  return value2 == null ? "" : value2 + "";
                });
              }
              hooks = jQuery2.valHooks[this.type] || jQuery2.valHooks[this.nodeName.toLowerCase()];
              if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
                this.value = val;
              }
            });
          }
        });
        jQuery2.extend({
          valHooks: {
            option: {
              get: function(elem) {
                var val = jQuery2.find.attr(elem, "value");
                return val != null ? val : (
                  // Support: IE <=10 - 11 only
                  // option.text throws exceptions (#14686, #14858)
                  // Strip and collapse whitespace
                  // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                  stripAndCollapse(jQuery2.text(elem))
                );
              }
            },
            select: {
              get: function(elem) {
                var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
                if (index < 0) {
                  i = max;
                } else {
                  i = one ? index : 0;
                }
                for (; i < max; i++) {
                  option = options[i];
                  if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                  !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                    value = jQuery2(option).val();
                    if (one) {
                      return value;
                    }
                    values.push(value);
                  }
                }
                return values;
              },
              set: function(elem, value) {
                var optionSet, option, options = elem.options, values = jQuery2.makeArray(value), i = options.length;
                while (i--) {
                  option = options[i];
                  if (option.selected = jQuery2.inArray(jQuery2.valHooks.option.get(option), values) > -1) {
                    optionSet = true;
                  }
                }
                if (!optionSet) {
                  elem.selectedIndex = -1;
                }
                return values;
              }
            }
          }
        });
        jQuery2.each(["radio", "checkbox"], function() {
          jQuery2.valHooks[this] = {
            set: function(elem, value) {
              if (Array.isArray(value)) {
                return elem.checked = jQuery2.inArray(jQuery2(elem).val(), value) > -1;
              }
            }
          };
          if (!support.checkOn) {
            jQuery2.valHooks[this].get = function(elem) {
              return elem.getAttribute("value") === null ? "on" : elem.value;
            };
          }
        });
        support.focusin = "onfocusin" in window2;
        var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
          e.stopPropagation();
        };
        jQuery2.extend(jQuery2.event, {
          trigger: function(event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = lastElement = tmp = elem = elem || document2;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
              return;
            }
            if (rfocusMorph.test(type + jQuery2.event.triggered)) {
              return;
            }
            if (type.indexOf(".") > -1) {
              namespaces = type.split(".");
              type = namespaces.shift();
              namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;
            event = event[jQuery2.expando] ? event : new jQuery2.Event(type, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = void 0;
            if (!event.target) {
              event.target = elem;
            }
            data = data == null ? [event] : jQuery2.makeArray(data, [event]);
            special = jQuery2.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
              return;
            }
            if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
              bubbleType = special.delegateType || type;
              if (!rfocusMorph.test(bubbleType + type)) {
                cur = cur.parentNode;
              }
              for (; cur; cur = cur.parentNode) {
                eventPath.push(cur);
                tmp = cur;
              }
              if (tmp === (elem.ownerDocument || document2)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
              }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
              lastElement = cur;
              event.type = i > 1 ? bubbleType : special.bindType || type;
              handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
              if (handle) {
                handle.apply(cur, data);
              }
              handle = ontype && cur[ontype];
              if (handle && handle.apply && acceptData(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
              if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
                if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                  tmp = elem[ontype];
                  if (tmp) {
                    elem[ontype] = null;
                  }
                  jQuery2.event.triggered = type;
                  if (event.isPropagationStopped()) {
                    lastElement.addEventListener(type, stopPropagationCallback);
                  }
                  elem[type]();
                  if (event.isPropagationStopped()) {
                    lastElement.removeEventListener(type, stopPropagationCallback);
                  }
                  jQuery2.event.triggered = void 0;
                  if (tmp) {
                    elem[ontype] = tmp;
                  }
                }
              }
            }
            return event.result;
          },
          // Piggyback on a donor event to simulate a different one
          // Used only for `focus(in | out)` events
          simulate: function(type, elem, event) {
            var e = jQuery2.extend(
              new jQuery2.Event(),
              event,
              {
                type,
                isSimulated: true
              }
            );
            jQuery2.event.trigger(e, null, elem);
          }
        });
        jQuery2.fn.extend({
          trigger: function(type, data) {
            return this.each(function() {
              jQuery2.event.trigger(type, data, this);
            });
          },
          triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) {
              return jQuery2.event.trigger(type, data, elem, true);
            }
          }
        });
        if (!support.focusin) {
          jQuery2.each({ focus: "focusin", blur: "focusout" }, function(orig, fix) {
            var handler = function(event) {
              jQuery2.event.simulate(fix, event.target, jQuery2.event.fix(event));
            };
            jQuery2.event.special[fix] = {
              setup: function() {
                var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix);
                if (!attaches) {
                  doc.addEventListener(orig, handler, true);
                }
                dataPriv.access(doc, fix, (attaches || 0) + 1);
              },
              teardown: function() {
                var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix) - 1;
                if (!attaches) {
                  doc.removeEventListener(orig, handler, true);
                  dataPriv.remove(doc, fix);
                } else {
                  dataPriv.access(doc, fix, attaches);
                }
              }
            };
          });
        }
        var location2 = window2.location;
        var nonce = { guid: Date.now() };
        var rquery = /\?/;
        jQuery2.parseXML = function(data) {
          var xml, parserErrorElem;
          if (!data || typeof data !== "string") {
            return null;
          }
          try {
            xml = new window2.DOMParser().parseFromString(data, "text/xml");
          } catch (e) {
          }
          parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
          if (!xml || parserErrorElem) {
            jQuery2.error("Invalid XML: " + (parserErrorElem ? jQuery2.map(parserErrorElem.childNodes, function(el) {
              return el.textContent;
            }).join("\n") : data));
          }
          return xml;
        };
        var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
        function buildParams(prefix, obj, traditional, add) {
          var name;
          if (Array.isArray(obj)) {
            jQuery2.each(obj, function(i, v) {
              if (traditional || rbracket.test(prefix)) {
                add(prefix, v);
              } else {
                buildParams(
                  prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                  v,
                  traditional,
                  add
                );
              }
            });
          } else if (!traditional && toType(obj) === "object") {
            for (name in obj) {
              buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
          } else {
            add(prefix, obj);
          }
        }
        jQuery2.param = function(a, traditional) {
          var prefix, s = [], add = function(key, valueOrFunction) {
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
          };
          if (a == null) {
            return "";
          }
          if (Array.isArray(a) || a.jquery && !jQuery2.isPlainObject(a)) {
            jQuery2.each(a, function() {
              add(this.name, this.value);
            });
          } else {
            for (prefix in a) {
              buildParams(prefix, a[prefix], traditional, add);
            }
          }
          return s.join("&");
        };
        jQuery2.fn.extend({
          serialize: function() {
            return jQuery2.param(this.serializeArray());
          },
          serializeArray: function() {
            return this.map(function() {
              var elements = jQuery2.prop(this, "elements");
              return elements ? jQuery2.makeArray(elements) : this;
            }).filter(function() {
              var type = this.type;
              return this.name && !jQuery2(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function(_i, elem) {
              var val = jQuery2(this).val();
              if (val == null) {
                return null;
              }
              if (Array.isArray(val)) {
                return jQuery2.map(val, function(val2) {
                  return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
                });
              }
              return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
          }
        });
        var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
        originAnchor.href = location2.href;
        function addToPrefiltersOrTransports(structure) {
          return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
              func = dataTypeExpression;
              dataTypeExpression = "*";
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
            if (isFunction(func)) {
              while (dataType = dataTypes[i++]) {
                if (dataType[0] === "+") {
                  dataType = dataType.slice(1) || "*";
                  (structure[dataType] = structure[dataType] || []).unshift(func);
                } else {
                  (structure[dataType] = structure[dataType] || []).push(func);
                }
              }
            }
          };
        }
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
          var inspected = {}, seekingTransport = structure === transports;
          function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery2.each(structure[dataType] || [], function(_, prefilterOrFactory) {
              var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
              if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                options.dataTypes.unshift(dataTypeOrTransport);
                inspect(dataTypeOrTransport);
                return false;
              } else if (seekingTransport) {
                return !(selected = dataTypeOrTransport);
              }
            });
            return selected;
          }
          return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
        }
        function ajaxExtend(target, src) {
          var key, deep, flatOptions = jQuery2.ajaxSettings.flatOptions || {};
          for (key in src) {
            if (src[key] !== void 0) {
              (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
          }
          if (deep) {
            jQuery2.extend(true, target, deep);
          }
          return target;
        }
        function ajaxHandleResponses(s, jqXHR, responses) {
          var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
          while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === void 0) {
              ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
          }
          if (ct) {
            for (type in contents) {
              if (contents[type] && contents[type].test(ct)) {
                dataTypes.unshift(type);
                break;
              }
            }
          }
          if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
          } else {
            for (type in responses) {
              if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                finalDataType = type;
                break;
              }
              if (!firstDataType) {
                firstDataType = type;
              }
            }
            finalDataType = finalDataType || firstDataType;
          }
          if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
              dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
          }
        }
        function ajaxConvert(s, response, jqXHR, isSuccess) {
          var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
          if (dataTypes[1]) {
            for (conv in s.converters) {
              converters[conv.toLowerCase()] = s.converters[conv];
            }
          }
          current = dataTypes.shift();
          while (current) {
            if (s.responseFields[current]) {
              jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
              response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
              if (current === "*") {
                current = prev;
              } else if (prev !== "*" && prev !== current) {
                conv = converters[prev + " " + current] || converters["* " + current];
                if (!conv) {
                  for (conv2 in converters) {
                    tmp = conv2.split(" ");
                    if (tmp[1] === current) {
                      conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                      if (conv) {
                        if (conv === true) {
                          conv = converters[conv2];
                        } else if (converters[conv2] !== true) {
                          current = tmp[0];
                          dataTypes.unshift(tmp[1]);
                        }
                        break;
                      }
                    }
                  }
                }
                if (conv !== true) {
                  if (conv && s.throws) {
                    response = conv(response);
                  } else {
                    try {
                      response = conv(response);
                    } catch (e) {
                      return {
                        state: "parsererror",
                        error: conv ? e : "No conversion from " + prev + " to " + current
                      };
                    }
                  }
                }
              }
            }
          }
          return { state: "success", data: response };
        }
        jQuery2.extend({
          // Counter for holding the number of active queries
          active: 0,
          // Last-Modified header cache for next request
          lastModified: {},
          etag: {},
          ajaxSettings: {
            url: location2.href,
            type: "GET",
            isLocal: rlocalProtocol.test(location2.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */
            accepts: {
              "*": allTypes,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript"
            },
            contents: {
              xml: /\bxml\b/,
              html: /\bhtml/,
              json: /\bjson\b/
            },
            responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON"
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
              // Convert anything to text
              "* text": String,
              // Text to html (true = no transformation)
              "text html": true,
              // Evaluate text as a json expression
              "text json": JSON.parse,
              // Parse text as xml
              "text xml": jQuery2.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
              url: true,
              context: true
            }
          },
          // Creates a full fledged settings object into target
          // with both ajaxSettings and settings fields.
          // If target is omitted, writes into ajaxSettings.
          ajaxSetup: function(target, settings) {
            return settings ? (
              // Building a settings object
              ajaxExtend(ajaxExtend(target, jQuery2.ajaxSettings), settings)
            ) : (
              // Extending ajaxSettings
              ajaxExtend(jQuery2.ajaxSettings, target)
            );
          },
          ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
          ajaxTransport: addToPrefiltersOrTransports(transports),
          // Main method
          ajax: function(url, options) {
            if (typeof url === "object") {
              options = url;
              url = void 0;
            }
            options = options || {};
            var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery2.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery2(callbackContext) : jQuery2.event, deferred = jQuery2.Deferred(), completeDeferred = jQuery2.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
              readyState: 0,
              // Builds headers hashtable if needed
              getResponseHeader: function(key) {
                var match;
                if (completed2) {
                  if (!responseHeaders) {
                    responseHeaders = {};
                    while (match = rheaders.exec(responseHeadersString)) {
                      responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                    }
                  }
                  match = responseHeaders[key.toLowerCase() + " "];
                }
                return match == null ? null : match.join(", ");
              },
              // Raw string
              getAllResponseHeaders: function() {
                return completed2 ? responseHeadersString : null;
              },
              // Caches the header
              setRequestHeader: function(name, value) {
                if (completed2 == null) {
                  name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                  requestHeaders[name] = value;
                }
                return this;
              },
              // Overrides response content-type header
              overrideMimeType: function(type) {
                if (completed2 == null) {
                  s.mimeType = type;
                }
                return this;
              },
              // Status-dependent callbacks
              statusCode: function(map) {
                var code;
                if (map) {
                  if (completed2) {
                    jqXHR.always(map[jqXHR.status]);
                  } else {
                    for (code in map) {
                      statusCode[code] = [statusCode[code], map[code]];
                    }
                  }
                }
                return this;
              },
              // Cancel the request
              abort: function(statusText) {
                var finalText = statusText || strAbort;
                if (transport) {
                  transport.abort(finalText);
                }
                done(0, finalText);
                return this;
              }
            };
            deferred.promise(jqXHR);
            s.url = ((url || s.url || location2.href) + "").replace(rprotocol, location2.protocol + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
            if (s.crossDomain == null) {
              urlAnchor = document2.createElement("a");
              try {
                urlAnchor.href = s.url;
                urlAnchor.href = urlAnchor.href;
                s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
              } catch (e) {
                s.crossDomain = true;
              }
            }
            if (s.data && s.processData && typeof s.data !== "string") {
              s.data = jQuery2.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (completed2) {
              return jqXHR;
            }
            fireGlobals = jQuery2.event && s.global;
            if (fireGlobals && jQuery2.active++ === 0) {
              jQuery2.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url.replace(rhash, "");
            if (!s.hasContent) {
              uncached = s.url.slice(cacheURL.length);
              if (s.data && (s.processData || typeof s.data === "string")) {
                cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
                delete s.data;
              }
              if (s.cache === false) {
                cacheURL = cacheURL.replace(rantiCache, "$1");
                uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
              }
              s.url = cacheURL + uncached;
            } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
              s.data = s.data.replace(r20, "+");
            }
            if (s.ifModified) {
              if (jQuery2.lastModified[cacheURL]) {
                jqXHR.setRequestHeader("If-Modified-Since", jQuery2.lastModified[cacheURL]);
              }
              if (jQuery2.etag[cacheURL]) {
                jqXHR.setRequestHeader("If-None-Match", jQuery2.etag[cacheURL]);
              }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
              jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader(
              "Accept",
              s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
            );
            for (i in s.headers) {
              jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
              return jqXHR.abort();
            }
            strAbort = "abort";
            completeDeferred.add(s.complete);
            jqXHR.done(s.success);
            jqXHR.fail(s.error);
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
              done(-1, "No Transport");
            } else {
              jqXHR.readyState = 1;
              if (fireGlobals) {
                globalEventContext.trigger("ajaxSend", [jqXHR, s]);
              }
              if (completed2) {
                return jqXHR;
              }
              if (s.async && s.timeout > 0) {
                timeoutTimer = window2.setTimeout(function() {
                  jqXHR.abort("timeout");
                }, s.timeout);
              }
              try {
                completed2 = false;
                transport.send(requestHeaders, done);
              } catch (e) {
                if (completed2) {
                  throw e;
                }
                done(-1, e);
              }
            }
            function done(status, nativeStatusText, responses, headers) {
              var isSuccess, success, error, response, modified, statusText = nativeStatusText;
              if (completed2) {
                return;
              }
              completed2 = true;
              if (timeoutTimer) {
                window2.clearTimeout(timeoutTimer);
              }
              transport = void 0;
              responseHeadersString = headers || "";
              jqXHR.readyState = status > 0 ? 4 : 0;
              isSuccess = status >= 200 && status < 300 || status === 304;
              if (responses) {
                response = ajaxHandleResponses(s, jqXHR, responses);
              }
              if (!isSuccess && jQuery2.inArray("script", s.dataTypes) > -1 && jQuery2.inArray("json", s.dataTypes) < 0) {
                s.converters["text script"] = function() {
                };
              }
              response = ajaxConvert(s, response, jqXHR, isSuccess);
              if (isSuccess) {
                if (s.ifModified) {
                  modified = jqXHR.getResponseHeader("Last-Modified");
                  if (modified) {
                    jQuery2.lastModified[cacheURL] = modified;
                  }
                  modified = jqXHR.getResponseHeader("etag");
                  if (modified) {
                    jQuery2.etag[cacheURL] = modified;
                  }
                }
                if (status === 204 || s.type === "HEAD") {
                  statusText = "nocontent";
                } else if (status === 304) {
                  statusText = "notmodified";
                } else {
                  statusText = response.state;
                  success = response.data;
                  error = response.error;
                  isSuccess = !error;
                }
              } else {
                error = statusText;
                if (status || !statusText) {
                  statusText = "error";
                  if (status < 0) {
                    status = 0;
                  }
                }
              }
              jqXHR.status = status;
              jqXHR.statusText = (nativeStatusText || statusText) + "";
              if (isSuccess) {
                deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
              } else {
                deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
              }
              jqXHR.statusCode(statusCode);
              statusCode = void 0;
              if (fireGlobals) {
                globalEventContext.trigger(
                  isSuccess ? "ajaxSuccess" : "ajaxError",
                  [jqXHR, s, isSuccess ? success : error]
                );
              }
              completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
              if (fireGlobals) {
                globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                if (!--jQuery2.active) {
                  jQuery2.event.trigger("ajaxStop");
                }
              }
            }
            return jqXHR;
          },
          getJSON: function(url, data, callback) {
            return jQuery2.get(url, data, callback, "json");
          },
          getScript: function(url, callback) {
            return jQuery2.get(url, void 0, callback, "script");
          }
        });
        jQuery2.each(["get", "post"], function(_i, method) {
          jQuery2[method] = function(url, data, callback, type) {
            if (isFunction(data)) {
              type = type || callback;
              callback = data;
              data = void 0;
            }
            return jQuery2.ajax(jQuery2.extend({
              url,
              type: method,
              dataType: type,
              data,
              success: callback
            }, jQuery2.isPlainObject(url) && url));
          };
        });
        jQuery2.ajaxPrefilter(function(s) {
          var i;
          for (i in s.headers) {
            if (i.toLowerCase() === "content-type") {
              s.contentType = s.headers[i] || "";
            }
          }
        });
        jQuery2._evalUrl = function(url, options, doc) {
          return jQuery2.ajax({
            url,
            // Make this explicit, since user can override this through ajaxSetup (#11264)
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            global: false,
            // Only evaluate the response if it is successful (gh-4126)
            // dataFilter is not invoked for failure responses, so using it instead
            // of the default converter is kludgy but it works.
            converters: {
              "text script": function() {
              }
            },
            dataFilter: function(response) {
              jQuery2.globalEval(response, options, doc);
            }
          });
        };
        jQuery2.fn.extend({
          wrapAll: function(html) {
            var wrap;
            if (this[0]) {
              if (isFunction(html)) {
                html = html.call(this[0]);
              }
              wrap = jQuery2(html, this[0].ownerDocument).eq(0).clone(true);
              if (this[0].parentNode) {
                wrap.insertBefore(this[0]);
              }
              wrap.map(function() {
                var elem = this;
                while (elem.firstElementChild) {
                  elem = elem.firstElementChild;
                }
                return elem;
              }).append(this);
            }
            return this;
          },
          wrapInner: function(html) {
            if (isFunction(html)) {
              return this.each(function(i) {
                jQuery2(this).wrapInner(html.call(this, i));
              });
            }
            return this.each(function() {
              var self2 = jQuery2(this), contents = self2.contents();
              if (contents.length) {
                contents.wrapAll(html);
              } else {
                self2.append(html);
              }
            });
          },
          wrap: function(html) {
            var htmlIsFunction = isFunction(html);
            return this.each(function(i) {
              jQuery2(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
            });
          },
          unwrap: function(selector) {
            this.parent(selector).not("body").each(function() {
              jQuery2(this).replaceWith(this.childNodes);
            });
            return this;
          }
        });
        jQuery2.expr.pseudos.hidden = function(elem) {
          return !jQuery2.expr.pseudos.visible(elem);
        };
        jQuery2.expr.pseudos.visible = function(elem) {
          return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        };
        jQuery2.ajaxSettings.xhr = function() {
          try {
            return new window2.XMLHttpRequest();
          } catch (e) {
          }
        };
        var xhrSuccessStatus = {
          // File protocol always yields status code 0, assume 200
          0: 200,
          // Support: IE <=9 only
          // #1450: sometimes IE returns 1223 when it should be 204
          1223: 204
        }, xhrSupported = jQuery2.ajaxSettings.xhr();
        support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
        support.ajax = xhrSupported = !!xhrSupported;
        jQuery2.ajaxTransport(function(options) {
          var callback, errorCallback;
          if (support.cors || xhrSupported && !options.crossDomain) {
            return {
              send: function(headers, complete) {
                var i, xhr = options.xhr();
                xhr.open(
                  options.type,
                  options.url,
                  options.async,
                  options.username,
                  options.password
                );
                if (options.xhrFields) {
                  for (i in options.xhrFields) {
                    xhr[i] = options.xhrFields[i];
                  }
                }
                if (options.mimeType && xhr.overrideMimeType) {
                  xhr.overrideMimeType(options.mimeType);
                }
                if (!options.crossDomain && !headers["X-Requested-With"]) {
                  headers["X-Requested-With"] = "XMLHttpRequest";
                }
                for (i in headers) {
                  xhr.setRequestHeader(i, headers[i]);
                }
                callback = function(type) {
                  return function() {
                    if (callback) {
                      callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                      if (type === "abort") {
                        xhr.abort();
                      } else if (type === "error") {
                        if (typeof xhr.status !== "number") {
                          complete(0, "error");
                        } else {
                          complete(
                            // File: protocol always yields status 0; see #8605, #14207
                            xhr.status,
                            xhr.statusText
                          );
                        }
                      } else {
                        complete(
                          xhrSuccessStatus[xhr.status] || xhr.status,
                          xhr.statusText,
                          // Support: IE <=9 only
                          // IE9 has no XHR2 but throws on binary (trac-11426)
                          // For XHR2 non-text, let the caller handle it (gh-2498)
                          (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                          xhr.getAllResponseHeaders()
                        );
                      }
                    }
                  };
                };
                xhr.onload = callback();
                errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
                if (xhr.onabort !== void 0) {
                  xhr.onabort = errorCallback;
                } else {
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                      window2.setTimeout(function() {
                        if (callback) {
                          errorCallback();
                        }
                      });
                    }
                  };
                }
                callback = callback("abort");
                try {
                  xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                  if (callback) {
                    throw e;
                  }
                }
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        jQuery2.ajaxPrefilter(function(s) {
          if (s.crossDomain) {
            s.contents.script = false;
          }
        });
        jQuery2.ajaxSetup({
          accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
          },
          contents: {
            script: /\b(?:java|ecma)script\b/
          },
          converters: {
            "text script": function(text) {
              jQuery2.globalEval(text);
              return text;
            }
          }
        });
        jQuery2.ajaxPrefilter("script", function(s) {
          if (s.cache === void 0) {
            s.cache = false;
          }
          if (s.crossDomain) {
            s.type = "GET";
          }
        });
        jQuery2.ajaxTransport("script", function(s) {
          if (s.crossDomain || s.scriptAttrs) {
            var script, callback;
            return {
              send: function(_, complete) {
                script = jQuery2("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                  script.remove();
                  callback = null;
                  if (evt) {
                    complete(evt.type === "error" ? 404 : 200, evt.type);
                  }
                });
                document2.head.appendChild(script[0]);
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery2.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery2.expando + "_" + nonce.guid++;
            this[callback] = true;
            return callback;
          }
        });
        jQuery2.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
          var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
          if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
              s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
              s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
              if (!responseContainer) {
                jQuery2.error(callbackName + " was not called");
              }
              return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window2[callbackName];
            window2[callbackName] = function() {
              responseContainer = arguments;
            };
            jqXHR.always(function() {
              if (overwritten === void 0) {
                jQuery2(window2).removeProp(callbackName);
              } else {
                window2[callbackName] = overwritten;
              }
              if (s[callbackName]) {
                s.jsonpCallback = originalSettings.jsonpCallback;
                oldCallbacks.push(callbackName);
              }
              if (responseContainer && isFunction(overwritten)) {
                overwritten(responseContainer[0]);
              }
              responseContainer = overwritten = void 0;
            });
            return "script";
          }
        });
        support.createHTMLDocument = (function() {
          var body = document2.implementation.createHTMLDocument("").body;
          body.innerHTML = "<form></form><form></form>";
          return body.childNodes.length === 2;
        })();
        jQuery2.parseHTML = function(data, context, keepScripts) {
          if (typeof data !== "string") {
            return [];
          }
          if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
          }
          var base, parsed, scripts;
          if (!context) {
            if (support.createHTMLDocument) {
              context = document2.implementation.createHTMLDocument("");
              base = context.createElement("base");
              base.href = document2.location.href;
              context.head.appendChild(base);
            } else {
              context = document2;
            }
          }
          parsed = rsingleTag.exec(data);
          scripts = !keepScripts && [];
          if (parsed) {
            return [context.createElement(parsed[1])];
          }
          parsed = buildFragment([data], context, scripts);
          if (scripts && scripts.length) {
            jQuery2(scripts).remove();
          }
          return jQuery2.merge([], parsed.childNodes);
        };
        jQuery2.fn.load = function(url, params, callback) {
          var selector, type, response, self2 = this, off = url.indexOf(" ");
          if (off > -1) {
            selector = stripAndCollapse(url.slice(off));
            url = url.slice(0, off);
          }
          if (isFunction(params)) {
            callback = params;
            params = void 0;
          } else if (params && typeof params === "object") {
            type = "POST";
          }
          if (self2.length > 0) {
            jQuery2.ajax({
              url,
              // If "type" variable is undefined, then "GET" method will be used.
              // Make value of this field explicit since
              // user can override it through ajaxSetup method
              type: type || "GET",
              dataType: "html",
              data: params
            }).done(function(responseText) {
              response = arguments;
              self2.html(selector ? (
                // If a selector was specified, locate the right elements in a dummy div
                // Exclude scripts to avoid IE 'Permission Denied' errors
                jQuery2("<div>").append(jQuery2.parseHTML(responseText)).find(selector)
              ) : (
                // Otherwise use the full result
                responseText
              ));
            }).always(callback && function(jqXHR, status) {
              self2.each(function() {
                callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
              });
            });
          }
          return this;
        };
        jQuery2.expr.pseudos.animated = function(elem) {
          return jQuery2.grep(jQuery2.timers, function(fn) {
            return elem === fn.elem;
          }).length;
        };
        jQuery2.offset = {
          setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery2.css(elem, "position"), curElem = jQuery2(elem), props = {};
            if (position === "static") {
              elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery2.css(elem, "top");
            curCSSLeft = jQuery2.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
            if (calculatePosition) {
              curPosition = curElem.position();
              curTop = curPosition.top;
              curLeft = curPosition.left;
            } else {
              curTop = parseFloat(curCSSTop) || 0;
              curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (isFunction(options)) {
              options = options.call(elem, i, jQuery2.extend({}, curOffset));
            }
            if (options.top != null) {
              props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
              props.left = options.left - curOffset.left + curLeft;
            }
            if ("using" in options) {
              options.using.call(elem, props);
            } else {
              curElem.css(props);
            }
          }
        };
        jQuery2.fn.extend({
          // offset() relates an element's border box to the document origin
          offset: function(options) {
            if (arguments.length) {
              return options === void 0 ? this : this.each(function(i) {
                jQuery2.offset.setOffset(this, options, i);
              });
            }
            var rect, win, elem = this[0];
            if (!elem) {
              return;
            }
            if (!elem.getClientRects().length) {
              return { top: 0, left: 0 };
            }
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;
            return {
              top: rect.top + win.pageYOffset,
              left: rect.left + win.pageXOffset
            };
          },
          // position() relates an element's margin box to its offset parent's padding box
          // This corresponds to the behavior of CSS absolute positioning
          position: function() {
            if (!this[0]) {
              return;
            }
            var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
            if (jQuery2.css(elem, "position") === "fixed") {
              offset = elem.getBoundingClientRect();
            } else {
              offset = this.offset();
              doc = elem.ownerDocument;
              offsetParent = elem.offsetParent || doc.documentElement;
              while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery2.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.parentNode;
              }
              if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                parentOffset = jQuery2(offsetParent).offset();
                parentOffset.top += jQuery2.css(offsetParent, "borderTopWidth", true);
                parentOffset.left += jQuery2.css(offsetParent, "borderLeftWidth", true);
              }
            }
            return {
              top: offset.top - parentOffset.top - jQuery2.css(elem, "marginTop", true),
              left: offset.left - parentOffset.left - jQuery2.css(elem, "marginLeft", true)
            };
          },
          // This method will return documentElement in the following cases:
          // 1) For the element inside the iframe without offsetParent, this method will return
          //    documentElement of the parent window
          // 2) For the hidden or detached element
          // 3) For body or html element, i.e. in case of the html node - it will return itself
          //
          // but those exceptions were never presented as a real life use-cases
          // and might be considered as more preferable results.
          //
          // This logic, however, is not guaranteed and can change at any point in the future
          offsetParent: function() {
            return this.map(function() {
              var offsetParent = this.offsetParent;
              while (offsetParent && jQuery2.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
              }
              return offsetParent || documentElement;
            });
          }
        });
        jQuery2.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
          var top = "pageYOffset" === prop;
          jQuery2.fn[method] = function(val) {
            return access(this, function(elem, method2, val2) {
              var win;
              if (isWindow(elem)) {
                win = elem;
              } else if (elem.nodeType === 9) {
                win = elem.defaultView;
              }
              if (val2 === void 0) {
                return win ? win[prop] : elem[method2];
              }
              if (win) {
                win.scrollTo(
                  !top ? val2 : win.pageXOffset,
                  top ? val2 : win.pageYOffset
                );
              } else {
                elem[method2] = val2;
              }
            }, method, val, arguments.length);
          };
        });
        jQuery2.each(["top", "left"], function(_i, prop) {
          jQuery2.cssHooks[prop] = addGetHookIf(
            support.pixelPosition,
            function(elem, computed) {
              if (computed) {
                computed = curCSS(elem, prop);
                return rnumnonpx.test(computed) ? jQuery2(elem).position()[prop] + "px" : computed;
              }
            }
          );
        });
        jQuery2.each({ Height: "height", Width: "width" }, function(name, type) {
          jQuery2.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
          }, function(defaultExtra, funcName) {
            jQuery2.fn[funcName] = function(margin, value) {
              var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
              return access(this, function(elem, type2, value2) {
                var doc;
                if (isWindow(elem)) {
                  return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
                }
                if (elem.nodeType === 9) {
                  doc = elem.documentElement;
                  return Math.max(
                    elem.body["scroll" + name],
                    doc["scroll" + name],
                    elem.body["offset" + name],
                    doc["offset" + name],
                    doc["client" + name]
                  );
                }
                return value2 === void 0 ? (
                  // Get width or height on the element, requesting but not forcing parseFloat
                  jQuery2.css(elem, type2, extra)
                ) : (
                  // Set width or height on the element
                  jQuery2.style(elem, type2, value2, extra)
                );
              }, type, chainable ? margin : void 0, chainable);
            };
          });
        });
        jQuery2.each([
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend"
        ], function(_i, type) {
          jQuery2.fn[type] = function(fn) {
            return this.on(type, fn);
          };
        });
        jQuery2.fn.extend({
          bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
          },
          unbind: function(types, fn) {
            return this.off(types, null, fn);
          },
          delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
          },
          undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
          },
          hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
          }
        });
        jQuery2.each(
          "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
          function(_i, name) {
            jQuery2.fn[name] = function(data, fn) {
              return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
            };
          }
        );
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        jQuery2.proxy = function(fn, context) {
          var tmp, args, proxy;
          if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
          }
          if (!isFunction(fn)) {
            return void 0;
          }
          args = slice.call(arguments, 2);
          proxy = function() {
            return fn.apply(context || this, args.concat(slice.call(arguments)));
          };
          proxy.guid = fn.guid = fn.guid || jQuery2.guid++;
          return proxy;
        };
        jQuery2.holdReady = function(hold) {
          if (hold) {
            jQuery2.readyWait++;
          } else {
            jQuery2.ready(true);
          }
        };
        jQuery2.isArray = Array.isArray;
        jQuery2.parseJSON = JSON.parse;
        jQuery2.nodeName = nodeName;
        jQuery2.isFunction = isFunction;
        jQuery2.isWindow = isWindow;
        jQuery2.camelCase = camelCase;
        jQuery2.type = toType;
        jQuery2.now = Date.now;
        jQuery2.isNumeric = function(obj) {
          var type = jQuery2.type(obj);
          return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
          // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
          // subtraction forces infinities to NaN
          !isNaN(obj - parseFloat(obj));
        };
        jQuery2.trim = function(text) {
          return text == null ? "" : (text + "").replace(rtrim, "");
        };
        if (typeof define === "function" && define.amd) {
          define("jquery", [], function() {
            return jQuery2;
          });
        }
        var _jQuery = window2.jQuery, _$ = window2.$;
        jQuery2.noConflict = function(deep) {
          if (window2.$ === jQuery2) {
            window2.$ = _$;
          }
          if (deep && window2.jQuery === jQuery2) {
            window2.jQuery = _jQuery;
          }
          return jQuery2;
        };
        if (typeof noGlobal === "undefined") {
          window2.jQuery = window2.$ = jQuery2;
        }
        return jQuery2;
      });
    }
  });

  // node_modules/@rails/ujs/lib/assets/compiled/rails-ujs.js
  var require_rails_ujs = __commonJS({
    "node_modules/@rails/ujs/lib/assets/compiled/rails-ujs.js"(exports, module) {
      (function() {
        var context = this;
        (function() {
          (function() {
            this.Rails = {
              linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
              buttonClickSelector: {
                selector: "button[data-remote]:not([form]), button[data-confirm]:not([form])",
                exclude: "form button"
              },
              inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
              formSubmitSelector: "form:not([data-turbo=true])",
              formInputClickSelector: "form:not([data-turbo=true]) input[type=submit], form:not([data-turbo=true]) input[type=image], form:not([data-turbo=true]) button[type=submit], form:not([data-turbo=true]) button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
              formDisableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
              formEnableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
              fileInputSelector: "input[name][type=file]:not([disabled])",
              linkDisableSelector: "a[data-disable-with], a[data-disable]",
              buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]"
            };
          }).call(this);
        }).call(context);
        var Rails = context.Rails;
        (function() {
          (function() {
            var nonce;
            nonce = null;
            Rails.loadCSPNonce = function() {
              var ref;
              return nonce = (ref = document.querySelector("meta[name=csp-nonce]")) != null ? ref.content : void 0;
            };
            Rails.cspNonce = function() {
              return nonce != null ? nonce : Rails.loadCSPNonce();
            };
          }).call(this);
          (function() {
            var expando, m;
            m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
            Rails.matches = function(element, selector) {
              if (selector.exclude != null) {
                return m.call(element, selector.selector) && !m.call(element, selector.exclude);
              } else {
                return m.call(element, selector);
              }
            };
            expando = "_ujsData";
            Rails.getData = function(element, key) {
              var ref;
              return (ref = element[expando]) != null ? ref[key] : void 0;
            };
            Rails.setData = function(element, key, value) {
              if (element[expando] == null) {
                element[expando] = {};
              }
              return element[expando][key] = value;
            };
            Rails.$ = function(selector) {
              return Array.prototype.slice.call(document.querySelectorAll(selector));
            };
          }).call(this);
          (function() {
            var $2, csrfParam, csrfToken;
            $2 = Rails.$;
            csrfToken = Rails.csrfToken = function() {
              var meta;
              meta = document.querySelector("meta[name=csrf-token]");
              return meta && meta.content;
            };
            csrfParam = Rails.csrfParam = function() {
              var meta;
              meta = document.querySelector("meta[name=csrf-param]");
              return meta && meta.content;
            };
            Rails.CSRFProtection = function(xhr) {
              var token;
              token = csrfToken();
              if (token != null) {
                return xhr.setRequestHeader("X-CSRF-Token", token);
              }
            };
            Rails.refreshCSRFTokens = function() {
              var param, token;
              token = csrfToken();
              param = csrfParam();
              if (token != null && param != null) {
                return $2('form input[name="' + param + '"]').forEach(function(input) {
                  return input.value = token;
                });
              }
            };
          }).call(this);
          (function() {
            var CustomEvent2, fire, matches, preventDefault;
            matches = Rails.matches;
            CustomEvent2 = window.CustomEvent;
            if (typeof CustomEvent2 !== "function") {
              CustomEvent2 = function(event, params) {
                var evt;
                evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
              };
              CustomEvent2.prototype = window.Event.prototype;
              preventDefault = CustomEvent2.prototype.preventDefault;
              CustomEvent2.prototype.preventDefault = function() {
                var result;
                result = preventDefault.call(this);
                if (this.cancelable && !this.defaultPrevented) {
                  Object.defineProperty(this, "defaultPrevented", {
                    get: function() {
                      return true;
                    }
                  });
                }
                return result;
              };
            }
            fire = Rails.fire = function(obj, name, data) {
              var event;
              event = new CustomEvent2(name, {
                bubbles: true,
                cancelable: true,
                detail: data
              });
              obj.dispatchEvent(event);
              return !event.defaultPrevented;
            };
            Rails.stopEverything = function(e) {
              fire(e.target, "ujs:everythingStopped");
              e.preventDefault();
              e.stopPropagation();
              return e.stopImmediatePropagation();
            };
            Rails.delegate = function(element, selector, eventType, handler) {
              return element.addEventListener(eventType, function(e) {
                var target;
                target = e.target;
                while (!(!(target instanceof Element) || matches(target, selector))) {
                  target = target.parentNode;
                }
                if (target instanceof Element && handler.call(target, e) === false) {
                  e.preventDefault();
                  return e.stopPropagation();
                }
              });
            };
          }).call(this);
          (function() {
            var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;
            cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;
            AcceptHeaders = {
              "*": "*/*",
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript",
              script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            };
            Rails.ajax = function(options) {
              var xhr;
              options = prepareOptions(options);
              xhr = createXHR(options, function() {
                var ref, response;
                response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader("Content-Type"));
                if (Math.floor(xhr.status / 100) === 2) {
                  if (typeof options.success === "function") {
                    options.success(response, xhr.statusText, xhr);
                  }
                } else {
                  if (typeof options.error === "function") {
                    options.error(response, xhr.statusText, xhr);
                  }
                }
                return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
              });
              if (options.beforeSend != null && !options.beforeSend(xhr, options)) {
                return false;
              }
              if (xhr.readyState === XMLHttpRequest.OPENED) {
                return xhr.send(options.data);
              }
            };
            prepareOptions = function(options) {
              options.url = options.url || location.href;
              options.type = options.type.toUpperCase();
              if (options.type === "GET" && options.data) {
                if (options.url.indexOf("?") < 0) {
                  options.url += "?" + options.data;
                } else {
                  options.url += "&" + options.data;
                }
              }
              if (AcceptHeaders[options.dataType] == null) {
                options.dataType = "*";
              }
              options.accept = AcceptHeaders[options.dataType];
              if (options.dataType !== "*") {
                options.accept += ", */*; q=0.01";
              }
              return options;
            };
            createXHR = function(options, done) {
              var xhr;
              xhr = new XMLHttpRequest();
              xhr.open(options.type, options.url, true);
              xhr.setRequestHeader("Accept", options.accept);
              if (typeof options.data === "string") {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
              }
              if (!options.crossDomain) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                CSRFProtection(xhr);
              }
              xhr.withCredentials = !!options.withCredentials;
              xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                  return done(xhr);
                }
              };
              return xhr;
            };
            processResponse = function(response, type) {
              var parser, script;
              if (typeof response === "string" && typeof type === "string") {
                if (type.match(/\bjson\b/)) {
                  try {
                    response = JSON.parse(response);
                  } catch (error) {
                  }
                } else if (type.match(/\b(?:java|ecma)script\b/)) {
                  script = document.createElement("script");
                  script.setAttribute("nonce", cspNonce());
                  script.text = response;
                  document.head.appendChild(script).parentNode.removeChild(script);
                } else if (type.match(/\b(xml|html|svg)\b/)) {
                  parser = new DOMParser();
                  type = type.replace(/;.+/, "");
                  try {
                    response = parser.parseFromString(response, type);
                  } catch (error) {
                  }
                }
              }
              return response;
            };
            Rails.href = function(element) {
              return element.href;
            };
            Rails.isCrossDomain = function(url) {
              var e, originAnchor, urlAnchor;
              originAnchor = document.createElement("a");
              originAnchor.href = location.href;
              urlAnchor = document.createElement("a");
              try {
                urlAnchor.href = url;
                return !((!urlAnchor.protocol || urlAnchor.protocol === ":") && !urlAnchor.host || originAnchor.protocol + "//" + originAnchor.host === urlAnchor.protocol + "//" + urlAnchor.host);
              } catch (error) {
                e = error;
                return true;
              }
            };
          }).call(this);
          (function() {
            var matches, toArray;
            matches = Rails.matches;
            toArray = function(e) {
              return Array.prototype.slice.call(e);
            };
            Rails.serializeElement = function(element, additionalParam) {
              var inputs, params;
              inputs = [element];
              if (matches(element, "form")) {
                inputs = toArray(element.elements);
              }
              params = [];
              inputs.forEach(function(input) {
                if (!input.name || input.disabled) {
                  return;
                }
                if (matches(input, "fieldset[disabled] *")) {
                  return;
                }
                if (matches(input, "select")) {
                  return toArray(input.options).forEach(function(option) {
                    if (option.selected) {
                      return params.push({
                        name: input.name,
                        value: option.value
                      });
                    }
                  });
                } else if (input.checked || ["radio", "checkbox", "submit"].indexOf(input.type) === -1) {
                  return params.push({
                    name: input.name,
                    value: input.value
                  });
                }
              });
              if (additionalParam) {
                params.push(additionalParam);
              }
              return params.map(function(param) {
                if (param.name != null) {
                  return encodeURIComponent(param.name) + "=" + encodeURIComponent(param.value);
                } else {
                  return param;
                }
              }).join("&");
            };
            Rails.formElements = function(form, selector) {
              if (matches(form, "form")) {
                return toArray(form.elements).filter(function(el) {
                  return matches(el, selector);
                });
              } else {
                return toArray(form.querySelectorAll(selector));
              }
            };
          }).call(this);
          (function() {
            var allowAction, fire, stopEverything;
            fire = Rails.fire, stopEverything = Rails.stopEverything;
            Rails.handleConfirm = function(e) {
              if (!allowAction(this)) {
                return stopEverything(e);
              }
            };
            Rails.confirm = function(message, element) {
              return confirm(message);
            };
            allowAction = function(element) {
              var answer, callback, message;
              message = element.getAttribute("data-confirm");
              if (!message) {
                return true;
              }
              answer = false;
              if (fire(element, "confirm")) {
                try {
                  answer = Rails.confirm(message, element);
                } catch (error) {
                }
                callback = fire(element, "confirm:complete", [answer]);
              }
              return answer && callback;
            };
          }).call(this);
          (function() {
            var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, isXhrRedirect, matches, setData, stopEverything;
            matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;
            Rails.handleDisabledElement = function(e) {
              var element;
              element = this;
              if (element.disabled) {
                return stopEverything(e);
              }
            };
            Rails.enableElement = function(e) {
              var element;
              if (e instanceof Event) {
                if (isXhrRedirect(e)) {
                  return;
                }
                element = e.target;
              } else {
                element = e;
              }
              if (matches(element, Rails.linkDisableSelector)) {
                return enableLinkElement(element);
              } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
                return enableFormElement(element);
              } else if (matches(element, Rails.formSubmitSelector)) {
                return enableFormElements(element);
              }
            };
            Rails.disableElement = function(e) {
              var element;
              element = e instanceof Event ? e.target : e;
              if (matches(element, Rails.linkDisableSelector)) {
                return disableLinkElement(element);
              } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
                return disableFormElement(element);
              } else if (matches(element, Rails.formSubmitSelector)) {
                return disableFormElements(element);
              }
            };
            disableLinkElement = function(element) {
              var replacement;
              if (getData(element, "ujs:disabled")) {
                return;
              }
              replacement = element.getAttribute("data-disable-with");
              if (replacement != null) {
                setData(element, "ujs:enable-with", element.innerHTML);
                element.innerHTML = replacement;
              }
              element.addEventListener("click", stopEverything);
              return setData(element, "ujs:disabled", true);
            };
            enableLinkElement = function(element) {
              var originalText;
              originalText = getData(element, "ujs:enable-with");
              if (originalText != null) {
                element.innerHTML = originalText;
                setData(element, "ujs:enable-with", null);
              }
              element.removeEventListener("click", stopEverything);
              return setData(element, "ujs:disabled", null);
            };
            disableFormElements = function(form) {
              return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
            };
            disableFormElement = function(element) {
              var replacement;
              if (getData(element, "ujs:disabled")) {
                return;
              }
              replacement = element.getAttribute("data-disable-with");
              if (replacement != null) {
                if (matches(element, "button")) {
                  setData(element, "ujs:enable-with", element.innerHTML);
                  element.innerHTML = replacement;
                } else {
                  setData(element, "ujs:enable-with", element.value);
                  element.value = replacement;
                }
              }
              element.disabled = true;
              return setData(element, "ujs:disabled", true);
            };
            enableFormElements = function(form) {
              return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
            };
            enableFormElement = function(element) {
              var originalText;
              originalText = getData(element, "ujs:enable-with");
              if (originalText != null) {
                if (matches(element, "button")) {
                  element.innerHTML = originalText;
                } else {
                  element.value = originalText;
                }
                setData(element, "ujs:enable-with", null);
              }
              element.disabled = false;
              return setData(element, "ujs:disabled", null);
            };
            isXhrRedirect = function(event) {
              var ref, xhr;
              xhr = (ref = event.detail) != null ? ref[0] : void 0;
              return (xhr != null ? xhr.getResponseHeader("X-Xhr-Redirect") : void 0) != null;
            };
          }).call(this);
          (function() {
            var stopEverything;
            stopEverything = Rails.stopEverything;
            Rails.handleMethod = function(e) {
              var csrfParam, csrfToken, form, formContent, href, link, method;
              link = this;
              method = link.getAttribute("data-method");
              if (!method) {
                return;
              }
              href = Rails.href(link);
              csrfToken = Rails.csrfToken();
              csrfParam = Rails.csrfParam();
              form = document.createElement("form");
              formContent = "<input name='_method' value='" + method + "' type='hidden' />";
              if (csrfParam != null && csrfToken != null && !Rails.isCrossDomain(href)) {
                formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
              }
              formContent += '<input type="submit" />';
              form.method = "post";
              form.action = href;
              form.target = link.target;
              form.innerHTML = formContent;
              form.style.display = "none";
              document.body.appendChild(form);
              form.querySelector('[type="submit"]').click();
              return stopEverything(e);
            };
          }).call(this);
          (function() {
            var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything, slice = [].slice;
            matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;
            isRemote = function(element) {
              var value;
              value = element.getAttribute("data-remote");
              return value != null && value !== "false";
            };
            Rails.handleRemote = function(e) {
              var button, data, dataType, element, method, url, withCredentials;
              element = this;
              if (!isRemote(element)) {
                return true;
              }
              if (!fire(element, "ajax:before")) {
                fire(element, "ajax:stopped");
                return false;
              }
              withCredentials = element.getAttribute("data-with-credentials");
              dataType = element.getAttribute("data-type") || "script";
              if (matches(element, Rails.formSubmitSelector)) {
                button = getData(element, "ujs:submit-button");
                method = getData(element, "ujs:submit-button-formmethod") || element.method;
                url = getData(element, "ujs:submit-button-formaction") || element.getAttribute("action") || location.href;
                if (method.toUpperCase() === "GET") {
                  url = url.replace(/\?.*$/, "");
                }
                if (element.enctype === "multipart/form-data") {
                  data = new FormData(element);
                  if (button != null) {
                    data.append(button.name, button.value);
                  }
                } else {
                  data = serializeElement(element, button);
                }
                setData(element, "ujs:submit-button", null);
                setData(element, "ujs:submit-button-formmethod", null);
                setData(element, "ujs:submit-button-formaction", null);
              } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
                method = element.getAttribute("data-method");
                url = element.getAttribute("data-url");
                data = serializeElement(element, element.getAttribute("data-params"));
              } else {
                method = element.getAttribute("data-method");
                url = Rails.href(element);
                data = element.getAttribute("data-params");
              }
              ajax({
                type: method || "GET",
                url,
                data,
                dataType,
                beforeSend: function(xhr, options) {
                  if (fire(element, "ajax:beforeSend", [xhr, options])) {
                    return fire(element, "ajax:send", [xhr]);
                  } else {
                    fire(element, "ajax:stopped");
                    return false;
                  }
                },
                success: function() {
                  var args;
                  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                  return fire(element, "ajax:success", args);
                },
                error: function() {
                  var args;
                  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                  return fire(element, "ajax:error", args);
                },
                complete: function() {
                  var args;
                  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                  return fire(element, "ajax:complete", args);
                },
                crossDomain: isCrossDomain(url),
                withCredentials: withCredentials != null && withCredentials !== "false"
              });
              return stopEverything(e);
            };
            Rails.formSubmitButtonClick = function(e) {
              var button, form;
              button = this;
              form = button.form;
              if (!form) {
                return;
              }
              if (button.name) {
                setData(form, "ujs:submit-button", {
                  name: button.name,
                  value: button.value
                });
              }
              setData(form, "ujs:formnovalidate-button", button.formNoValidate);
              setData(form, "ujs:submit-button-formaction", button.getAttribute("formaction"));
              return setData(form, "ujs:submit-button-formmethod", button.getAttribute("formmethod"));
            };
            Rails.preventInsignificantClick = function(e) {
              var data, insignificantMetaClick, link, metaClick, method, nonPrimaryMouseClick;
              link = this;
              method = (link.getAttribute("data-method") || "GET").toUpperCase();
              data = link.getAttribute("data-params");
              metaClick = e.metaKey || e.ctrlKey;
              insignificantMetaClick = metaClick && method === "GET" && !data;
              nonPrimaryMouseClick = e.button != null && e.button !== 0;
              if (nonPrimaryMouseClick || insignificantMetaClick) {
                return e.stopImmediatePropagation();
              }
            };
          }).call(this);
          (function() {
            var $2, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMethod, handleRemote, loadCSPNonce, preventInsignificantClick, refreshCSRFTokens;
            fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $2 = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, loadCSPNonce = Rails.loadCSPNonce, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, preventInsignificantClick = Rails.preventInsignificantClick, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMethod = Rails.handleMethod;
            if (typeof jQuery !== "undefined" && jQuery !== null && jQuery.ajax != null) {
              if (jQuery.rails) {
                throw new Error("If you load both jquery_ujs and rails-ujs, use rails-ujs only.");
              }
              jQuery.rails = Rails;
              jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
                if (!options.crossDomain) {
                  return CSRFProtection(xhr);
                }
              });
            }
            Rails.start = function() {
              if (window._rails_loaded) {
                throw new Error("rails-ujs has already been loaded!");
              }
              window.addEventListener("pageshow", function() {
                $2(Rails.formEnableSelector).forEach(function(el) {
                  if (getData(el, "ujs:disabled")) {
                    return enableElement(el);
                  }
                });
                return $2(Rails.linkDisableSelector).forEach(function(el) {
                  if (getData(el, "ujs:disabled")) {
                    return enableElement(el);
                  }
                });
              });
              delegate(document, Rails.linkDisableSelector, "ajax:complete", enableElement);
              delegate(document, Rails.linkDisableSelector, "ajax:stopped", enableElement);
              delegate(document, Rails.buttonDisableSelector, "ajax:complete", enableElement);
              delegate(document, Rails.buttonDisableSelector, "ajax:stopped", enableElement);
              delegate(document, Rails.linkClickSelector, "click", preventInsignificantClick);
              delegate(document, Rails.linkClickSelector, "click", handleDisabledElement);
              delegate(document, Rails.linkClickSelector, "click", handleConfirm);
              delegate(document, Rails.linkClickSelector, "click", disableElement);
              delegate(document, Rails.linkClickSelector, "click", handleRemote);
              delegate(document, Rails.linkClickSelector, "click", handleMethod);
              delegate(document, Rails.buttonClickSelector, "click", preventInsignificantClick);
              delegate(document, Rails.buttonClickSelector, "click", handleDisabledElement);
              delegate(document, Rails.buttonClickSelector, "click", handleConfirm);
              delegate(document, Rails.buttonClickSelector, "click", disableElement);
              delegate(document, Rails.buttonClickSelector, "click", handleRemote);
              delegate(document, Rails.inputChangeSelector, "change", handleDisabledElement);
              delegate(document, Rails.inputChangeSelector, "change", handleConfirm);
              delegate(document, Rails.inputChangeSelector, "change", handleRemote);
              delegate(document, Rails.formSubmitSelector, "submit", handleDisabledElement);
              delegate(document, Rails.formSubmitSelector, "submit", handleConfirm);
              delegate(document, Rails.formSubmitSelector, "submit", handleRemote);
              delegate(document, Rails.formSubmitSelector, "submit", function(e) {
                return setTimeout((function() {
                  return disableElement(e);
                }), 13);
              });
              delegate(document, Rails.formSubmitSelector, "ajax:send", disableElement);
              delegate(document, Rails.formSubmitSelector, "ajax:complete", enableElement);
              delegate(document, Rails.formInputClickSelector, "click", preventInsignificantClick);
              delegate(document, Rails.formInputClickSelector, "click", handleDisabledElement);
              delegate(document, Rails.formInputClickSelector, "click", handleConfirm);
              delegate(document, Rails.formInputClickSelector, "click", formSubmitButtonClick);
              document.addEventListener("DOMContentLoaded", refreshCSRFTokens);
              document.addEventListener("DOMContentLoaded", loadCSPNonce);
              return window._rails_loaded = true;
            };
            if (window.Rails === Rails && fire(document, "rails:attachBindings")) {
              Rails.start();
            }
          }).call(this);
        }).call(this);
        if (typeof module === "object" && module.exports) {
          module.exports = Rails;
        } else if (typeof define === "function" && define.amd) {
          define(Rails);
        }
      }).call(exports);
    }
  });

  // node_modules/@rails/activestorage/app/assets/javascripts/activestorage.js
  var require_activestorage = __commonJS({
    "node_modules/@rails/activestorage/app/assets/javascripts/activestorage.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ActiveStorage = {});
      })(exports, function(exports2) {
        "use strict";
        function createCommonjsModule(fn, module2) {
          return module2 = {
            exports: {}
          }, fn(module2, module2.exports), module2.exports;
        }
        var sparkMd5 = createCommonjsModule(function(module2, exports3) {
          (function(factory) {
            {
              module2.exports = factory();
            }
          })(function(undefined2) {
            var hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            function md5cycle(x, k) {
              var a = x[0], b = x[1], c = x[2], d = x[3];
              a += (b & c | ~b & d) + k[0] - 680876936 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[1] - 389564586 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[2] + 606105819 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & c | ~b & d) + k[4] - 176418897 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[7] - 45705983 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[10] - 42063 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[13] - 40341101 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & d | c & ~d) + k[1] - 165796510 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[11] + 643717713 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[0] - 373897302 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b & d | c & ~d) + k[5] - 701558691 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[10] + 38016083 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[15] - 660478335 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[4] - 405537848 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b & d | c & ~d) + k[9] + 568446438 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[3] - 187363961 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[2] - 51403784 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b ^ c ^ d) + k[5] - 378558 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[14] - 35309556 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[7] - 155497632 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (b ^ c ^ d) + k[13] + 681279174 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[0] - 358537222 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[3] - 722521979 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[6] + 76029189 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (b ^ c ^ d) + k[9] - 640364487 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[12] - 421815835 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[15] + 530742520 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[2] - 995338651 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              x[0] = a + x[0] | 0;
              x[1] = b + x[1] | 0;
              x[2] = c + x[2] | 0;
              x[3] = d + x[3] | 0;
            }
            function md5blk(s) {
              var md5blks = [], i;
              for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
              }
              return md5blks;
            }
            function md5blk_array(a) {
              var md5blks = [], i;
              for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
              }
              return md5blks;
            }
            function md51(s) {
              var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
              for (i = 64; i <= n; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
              }
              s = s.substring(i - 64);
              length = s.length;
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
              }
              tail[i >> 2] |= 128 << (i % 4 << 3);
              if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
                }
              }
              tmp = n * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(state, tail);
              return state;
            }
            function md51_array(a) {
              var n = a.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
              for (i = 64; i <= n; i += 64) {
                md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
              }
              a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
              length = a.length;
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= a[i] << (i % 4 << 3);
              }
              tail[i >> 2] |= 128 << (i % 4 << 3);
              if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
                }
              }
              tmp = n * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(state, tail);
              return state;
            }
            function rhex(n) {
              var s = "", j;
              for (j = 0; j < 4; j += 1) {
                s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
              }
              return s;
            }
            function hex(x) {
              var i;
              for (i = 0; i < x.length; i += 1) {
                x[i] = rhex(x[i]);
              }
              return x.join("");
            }
            if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
            if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
              (function() {
                function clamp(val, length) {
                  val = val | 0 || 0;
                  if (val < 0) {
                    return Math.max(val + length, 0);
                  }
                  return Math.min(val, length);
                }
                ArrayBuffer.prototype.slice = function(from, to) {
                  var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
                  if (to !== undefined2) {
                    end = clamp(to, length);
                  }
                  if (begin > end) {
                    return new ArrayBuffer(0);
                  }
                  num = end - begin;
                  target = new ArrayBuffer(num);
                  targetArray = new Uint8Array(target);
                  sourceArray = new Uint8Array(this, begin, num);
                  targetArray.set(sourceArray);
                  return target;
                };
              })();
            }
            function toUtf8(str) {
              if (/[\u0080-\uFFFF]/.test(str)) {
                str = unescape(encodeURIComponent(str));
              }
              return str;
            }
            function utf8Str2ArrayBuffer(str, returnUInt8Array) {
              var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
              for (i = 0; i < length; i += 1) {
                arr[i] = str.charCodeAt(i);
              }
              return returnUInt8Array ? arr : buff;
            }
            function arrayBuffer2Utf8Str(buff) {
              return String.fromCharCode.apply(null, new Uint8Array(buff));
            }
            function concatenateArrayBuffers(first, second, returnUInt8Array) {
              var result = new Uint8Array(first.byteLength + second.byteLength);
              result.set(new Uint8Array(first));
              result.set(new Uint8Array(second), first.byteLength);
              return returnUInt8Array ? result : result.buffer;
            }
            function hexToBinaryString(hex2) {
              var bytes = [], length = hex2.length, x;
              for (x = 0; x < length - 1; x += 2) {
                bytes.push(parseInt(hex2.substr(x, 2), 16));
              }
              return String.fromCharCode.apply(String, bytes);
            }
            function SparkMD5() {
              this.reset();
            }
            SparkMD5.prototype.append = function(str) {
              this.appendBinary(toUtf8(str));
              return this;
            };
            SparkMD5.prototype.appendBinary = function(contents) {
              this._buff += contents;
              this._length += contents.length;
              var length = this._buff.length, i;
              for (i = 64; i <= length; i += 64) {
                md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
              }
              this._buff = this._buff.substring(i - 64);
              return this;
            };
            SparkMD5.prototype.end = function(raw) {
              var buff = this._buff, length = buff.length, i, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ret;
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
              }
              this._finish(tail, length);
              ret = hex(this._hash);
              if (raw) {
                ret = hexToBinaryString(ret);
              }
              this.reset();
              return ret;
            };
            SparkMD5.prototype.reset = function() {
              this._buff = "";
              this._length = 0;
              this._hash = [1732584193, -271733879, -1732584194, 271733878];
              return this;
            };
            SparkMD5.prototype.getState = function() {
              return {
                buff: this._buff,
                length: this._length,
                hash: this._hash
              };
            };
            SparkMD5.prototype.setState = function(state) {
              this._buff = state.buff;
              this._length = state.length;
              this._hash = state.hash;
              return this;
            };
            SparkMD5.prototype.destroy = function() {
              delete this._hash;
              delete this._buff;
              delete this._length;
            };
            SparkMD5.prototype._finish = function(tail, length) {
              var i = length, tmp, lo, hi;
              tail[i >> 2] |= 128 << (i % 4 << 3);
              if (i > 55) {
                md5cycle(this._hash, tail);
                for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
                }
              }
              tmp = this._length * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(this._hash, tail);
            };
            SparkMD5.hash = function(str, raw) {
              return SparkMD5.hashBinary(toUtf8(str), raw);
            };
            SparkMD5.hashBinary = function(content, raw) {
              var hash = md51(content), ret = hex(hash);
              return raw ? hexToBinaryString(ret) : ret;
            };
            SparkMD5.ArrayBuffer = function() {
              this.reset();
            };
            SparkMD5.ArrayBuffer.prototype.append = function(arr) {
              var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
              this._length += arr.byteLength;
              for (i = 64; i <= length; i += 64) {
                md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
              }
              this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
              return this;
            };
            SparkMD5.ArrayBuffer.prototype.end = function(raw) {
              var buff = this._buff, length = buff.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i, ret;
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= buff[i] << (i % 4 << 3);
              }
              this._finish(tail, length);
              ret = hex(this._hash);
              if (raw) {
                ret = hexToBinaryString(ret);
              }
              this.reset();
              return ret;
            };
            SparkMD5.ArrayBuffer.prototype.reset = function() {
              this._buff = new Uint8Array(0);
              this._length = 0;
              this._hash = [1732584193, -271733879, -1732584194, 271733878];
              return this;
            };
            SparkMD5.ArrayBuffer.prototype.getState = function() {
              var state = SparkMD5.prototype.getState.call(this);
              state.buff = arrayBuffer2Utf8Str(state.buff);
              return state;
            };
            SparkMD5.ArrayBuffer.prototype.setState = function(state) {
              state.buff = utf8Str2ArrayBuffer(state.buff, true);
              return SparkMD5.prototype.setState.call(this, state);
            };
            SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
            SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
            SparkMD5.ArrayBuffer.hash = function(arr, raw) {
              var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
              return raw ? hexToBinaryString(ret) : ret;
            };
            return SparkMD5;
          });
        });
        var classCallCheck = function(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };
        var createClass = /* @__PURE__ */ (function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();
        var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        var FileChecksum = (function() {
          createClass(FileChecksum2, null, [{
            key: "create",
            value: function create(file, callback) {
              var instance = new FileChecksum2(file);
              instance.create(callback);
            }
          }]);
          function FileChecksum2(file) {
            classCallCheck(this, FileChecksum2);
            this.file = file;
            this.chunkSize = 2097152;
            this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
            this.chunkIndex = 0;
          }
          createClass(FileChecksum2, [{
            key: "create",
            value: function create(callback) {
              var _this = this;
              this.callback = callback;
              this.md5Buffer = new sparkMd5.ArrayBuffer();
              this.fileReader = new FileReader();
              this.fileReader.addEventListener("load", function(event) {
                return _this.fileReaderDidLoad(event);
              });
              this.fileReader.addEventListener("error", function(event) {
                return _this.fileReaderDidError(event);
              });
              this.readNextChunk();
            }
          }, {
            key: "fileReaderDidLoad",
            value: function fileReaderDidLoad(event) {
              this.md5Buffer.append(event.target.result);
              if (!this.readNextChunk()) {
                var binaryDigest = this.md5Buffer.end(true);
                var base64digest = btoa(binaryDigest);
                this.callback(null, base64digest);
              }
            }
          }, {
            key: "fileReaderDidError",
            value: function fileReaderDidError(event) {
              this.callback("Error reading " + this.file.name);
            }
          }, {
            key: "readNextChunk",
            value: function readNextChunk() {
              if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
                var start4 = this.chunkIndex * this.chunkSize;
                var end = Math.min(start4 + this.chunkSize, this.file.size);
                var bytes = fileSlice.call(this.file, start4, end);
                this.fileReader.readAsArrayBuffer(bytes);
                this.chunkIndex++;
                return true;
              } else {
                return false;
              }
            }
          }]);
          return FileChecksum2;
        })();
        function getMetaValue(name) {
          var element = findElement(document.head, 'meta[name="' + name + '"]');
          if (element) {
            return element.getAttribute("content");
          }
        }
        function findElements(root, selector) {
          if (typeof root == "string") {
            selector = root;
            root = document;
          }
          var elements = root.querySelectorAll(selector);
          return toArray$1(elements);
        }
        function findElement(root, selector) {
          if (typeof root == "string") {
            selector = root;
            root = document;
          }
          return root.querySelector(selector);
        }
        function dispatchEvent2(element, type) {
          var eventInit = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          var disabled = element.disabled;
          var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
          var event = document.createEvent("Event");
          event.initEvent(type, bubbles || true, cancelable || true);
          event.detail = detail || {};
          try {
            element.disabled = false;
            element.dispatchEvent(event);
          } finally {
            element.disabled = disabled;
          }
          return event;
        }
        function toArray$1(value) {
          if (Array.isArray(value)) {
            return value;
          } else if (Array.from) {
            return Array.from(value);
          } else {
            return [].slice.call(value);
          }
        }
        var BlobRecord = (function() {
          function BlobRecord2(file, checksum, url) {
            var _this = this;
            classCallCheck(this, BlobRecord2);
            this.file = file;
            this.attributes = {
              filename: file.name,
              content_type: file.type || "application/octet-stream",
              byte_size: file.size,
              checksum
            };
            this.xhr = new XMLHttpRequest();
            this.xhr.open("POST", url, true);
            this.xhr.responseType = "json";
            this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.setRequestHeader("Accept", "application/json");
            this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var csrfToken = getMetaValue("csrf-token");
            if (csrfToken != void 0) {
              this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
            }
            this.xhr.addEventListener("load", function(event) {
              return _this.requestDidLoad(event);
            });
            this.xhr.addEventListener("error", function(event) {
              return _this.requestDidError(event);
            });
          }
          createClass(BlobRecord2, [{
            key: "create",
            value: function create(callback) {
              this.callback = callback;
              this.xhr.send(JSON.stringify({
                blob: this.attributes
              }));
            }
          }, {
            key: "requestDidLoad",
            value: function requestDidLoad(event) {
              if (this.status >= 200 && this.status < 300) {
                var response = this.response;
                var direct_upload = response.direct_upload;
                delete response.direct_upload;
                this.attributes = response;
                this.directUploadData = direct_upload;
                this.callback(null, this.toJSON());
              } else {
                this.requestDidError(event);
              }
            }
          }, {
            key: "requestDidError",
            value: function requestDidError(event) {
              this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
            }
          }, {
            key: "toJSON",
            value: function toJSON() {
              var result = {};
              for (var key in this.attributes) {
                result[key] = this.attributes[key];
              }
              return result;
            }
          }, {
            key: "status",
            get: function get$$1() {
              return this.xhr.status;
            }
          }, {
            key: "response",
            get: function get$$1() {
              var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
              if (responseType == "json") {
                return response;
              } else {
                return JSON.parse(response);
              }
            }
          }]);
          return BlobRecord2;
        })();
        var BlobUpload = (function() {
          function BlobUpload2(blob) {
            var _this = this;
            classCallCheck(this, BlobUpload2);
            this.blob = blob;
            this.file = blob.file;
            var _blob$directUploadDat = blob.directUploadData, url = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
            this.xhr = new XMLHttpRequest();
            this.xhr.open("PUT", url, true);
            this.xhr.responseType = "text";
            for (var key in headers) {
              this.xhr.setRequestHeader(key, headers[key]);
            }
            this.xhr.addEventListener("load", function(event) {
              return _this.requestDidLoad(event);
            });
            this.xhr.addEventListener("error", function(event) {
              return _this.requestDidError(event);
            });
          }
          createClass(BlobUpload2, [{
            key: "create",
            value: function create(callback) {
              this.callback = callback;
              this.xhr.send(this.file.slice());
            }
          }, {
            key: "requestDidLoad",
            value: function requestDidLoad(event) {
              var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
              if (status >= 200 && status < 300) {
                this.callback(null, response);
              } else {
                this.requestDidError(event);
              }
            }
          }, {
            key: "requestDidError",
            value: function requestDidError(event) {
              this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
            }
          }]);
          return BlobUpload2;
        })();
        var id = 0;
        var DirectUpload = (function() {
          function DirectUpload2(file, url, delegate) {
            classCallCheck(this, DirectUpload2);
            this.id = ++id;
            this.file = file;
            this.url = url;
            this.delegate = delegate;
          }
          createClass(DirectUpload2, [{
            key: "create",
            value: function create(callback) {
              var _this = this;
              FileChecksum.create(this.file, function(error, checksum) {
                if (error) {
                  callback(error);
                  return;
                }
                var blob = new BlobRecord(_this.file, checksum, _this.url);
                notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
                blob.create(function(error2) {
                  if (error2) {
                    callback(error2);
                  } else {
                    var upload = new BlobUpload(blob);
                    notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
                    upload.create(function(error3) {
                      if (error3) {
                        callback(error3);
                      } else {
                        callback(null, blob.toJSON());
                      }
                    });
                  }
                });
              });
            }
          }]);
          return DirectUpload2;
        })();
        function notify(object, methodName) {
          if (object && typeof object[methodName] == "function") {
            for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              messages[_key - 2] = arguments[_key];
            }
            return object[methodName].apply(object, messages);
          }
        }
        var DirectUploadController = (function() {
          function DirectUploadController2(input, file) {
            classCallCheck(this, DirectUploadController2);
            this.input = input;
            this.file = file;
            this.directUpload = new DirectUpload(this.file, this.url, this);
            this.dispatch("initialize");
          }
          createClass(DirectUploadController2, [{
            key: "start",
            value: function start4(callback) {
              var _this = this;
              var hiddenInput = document.createElement("input");
              hiddenInput.type = "hidden";
              hiddenInput.name = this.input.name;
              this.input.insertAdjacentElement("beforebegin", hiddenInput);
              this.dispatch("start");
              this.directUpload.create(function(error, attributes) {
                if (error) {
                  hiddenInput.parentNode.removeChild(hiddenInput);
                  _this.dispatchError(error);
                } else {
                  hiddenInput.value = attributes.signed_id;
                }
                _this.dispatch("end");
                callback(error);
              });
            }
          }, {
            key: "uploadRequestDidProgress",
            value: function uploadRequestDidProgress(event) {
              var progress = event.loaded / event.total * 100;
              if (progress) {
                this.dispatch("progress", {
                  progress
                });
              }
            }
          }, {
            key: "dispatch",
            value: function dispatch2(name) {
              var detail = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              detail.file = this.file;
              detail.id = this.directUpload.id;
              return dispatchEvent2(this.input, "direct-upload:" + name, {
                detail
              });
            }
          }, {
            key: "dispatchError",
            value: function dispatchError(error) {
              var event = this.dispatch("error", {
                error
              });
              if (!event.defaultPrevented) {
                alert(error);
              }
            }
          }, {
            key: "directUploadWillCreateBlobWithXHR",
            value: function directUploadWillCreateBlobWithXHR(xhr) {
              this.dispatch("before-blob-request", {
                xhr
              });
            }
          }, {
            key: "directUploadWillStoreFileWithXHR",
            value: function directUploadWillStoreFileWithXHR(xhr) {
              var _this2 = this;
              this.dispatch("before-storage-request", {
                xhr
              });
              xhr.upload.addEventListener("progress", function(event) {
                return _this2.uploadRequestDidProgress(event);
              });
            }
          }, {
            key: "url",
            get: function get$$1() {
              return this.input.getAttribute("data-direct-upload-url");
            }
          }]);
          return DirectUploadController2;
        })();
        var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
        var DirectUploadsController = (function() {
          function DirectUploadsController2(form) {
            classCallCheck(this, DirectUploadsController2);
            this.form = form;
            this.inputs = findElements(form, inputSelector).filter(function(input) {
              return input.files.length;
            });
          }
          createClass(DirectUploadsController2, [{
            key: "start",
            value: function start4(callback) {
              var _this = this;
              var controllers = this.createDirectUploadControllers();
              var startNextController = function startNextController2() {
                var controller = controllers.shift();
                if (controller) {
                  controller.start(function(error) {
                    if (error) {
                      callback(error);
                      _this.dispatch("end");
                    } else {
                      startNextController2();
                    }
                  });
                } else {
                  callback();
                  _this.dispatch("end");
                }
              };
              this.dispatch("start");
              startNextController();
            }
          }, {
            key: "createDirectUploadControllers",
            value: function createDirectUploadControllers() {
              var controllers = [];
              this.inputs.forEach(function(input) {
                toArray$1(input.files).forEach(function(file) {
                  var controller = new DirectUploadController(input, file);
                  controllers.push(controller);
                });
              });
              return controllers;
            }
          }, {
            key: "dispatch",
            value: function dispatch2(name) {
              var detail = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              return dispatchEvent2(this.form, "direct-uploads:" + name, {
                detail
              });
            }
          }]);
          return DirectUploadsController2;
        })();
        var processingAttribute = "data-direct-uploads-processing";
        var submitButtonsByForm = /* @__PURE__ */ new WeakMap();
        var started = false;
        function start3() {
          if (!started) {
            started = true;
            document.addEventListener("click", didClick, true);
            document.addEventListener("submit", didSubmitForm);
            document.addEventListener("ajax:before", didSubmitRemoteElement);
          }
        }
        function didClick(event) {
          var target = event.target;
          if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
            submitButtonsByForm.set(target.form, target);
          }
        }
        function didSubmitForm(event) {
          handleFormSubmissionEvent(event);
        }
        function didSubmitRemoteElement(event) {
          if (event.target.tagName == "FORM") {
            handleFormSubmissionEvent(event);
          }
        }
        function handleFormSubmissionEvent(event) {
          var form = event.target;
          if (form.hasAttribute(processingAttribute)) {
            event.preventDefault();
            return;
          }
          var controller = new DirectUploadsController(form);
          var inputs = controller.inputs;
          if (inputs.length) {
            event.preventDefault();
            form.setAttribute(processingAttribute, "");
            inputs.forEach(disable);
            controller.start(function(error) {
              form.removeAttribute(processingAttribute);
              if (error) {
                inputs.forEach(enable);
              } else {
                submitForm(form);
              }
            });
          }
        }
        function submitForm(form) {
          var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
          if (button) {
            var _button = button, disabled = _button.disabled;
            button.disabled = false;
            button.focus();
            button.click();
            button.disabled = disabled;
          } else {
            button = document.createElement("input");
            button.type = "submit";
            button.style.display = "none";
            form.appendChild(button);
            button.click();
            form.removeChild(button);
          }
          submitButtonsByForm.delete(form);
        }
        function disable(input) {
          input.disabled = true;
        }
        function enable(input) {
          input.disabled = false;
        }
        function autostart() {
          if (window.ActiveStorage) {
            start3();
          }
        }
        setTimeout(autostart, 1);
        exports2.start = start3;
        exports2.DirectUpload = DirectUpload;
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
      });
    }
  });

  // node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js
  var require_action_cable = __commonJS({
    "node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ActionCable = {});
      })(exports, function(exports2) {
        "use strict";
        var adapters = {
          logger: self.console,
          WebSocket: self.WebSocket
        };
        var logger = {
          log: function log() {
            if (this.enabled) {
              var _adapters$logger;
              for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
                messages[_key] = arguments[_key];
              }
              messages.push(Date.now());
              (_adapters$logger = adapters.logger).log.apply(_adapters$logger, ["[ActionCable]"].concat(messages));
            }
          }
        };
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
          return typeof obj;
        } : function(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var classCallCheck = function(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };
        var createClass = /* @__PURE__ */ (function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();
        var now2 = function now3() {
          return (/* @__PURE__ */ new Date()).getTime();
        };
        var secondsSince2 = function secondsSince3(time) {
          return (now2() - time) / 1e3;
        };
        var clamp = function clamp2(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };
        var ConnectionMonitor2 = (function() {
          function ConnectionMonitor3(connection) {
            classCallCheck(this, ConnectionMonitor3);
            this.visibilityDidChange = this.visibilityDidChange.bind(this);
            this.connection = connection;
            this.reconnectAttempts = 0;
          }
          ConnectionMonitor3.prototype.start = function start3() {
            if (!this.isRunning()) {
              this.startedAt = now2();
              delete this.stoppedAt;
              this.startPolling();
              addEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms");
            }
          };
          ConnectionMonitor3.prototype.stop = function stop() {
            if (this.isRunning()) {
              this.stoppedAt = now2();
              this.stopPolling();
              removeEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor stopped");
            }
          };
          ConnectionMonitor3.prototype.isRunning = function isRunning() {
            return this.startedAt && !this.stoppedAt;
          };
          ConnectionMonitor3.prototype.recordPing = function recordPing() {
            this.pingedAt = now2();
          };
          ConnectionMonitor3.prototype.recordConnect = function recordConnect() {
            this.reconnectAttempts = 0;
            this.recordPing();
            delete this.disconnectedAt;
            logger.log("ConnectionMonitor recorded connect");
          };
          ConnectionMonitor3.prototype.recordDisconnect = function recordDisconnect() {
            this.disconnectedAt = now2();
            logger.log("ConnectionMonitor recorded disconnect");
          };
          ConnectionMonitor3.prototype.startPolling = function startPolling() {
            this.stopPolling();
            this.poll();
          };
          ConnectionMonitor3.prototype.stopPolling = function stopPolling() {
            clearTimeout(this.pollTimeout);
          };
          ConnectionMonitor3.prototype.poll = function poll() {
            var _this = this;
            this.pollTimeout = setTimeout(function() {
              _this.reconnectIfStale();
              _this.poll();
            }, this.getPollInterval());
          };
          ConnectionMonitor3.prototype.getPollInterval = function getPollInterval() {
            var _constructor$pollInte = this.constructor.pollInterval, min = _constructor$pollInte.min, max = _constructor$pollInte.max, multiplier = _constructor$pollInte.multiplier;
            var interval = multiplier * Math.log(this.reconnectAttempts + 1);
            return Math.round(clamp(interval, min, max) * 1e3);
          };
          ConnectionMonitor3.prototype.reconnectIfStale = function reconnectIfStale() {
            if (this.connectionIsStale()) {
              logger.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + secondsSince2(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
              this.reconnectAttempts++;
              if (this.disconnectedRecently()) {
                logger.log("ConnectionMonitor skipping reopening recent disconnect");
              } else {
                logger.log("ConnectionMonitor reopening");
                this.connection.reopen();
              }
            }
          };
          ConnectionMonitor3.prototype.connectionIsStale = function connectionIsStale() {
            return secondsSince2(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
          };
          ConnectionMonitor3.prototype.disconnectedRecently = function disconnectedRecently() {
            return this.disconnectedAt && secondsSince2(this.disconnectedAt) < this.constructor.staleThreshold;
          };
          ConnectionMonitor3.prototype.visibilityDidChange = function visibilityDidChange() {
            var _this2 = this;
            if (document.visibilityState === "visible") {
              setTimeout(function() {
                if (_this2.connectionIsStale() || !_this2.connection.isOpen()) {
                  logger.log("ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " + document.visibilityState);
                  _this2.connection.reopen();
                }
              }, 200);
            }
          };
          return ConnectionMonitor3;
        })();
        ConnectionMonitor2.pollInterval = {
          min: 3,
          max: 30,
          multiplier: 5
        };
        ConnectionMonitor2.staleThreshold = 6;
        var INTERNAL = {
          message_types: {
            welcome: "welcome",
            disconnect: "disconnect",
            ping: "ping",
            confirmation: "confirm_subscription",
            rejection: "reject_subscription"
          },
          disconnect_reasons: {
            unauthorized: "unauthorized",
            invalid_request: "invalid_request",
            server_restart: "server_restart"
          },
          default_mount_path: "/cable",
          protocols: ["actioncable-v1-json", "actioncable-unsupported"]
        };
        var message_types2 = INTERNAL.message_types, protocols2 = INTERNAL.protocols;
        var supportedProtocols2 = protocols2.slice(0, protocols2.length - 1);
        var indexOf2 = [].indexOf;
        var Connection2 = (function() {
          function Connection3(consumer2) {
            classCallCheck(this, Connection3);
            this.open = this.open.bind(this);
            this.consumer = consumer2;
            this.subscriptions = this.consumer.subscriptions;
            this.monitor = new ConnectionMonitor2(this);
            this.disconnected = true;
          }
          Connection3.prototype.send = function send(data) {
            if (this.isOpen()) {
              this.webSocket.send(JSON.stringify(data));
              return true;
            } else {
              return false;
            }
          };
          Connection3.prototype.open = function open() {
            if (this.isActive()) {
              logger.log("Attempted to open WebSocket, but existing socket is " + this.getState());
              return false;
            } else {
              logger.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + protocols2);
              if (this.webSocket) {
                this.uninstallEventHandlers();
              }
              this.webSocket = new adapters.WebSocket(this.consumer.url, protocols2);
              this.installEventHandlers();
              this.monitor.start();
              return true;
            }
          };
          Connection3.prototype.close = function close() {
            var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
              allowReconnect: true
            }, allowReconnect = _ref.allowReconnect;
            if (!allowReconnect) {
              this.monitor.stop();
            }
            if (this.isActive()) {
              return this.webSocket.close();
            }
          };
          Connection3.prototype.reopen = function reopen() {
            logger.log("Reopening WebSocket, current state is " + this.getState());
            if (this.isActive()) {
              try {
                return this.close();
              } catch (error) {
                logger.log("Failed to reopen WebSocket", error);
              } finally {
                logger.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
                setTimeout(this.open, this.constructor.reopenDelay);
              }
            } else {
              return this.open();
            }
          };
          Connection3.prototype.getProtocol = function getProtocol() {
            if (this.webSocket) {
              return this.webSocket.protocol;
            }
          };
          Connection3.prototype.isOpen = function isOpen() {
            return this.isState("open");
          };
          Connection3.prototype.isActive = function isActive() {
            return this.isState("open", "connecting");
          };
          Connection3.prototype.isProtocolSupported = function isProtocolSupported() {
            return indexOf2.call(supportedProtocols2, this.getProtocol()) >= 0;
          };
          Connection3.prototype.isState = function isState() {
            for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
              states[_key] = arguments[_key];
            }
            return indexOf2.call(states, this.getState()) >= 0;
          };
          Connection3.prototype.getState = function getState() {
            if (this.webSocket) {
              for (var state in adapters.WebSocket) {
                if (adapters.WebSocket[state] === this.webSocket.readyState) {
                  return state.toLowerCase();
                }
              }
            }
            return null;
          };
          Connection3.prototype.installEventHandlers = function installEventHandlers() {
            for (var eventName in this.events) {
              var handler = this.events[eventName].bind(this);
              this.webSocket["on" + eventName] = handler;
            }
          };
          Connection3.prototype.uninstallEventHandlers = function uninstallEventHandlers() {
            for (var eventName in this.events) {
              this.webSocket["on" + eventName] = function() {
              };
            }
          };
          return Connection3;
        })();
        Connection2.reopenDelay = 500;
        Connection2.prototype.events = {
          message: function message(event) {
            if (!this.isProtocolSupported()) {
              return;
            }
            var _JSON$parse = JSON.parse(event.data), identifier = _JSON$parse.identifier, message2 = _JSON$parse.message, reason = _JSON$parse.reason, reconnect = _JSON$parse.reconnect, type = _JSON$parse.type;
            switch (type) {
              case message_types2.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types2.disconnect:
                logger.log("Disconnecting. Reason: " + reason);
                return this.close({
                  allowReconnect: reconnect
                });
              case message_types2.ping:
                return this.monitor.recordPing();
              case message_types2.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types2.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message2);
            }
          },
          open: function open() {
            logger.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function close(event) {
            logger.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function error() {
            logger.log("WebSocket onerror event");
          }
        };
        var extend2 = function extend3(object, properties) {
          if (properties != null) {
            for (var key in properties) {
              var value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };
        var Subscription2 = (function() {
          function Subscription3(consumer2) {
            var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            var mixin = arguments[2];
            classCallCheck(this, Subscription3);
            this.consumer = consumer2;
            this.identifier = JSON.stringify(params);
            extend2(this, mixin);
          }
          Subscription3.prototype.perform = function perform(action) {
            var data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            data.action = action;
            return this.send(data);
          };
          Subscription3.prototype.send = function send(data) {
            return this.consumer.send({
              command: "message",
              identifier: this.identifier,
              data: JSON.stringify(data)
            });
          };
          Subscription3.prototype.unsubscribe = function unsubscribe() {
            return this.consumer.subscriptions.remove(this);
          };
          return Subscription3;
        })();
        var Subscriptions2 = (function() {
          function Subscriptions3(consumer2) {
            classCallCheck(this, Subscriptions3);
            this.consumer = consumer2;
            this.subscriptions = [];
          }
          Subscriptions3.prototype.create = function create(channelName, mixin) {
            var channel = channelName;
            var params = (typeof channel === "undefined" ? "undefined" : _typeof(channel)) === "object" ? channel : {
              channel
            };
            var subscription = new Subscription2(this.consumer, params, mixin);
            return this.add(subscription);
          };
          Subscriptions3.prototype.add = function add(subscription) {
            this.subscriptions.push(subscription);
            this.consumer.ensureActiveConnection();
            this.notify(subscription, "initialized");
            this.sendCommand(subscription, "subscribe");
            return subscription;
          };
          Subscriptions3.prototype.remove = function remove(subscription) {
            this.forget(subscription);
            if (!this.findAll(subscription.identifier).length) {
              this.sendCommand(subscription, "unsubscribe");
            }
            return subscription;
          };
          Subscriptions3.prototype.reject = function reject(identifier) {
            var _this = this;
            return this.findAll(identifier).map(function(subscription) {
              _this.forget(subscription);
              _this.notify(subscription, "rejected");
              return subscription;
            });
          };
          Subscriptions3.prototype.forget = function forget(subscription) {
            this.subscriptions = this.subscriptions.filter(function(s) {
              return s !== subscription;
            });
            return subscription;
          };
          Subscriptions3.prototype.findAll = function findAll(identifier) {
            return this.subscriptions.filter(function(s) {
              return s.identifier === identifier;
            });
          };
          Subscriptions3.prototype.reload = function reload() {
            var _this2 = this;
            return this.subscriptions.map(function(subscription) {
              return _this2.sendCommand(subscription, "subscribe");
            });
          };
          Subscriptions3.prototype.notifyAll = function notifyAll(callbackName) {
            var _this3 = this;
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return this.subscriptions.map(function(subscription) {
              return _this3.notify.apply(_this3, [subscription, callbackName].concat(args));
            });
          };
          Subscriptions3.prototype.notify = function notify(subscription, callbackName) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }
            var subscriptions = void 0;
            if (typeof subscription === "string") {
              subscriptions = this.findAll(subscription);
            } else {
              subscriptions = [subscription];
            }
            return subscriptions.map(function(subscription2) {
              return typeof subscription2[callbackName] === "function" ? subscription2[callbackName].apply(subscription2, args) : void 0;
            });
          };
          Subscriptions3.prototype.sendCommand = function sendCommand(subscription, command) {
            var identifier = subscription.identifier;
            return this.consumer.send({
              command,
              identifier
            });
          };
          return Subscriptions3;
        })();
        var Consumer2 = (function() {
          function Consumer3(url) {
            classCallCheck(this, Consumer3);
            this._url = url;
            this.subscriptions = new Subscriptions2(this);
            this.connection = new Connection2(this);
          }
          Consumer3.prototype.send = function send(data) {
            return this.connection.send(data);
          };
          Consumer3.prototype.connect = function connect() {
            return this.connection.open();
          };
          Consumer3.prototype.disconnect = function disconnect() {
            return this.connection.close({
              allowReconnect: false
            });
          };
          Consumer3.prototype.ensureActiveConnection = function ensureActiveConnection() {
            if (!this.connection.isActive()) {
              return this.connection.open();
            }
          };
          createClass(Consumer3, [{
            key: "url",
            get: function get$$1() {
              return createWebSocketURL2(this._url);
            }
          }]);
          return Consumer3;
        })();
        function createWebSocketURL2(url) {
          if (typeof url === "function") {
            url = url();
          }
          if (url && !/^wss?:/i.test(url)) {
            var a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        }
        function createConsumer4() {
          var url = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getConfig2("url") || INTERNAL.default_mount_path;
          return new Consumer2(url);
        }
        function getConfig2(name) {
          var element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          if (element) {
            return element.getAttribute("content");
          }
        }
        exports2.Connection = Connection2;
        exports2.ConnectionMonitor = ConnectionMonitor2;
        exports2.Consumer = Consumer2;
        exports2.INTERNAL = INTERNAL;
        exports2.Subscription = Subscription2;
        exports2.Subscriptions = Subscriptions2;
        exports2.adapters = adapters;
        exports2.createWebSocketURL = createWebSocketURL2;
        exports2.logger = logger;
        exports2.createConsumer = createConsumer4;
        exports2.getConfig = getConfig2;
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
      });
    }
  });

  // node_modules/hammerjs/hammer.js
  var require_hammer = __commonJS({
    "node_modules/hammerjs/hammer.js"(exports, module) {
      (function(window2, document2, exportName, undefined2) {
        "use strict";
        var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
        var TEST_ELEMENT = document2.createElement("div");
        var TYPE_FUNCTION = "function";
        var round = Math.round;
        var abs = Math.abs;
        var now2 = Date.now;
        function setTimeoutContext(fn, timeout, context) {
          return setTimeout(bindFn(fn, context), timeout);
        }
        function invokeArrayArg(arg, fn, context) {
          if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
          }
          return false;
        }
        function each(obj, iterator, context) {
          var i;
          if (!obj) {
            return;
          }
          if (obj.forEach) {
            obj.forEach(iterator, context);
          } else if (obj.length !== undefined2) {
            i = 0;
            while (i < obj.length) {
              iterator.call(context, obj[i], i, obj);
              i++;
            }
          } else {
            for (i in obj) {
              obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
          }
        }
        function deprecate(method, name, message) {
          var deprecationMessage = "DEPRECATED METHOD: " + name + "\n" + message + " AT \n";
          return function() {
            var e = new Error("get-stack-trace");
            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace";
            var log = window2.console && (window2.console.warn || window2.console.log);
            if (log) {
              log.call(window2.console, deprecationMessage, stack);
            }
            return method.apply(this, arguments);
          };
        }
        var assign;
        if (typeof Object.assign !== "function") {
          assign = function assign2(target) {
            if (target === undefined2 || target === null) {
              throw new TypeError("Cannot convert undefined or null to object");
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
              var source = arguments[index];
              if (source !== undefined2 && source !== null) {
                for (var nextKey in source) {
                  if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                  }
                }
              }
            }
            return output;
          };
        } else {
          assign = Object.assign;
        }
        var extend2 = deprecate(function extend3(dest, src, merge2) {
          var keys = Object.keys(src);
          var i = 0;
          while (i < keys.length) {
            if (!merge2 || merge2 && dest[keys[i]] === undefined2) {
              dest[keys[i]] = src[keys[i]];
            }
            i++;
          }
          return dest;
        }, "extend", "Use `assign`.");
        var merge = deprecate(function merge2(dest, src) {
          return extend2(dest, src, true);
        }, "merge", "Use `assign`.");
        function inherit(child, base, properties) {
          var baseP = base.prototype, childP;
          childP = child.prototype = Object.create(baseP);
          childP.constructor = child;
          childP._super = baseP;
          if (properties) {
            assign(childP, properties);
          }
        }
        function bindFn(fn, context) {
          return function boundFn() {
            return fn.apply(context, arguments);
          };
        }
        function boolOrFn(val, args) {
          if (typeof val == TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined2 : undefined2, args);
          }
          return val;
        }
        function ifUndefined(val1, val2) {
          return val1 === undefined2 ? val2 : val1;
        }
        function addEventListeners(target, types, handler) {
          each(splitStr(types), function(type) {
            target.addEventListener(type, handler, false);
          });
        }
        function removeEventListeners(target, types, handler) {
          each(splitStr(types), function(type) {
            target.removeEventListener(type, handler, false);
          });
        }
        function hasParent(node, parent) {
          while (node) {
            if (node == parent) {
              return true;
            }
            node = node.parentNode;
          }
          return false;
        }
        function inStr(str, find) {
          return str.indexOf(find) > -1;
        }
        function splitStr(str) {
          return str.trim().split(/\s+/g);
        }
        function inArray(src, find, findByKey) {
          if (src.indexOf && !findByKey) {
            return src.indexOf(find);
          } else {
            var i = 0;
            while (i < src.length) {
              if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
                return i;
              }
              i++;
            }
            return -1;
          }
        }
        function toArray(obj) {
          return Array.prototype.slice.call(obj, 0);
        }
        function uniqueArray(src, key, sort) {
          var results = [];
          var values = [];
          var i = 0;
          while (i < src.length) {
            var val = key ? src[i][key] : src[i];
            if (inArray(values, val) < 0) {
              results.push(src[i]);
            }
            values[i] = val;
            i++;
          }
          if (sort) {
            if (!key) {
              results = results.sort();
            } else {
              results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
              });
            }
          }
          return results;
        }
        function prefixed(obj, property) {
          var prefix, prop;
          var camelProp = property[0].toUpperCase() + property.slice(1);
          var i = 0;
          while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = prefix ? prefix + camelProp : property;
            if (prop in obj) {
              return prop;
            }
            i++;
          }
          return undefined2;
        }
        var _uniqueId = 1;
        function uniqueId() {
          return _uniqueId++;
        }
        function getWindowForElement(element) {
          var doc = element.ownerDocument || element;
          return doc.defaultView || doc.parentWindow || window2;
        }
        var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
        var SUPPORT_TOUCH = "ontouchstart" in window2;
        var SUPPORT_POINTER_EVENTS = prefixed(window2, "PointerEvent") !== undefined2;
        var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
        var INPUT_TYPE_TOUCH = "touch";
        var INPUT_TYPE_PEN = "pen";
        var INPUT_TYPE_MOUSE = "mouse";
        var INPUT_TYPE_KINECT = "kinect";
        var COMPUTE_INTERVAL = 25;
        var INPUT_START = 1;
        var INPUT_MOVE = 2;
        var INPUT_END = 4;
        var INPUT_CANCEL = 8;
        var DIRECTION_NONE = 1;
        var DIRECTION_LEFT = 2;
        var DIRECTION_RIGHT = 4;
        var DIRECTION_UP = 8;
        var DIRECTION_DOWN = 16;
        var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
        var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
        var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
        var PROPS_XY = ["x", "y"];
        var PROPS_CLIENT_XY = ["clientX", "clientY"];
        function Input(manager, callback) {
          var self2 = this;
          this.manager = manager;
          this.callback = callback;
          this.element = manager.element;
          this.target = manager.options.inputTarget;
          this.domHandler = function(ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
              self2.handler(ev);
            }
          };
          this.init();
        }
        Input.prototype = {
          /**
           * should handle the inputEvent data and trigger the callback
           * @virtual
           */
          handler: function() {
          },
          /**
           * bind the events
           */
          init: function() {
            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
          },
          /**
           * unbind the events
           */
          destroy: function() {
            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
          }
        };
        function createInputInstance(manager) {
          var Type;
          var inputClass = manager.options.inputClass;
          if (inputClass) {
            Type = inputClass;
          } else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
          } else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
          } else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
          } else {
            Type = TouchMouseInput;
          }
          return new Type(manager, inputHandler);
        }
        function inputHandler(manager, eventType, input) {
          var pointersLen = input.pointers.length;
          var changedPointersLen = input.changedPointers.length;
          var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
          var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
          input.isFirst = !!isFirst;
          input.isFinal = !!isFinal;
          if (isFirst) {
            manager.session = {};
          }
          input.eventType = eventType;
          computeInputData(manager, input);
          manager.emit("hammer.input", input);
          manager.recognize(input);
          manager.session.prevInput = input;
        }
        function computeInputData(manager, input) {
          var session2 = manager.session;
          var pointers = input.pointers;
          var pointersLength = pointers.length;
          if (!session2.firstInput) {
            session2.firstInput = simpleCloneInputData(input);
          }
          if (pointersLength > 1 && !session2.firstMultiple) {
            session2.firstMultiple = simpleCloneInputData(input);
          } else if (pointersLength === 1) {
            session2.firstMultiple = false;
          }
          var firstInput = session2.firstInput;
          var firstMultiple = session2.firstMultiple;
          var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
          var center = input.center = getCenter(pointers);
          input.timeStamp = now2();
          input.deltaTime = input.timeStamp - firstInput.timeStamp;
          input.angle = getAngle(offsetCenter, center);
          input.distance = getDistance(offsetCenter, center);
          computeDeltaXY(session2, input);
          input.offsetDirection = getDirection(input.deltaX, input.deltaY);
          var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
          input.overallVelocityX = overallVelocity.x;
          input.overallVelocityY = overallVelocity.y;
          input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
          input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
          input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
          input.maxPointers = !session2.prevInput ? input.pointers.length : input.pointers.length > session2.prevInput.maxPointers ? input.pointers.length : session2.prevInput.maxPointers;
          computeIntervalInputData(session2, input);
          var target = manager.element;
          if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
          }
          input.target = target;
        }
        function computeDeltaXY(session2, input) {
          var center = input.center;
          var offset = session2.offsetDelta || {};
          var prevDelta = session2.prevDelta || {};
          var prevInput = session2.prevInput || {};
          if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session2.prevDelta = {
              x: prevInput.deltaX || 0,
              y: prevInput.deltaY || 0
            };
            offset = session2.offsetDelta = {
              x: center.x,
              y: center.y
            };
          }
          input.deltaX = prevDelta.x + (center.x - offset.x);
          input.deltaY = prevDelta.y + (center.y - offset.y);
        }
        function computeIntervalInputData(session2, input) {
          var last = session2.lastInterval || input, deltaTime = input.timeStamp - last.timeStamp, velocity, velocityX, velocityY, direction;
          if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined2)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;
            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);
            session2.lastInterval = input;
          } else {
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
          }
          input.velocity = velocity;
          input.velocityX = velocityX;
          input.velocityY = velocityY;
          input.direction = direction;
        }
        function simpleCloneInputData(input) {
          var pointers = [];
          var i = 0;
          while (i < input.pointers.length) {
            pointers[i] = {
              clientX: round(input.pointers[i].clientX),
              clientY: round(input.pointers[i].clientY)
            };
            i++;
          }
          return {
            timeStamp: now2(),
            pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
          };
        }
        function getCenter(pointers) {
          var pointersLength = pointers.length;
          if (pointersLength === 1) {
            return {
              x: round(pointers[0].clientX),
              y: round(pointers[0].clientY)
            };
          }
          var x = 0, y = 0, i = 0;
          while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
          }
          return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
          };
        }
        function getVelocity(deltaTime, x, y) {
          return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
          };
        }
        function getDirection(x, y) {
          if (x === y) {
            return DIRECTION_NONE;
          }
          if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
          }
          return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
        }
        function getDistance(p1, p2, props) {
          if (!props) {
            props = PROPS_XY;
          }
          var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
          return Math.sqrt(x * x + y * y);
        }
        function getAngle(p1, p2, props) {
          if (!props) {
            props = PROPS_XY;
          }
          var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
          return Math.atan2(y, x) * 180 / Math.PI;
        }
        function getRotation(start3, end) {
          return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start3[1], start3[0], PROPS_CLIENT_XY);
        }
        function getScale(start3, end) {
          return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start3[0], start3[1], PROPS_CLIENT_XY);
        }
        var MOUSE_INPUT_MAP = {
          mousedown: INPUT_START,
          mousemove: INPUT_MOVE,
          mouseup: INPUT_END
        };
        var MOUSE_ELEMENT_EVENTS = "mousedown";
        var MOUSE_WINDOW_EVENTS = "mousemove mouseup";
        function MouseInput() {
          this.evEl = MOUSE_ELEMENT_EVENTS;
          this.evWin = MOUSE_WINDOW_EVENTS;
          this.pressed = false;
          Input.apply(this, arguments);
        }
        inherit(MouseInput, Input, {
          /**
           * handle mouse events
           * @param {Object} ev
           */
          handler: function MEhandler(ev) {
            var eventType = MOUSE_INPUT_MAP[ev.type];
            if (eventType & INPUT_START && ev.button === 0) {
              this.pressed = true;
            }
            if (eventType & INPUT_MOVE && ev.which !== 1) {
              eventType = INPUT_END;
            }
            if (!this.pressed) {
              return;
            }
            if (eventType & INPUT_END) {
              this.pressed = false;
            }
            this.callback(this.manager, eventType, {
              pointers: [ev],
              changedPointers: [ev],
              pointerType: INPUT_TYPE_MOUSE,
              srcEvent: ev
            });
          }
        });
        var POINTER_INPUT_MAP = {
          pointerdown: INPUT_START,
          pointermove: INPUT_MOVE,
          pointerup: INPUT_END,
          pointercancel: INPUT_CANCEL,
          pointerout: INPUT_CANCEL
        };
        var IE10_POINTER_TYPE_ENUM = {
          2: INPUT_TYPE_TOUCH,
          3: INPUT_TYPE_PEN,
          4: INPUT_TYPE_MOUSE,
          5: INPUT_TYPE_KINECT
          // see https://twitter.com/jacobrossi/status/480596438489890816
        };
        var POINTER_ELEMENT_EVENTS = "pointerdown";
        var POINTER_WINDOW_EVENTS = "pointermove pointerup pointercancel";
        if (window2.MSPointerEvent && !window2.PointerEvent) {
          POINTER_ELEMENT_EVENTS = "MSPointerDown";
          POINTER_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel";
        }
        function PointerEventInput() {
          this.evEl = POINTER_ELEMENT_EVENTS;
          this.evWin = POINTER_WINDOW_EVENTS;
          Input.apply(this, arguments);
          this.store = this.manager.session.pointerEvents = [];
        }
        inherit(PointerEventInput, Input, {
          /**
           * handle mouse events
           * @param {Object} ev
           */
          handler: function PEhandler(ev) {
            var store = this.store;
            var removePointer = false;
            var eventTypeNormalized = ev.type.toLowerCase().replace("ms", "");
            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
            var isTouch = pointerType == INPUT_TYPE_TOUCH;
            var storeIndex = inArray(store, ev.pointerId, "pointerId");
            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
              if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
              }
            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
              removePointer = true;
            }
            if (storeIndex < 0) {
              return;
            }
            store[storeIndex] = ev;
            this.callback(this.manager, eventType, {
              pointers: store,
              changedPointers: [ev],
              pointerType,
              srcEvent: ev
            });
            if (removePointer) {
              store.splice(storeIndex, 1);
            }
          }
        });
        var SINGLE_TOUCH_INPUT_MAP = {
          touchstart: INPUT_START,
          touchmove: INPUT_MOVE,
          touchend: INPUT_END,
          touchcancel: INPUT_CANCEL
        };
        var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
        var SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
        function SingleTouchInput() {
          this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
          this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
          this.started = false;
          Input.apply(this, arguments);
        }
        inherit(SingleTouchInput, Input, {
          handler: function TEhandler(ev) {
            var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
            if (type === INPUT_START) {
              this.started = true;
            }
            if (!this.started) {
              return;
            }
            var touches = normalizeSingleTouches.call(this, ev, type);
            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
              this.started = false;
            }
            this.callback(this.manager, type, {
              pointers: touches[0],
              changedPointers: touches[1],
              pointerType: INPUT_TYPE_TOUCH,
              srcEvent: ev
            });
          }
        });
        function normalizeSingleTouches(ev, type) {
          var all = toArray(ev.touches);
          var changed = toArray(ev.changedTouches);
          if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), "identifier", true);
          }
          return [all, changed];
        }
        var TOUCH_INPUT_MAP = {
          touchstart: INPUT_START,
          touchmove: INPUT_MOVE,
          touchend: INPUT_END,
          touchcancel: INPUT_CANCEL
        };
        var TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
        function TouchInput() {
          this.evTarget = TOUCH_TARGET_EVENTS;
          this.targetIds = {};
          Input.apply(this, arguments);
        }
        inherit(TouchInput, Input, {
          handler: function MTEhandler(ev) {
            var type = TOUCH_INPUT_MAP[ev.type];
            var touches = getTouches.call(this, ev, type);
            if (!touches) {
              return;
            }
            this.callback(this.manager, type, {
              pointers: touches[0],
              changedPointers: touches[1],
              pointerType: INPUT_TYPE_TOUCH,
              srcEvent: ev
            });
          }
        });
        function getTouches(ev, type) {
          var allTouches = toArray(ev.touches);
          var targetIds = this.targetIds;
          if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
          }
          var i, targetTouches, changedTouches = toArray(ev.changedTouches), changedTargetTouches = [], target = this.target;
          targetTouches = allTouches.filter(function(touch) {
            return hasParent(touch.target, target);
          });
          if (type === INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
              targetIds[targetTouches[i].identifier] = true;
              i++;
            }
          }
          i = 0;
          while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
              changedTargetTouches.push(changedTouches[i]);
            }
            if (type & (INPUT_END | INPUT_CANCEL)) {
              delete targetIds[changedTouches[i].identifier];
            }
            i++;
          }
          if (!changedTargetTouches.length) {
            return;
          }
          return [
            // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
            uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", true),
            changedTargetTouches
          ];
        }
        var DEDUP_TIMEOUT = 2500;
        var DEDUP_DISTANCE = 25;
        function TouchMouseInput() {
          Input.apply(this, arguments);
          var handler = bindFn(this.handler, this);
          this.touch = new TouchInput(this.manager, handler);
          this.mouse = new MouseInput(this.manager, handler);
          this.primaryTouch = null;
          this.lastTouches = [];
        }
        inherit(TouchMouseInput, Input, {
          /**
           * handle mouse and touch events
           * @param {Hammer} manager
           * @param {String} inputEvent
           * @param {Object} inputData
           */
          handler: function TMEhandler(manager, inputEvent, inputData) {
            var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH, isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;
            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
              return;
            }
            if (isTouch) {
              recordTouches.call(this, inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
              return;
            }
            this.callback(manager, inputEvent, inputData);
          },
          /**
           * remove the event listeners
           */
          destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
          }
        });
        function recordTouches(eventType, eventData) {
          if (eventType & INPUT_START) {
            this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData);
          } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            setLastTouch.call(this, eventData);
          }
        }
        function setLastTouch(eventData) {
          var touch = eventData.changedPointers[0];
          if (touch.identifier === this.primaryTouch) {
            var lastTouch = { x: touch.clientX, y: touch.clientY };
            this.lastTouches.push(lastTouch);
            var lts = this.lastTouches;
            var removeLastTouch = function() {
              var i = lts.indexOf(lastTouch);
              if (i > -1) {
                lts.splice(i, 1);
              }
            };
            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
          }
        }
        function isSyntheticEvent(eventData) {
          var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
          for (var i = 0; i < this.lastTouches.length; i++) {
            var t = this.lastTouches[i];
            var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
              return true;
            }
          }
          return false;
        }
        var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction");
        var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined2;
        var TOUCH_ACTION_COMPUTE = "compute";
        var TOUCH_ACTION_AUTO = "auto";
        var TOUCH_ACTION_MANIPULATION = "manipulation";
        var TOUCH_ACTION_NONE = "none";
        var TOUCH_ACTION_PAN_X = "pan-x";
        var TOUCH_ACTION_PAN_Y = "pan-y";
        var TOUCH_ACTION_MAP = getTouchActionProps();
        function TouchAction(manager, value) {
          this.manager = manager;
          this.set(value);
        }
        TouchAction.prototype = {
          /**
           * set the touchAction value on the element or enable the polyfill
           * @param {String} value
           */
          set: function(value) {
            if (value == TOUCH_ACTION_COMPUTE) {
              value = this.compute();
            }
            if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
              this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
          },
          /**
           * just re-set the touchAction value
           */
          update: function() {
            this.set(this.manager.options.touchAction);
          },
          /**
           * compute the value for the touchAction property based on the recognizer's settings
           * @returns {String} value
           */
          compute: function() {
            var actions = [];
            each(this.manager.recognizers, function(recognizer) {
              if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
              }
            });
            return cleanTouchActions(actions.join(" "));
          },
          /**
           * this method is called on each input cycle and provides the preventing of the browser behavior
           * @param {Object} input
           */
          preventDefaults: function(input) {
            var srcEvent = input.srcEvent;
            var direction = input.offsetDirection;
            if (this.manager.session.prevented) {
              srcEvent.preventDefault();
              return;
            }
            var actions = this.actions;
            var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
            if (hasNone) {
              var isTapPointer = input.pointers.length === 1;
              var isTapMovement = input.distance < 2;
              var isTapTouchTime = input.deltaTime < 250;
              if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
              }
            }
            if (hasPanX && hasPanY) {
              return;
            }
            if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
              return this.preventSrc(srcEvent);
            }
          },
          /**
           * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
           * @param {Object} srcEvent
           */
          preventSrc: function(srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
          }
        };
        function cleanTouchActions(actions) {
          if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
          }
          var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
          var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
          if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
          }
          if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
          }
          if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
          }
          return TOUCH_ACTION_AUTO;
        }
        function getTouchActionProps() {
          if (!NATIVE_TOUCH_ACTION) {
            return false;
          }
          var touchMap = {};
          var cssSupports = window2.CSS && window2.CSS.supports;
          ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(val) {
            touchMap[val] = cssSupports ? window2.CSS.supports("touch-action", val) : true;
          });
          return touchMap;
        }
        var STATE_POSSIBLE = 1;
        var STATE_BEGAN = 2;
        var STATE_CHANGED = 4;
        var STATE_ENDED = 8;
        var STATE_RECOGNIZED = STATE_ENDED;
        var STATE_CANCELLED = 16;
        var STATE_FAILED = 32;
        function Recognizer(options) {
          this.options = assign({}, this.defaults, options || {});
          this.id = uniqueId();
          this.manager = null;
          this.options.enable = ifUndefined(this.options.enable, true);
          this.state = STATE_POSSIBLE;
          this.simultaneous = {};
          this.requireFail = [];
        }
        Recognizer.prototype = {
          /**
           * @virtual
           * @type {Object}
           */
          defaults: {},
          /**
           * set options
           * @param {Object} options
           * @return {Recognizer}
           */
          set: function(options) {
            assign(this.options, options);
            this.manager && this.manager.touchAction.update();
            return this;
          },
          /**
           * recognize simultaneous with an other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          recognizeWith: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) {
              return this;
            }
            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (!simultaneous[otherRecognizer.id]) {
              simultaneous[otherRecognizer.id] = otherRecognizer;
              otherRecognizer.recognizeWith(this);
            }
            return this;
          },
          /**
           * drop the simultaneous link. it doesnt remove the link on the other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          dropRecognizeWith: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, "dropRecognizeWith", this)) {
              return this;
            }
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            delete this.simultaneous[otherRecognizer.id];
            return this;
          },
          /**
           * recognizer can only run when an other is failing
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          requireFailure: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, "requireFailure", this)) {
              return this;
            }
            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (inArray(requireFail, otherRecognizer) === -1) {
              requireFail.push(otherRecognizer);
              otherRecognizer.requireFailure(this);
            }
            return this;
          },
          /**
           * drop the requireFailure link. it does not remove the link on the other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          dropRequireFailure: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) {
              return this;
            }
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            var index = inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
              this.requireFail.splice(index, 1);
            }
            return this;
          },
          /**
           * has require failures boolean
           * @returns {boolean}
           */
          hasRequireFailures: function() {
            return this.requireFail.length > 0;
          },
          /**
           * if the recognizer can recognize simultaneous with an other recognizer
           * @param {Recognizer} otherRecognizer
           * @returns {Boolean}
           */
          canRecognizeWith: function(otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
          },
          /**
           * You should use `tryEmit` instead of `emit` directly to check
           * that all the needed recognizers has failed before emitting.
           * @param {Object} input
           */
          emit: function(input) {
            var self2 = this;
            var state = this.state;
            function emit(event) {
              self2.manager.emit(event, input);
            }
            if (state < STATE_ENDED) {
              emit(self2.options.event + stateStr(state));
            }
            emit(self2.options.event);
            if (input.additionalEvent) {
              emit(input.additionalEvent);
            }
            if (state >= STATE_ENDED) {
              emit(self2.options.event + stateStr(state));
            }
          },
          /**
           * Check that all the require failure recognizers has failed,
           * if true, it emits a gesture event,
           * otherwise, setup the state to FAILED.
           * @param {Object} input
           */
          tryEmit: function(input) {
            if (this.canEmit()) {
              return this.emit(input);
            }
            this.state = STATE_FAILED;
          },
          /**
           * can we emit?
           * @returns {boolean}
           */
          canEmit: function() {
            var i = 0;
            while (i < this.requireFail.length) {
              if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
              }
              i++;
            }
            return true;
          },
          /**
           * update the recognizer
           * @param {Object} inputData
           */
          recognize: function(inputData) {
            var inputDataClone = assign({}, inputData);
            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
              this.reset();
              this.state = STATE_FAILED;
              return;
            }
            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
              this.state = STATE_POSSIBLE;
            }
            this.state = this.process(inputDataClone);
            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
              this.tryEmit(inputDataClone);
            }
          },
          /**
           * return the state of the recognizer
           * the actual recognizing happens in this method
           * @virtual
           * @param {Object} inputData
           * @returns {Const} STATE
           */
          process: function(inputData) {
          },
          // jshint ignore:line
          /**
           * return the preferred touch-action
           * @virtual
           * @returns {Array}
           */
          getTouchAction: function() {
          },
          /**
           * called when the gesture isn't allowed to recognize
           * like when another is being recognized or it is disabled
           * @virtual
           */
          reset: function() {
          }
        };
        function stateStr(state) {
          if (state & STATE_CANCELLED) {
            return "cancel";
          } else if (state & STATE_ENDED) {
            return "end";
          } else if (state & STATE_CHANGED) {
            return "move";
          } else if (state & STATE_BEGAN) {
            return "start";
          }
          return "";
        }
        function directionStr(direction) {
          if (direction == DIRECTION_DOWN) {
            return "down";
          } else if (direction == DIRECTION_UP) {
            return "up";
          } else if (direction == DIRECTION_LEFT) {
            return "left";
          } else if (direction == DIRECTION_RIGHT) {
            return "right";
          }
          return "";
        }
        function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
          var manager = recognizer.manager;
          if (manager) {
            return manager.get(otherRecognizer);
          }
          return otherRecognizer;
        }
        function AttrRecognizer() {
          Recognizer.apply(this, arguments);
        }
        inherit(AttrRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof AttrRecognizer
           */
          defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
          },
          /**
           * Used to check if it the recognizer receives valid input, like input.distance > 10.
           * @memberof AttrRecognizer
           * @param {Object} input
           * @returns {Boolean} recognized
           */
          attrTest: function(input) {
            var optionPointers = this.options.pointers;
            return optionPointers === 0 || input.pointers.length === optionPointers;
          },
          /**
           * Process the input and return the state for the recognizer
           * @memberof AttrRecognizer
           * @param {Object} input
           * @returns {*} State
           */
          process: function(input) {
            var state = this.state;
            var eventType = input.eventType;
            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            var isValid = this.attrTest(input);
            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
              return state | STATE_CANCELLED;
            } else if (isRecognized || isValid) {
              if (eventType & INPUT_END) {
                return state | STATE_ENDED;
              } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
              }
              return state | STATE_CHANGED;
            }
            return STATE_FAILED;
          }
        });
        function PanRecognizer() {
          AttrRecognizer.apply(this, arguments);
          this.pX = null;
          this.pY = null;
        }
        inherit(PanRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof PanRecognizer
           */
          defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
          },
          getTouchAction: function() {
            var direction = this.options.direction;
            var actions = [];
            if (direction & DIRECTION_HORIZONTAL) {
              actions.push(TOUCH_ACTION_PAN_Y);
            }
            if (direction & DIRECTION_VERTICAL) {
              actions.push(TOUCH_ACTION_PAN_X);
            }
            return actions;
          },
          directionTest: function(input) {
            var options = this.options;
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.deltaX;
            var y = input.deltaY;
            if (!(direction & options.direction)) {
              if (options.direction & DIRECTION_HORIZONTAL) {
                direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
              } else {
                direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
              }
            }
            input.direction = direction;
            return hasMoved && distance > options.threshold && direction & options.direction;
          },
          attrTest: function(input) {
            return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
          },
          emit: function(input) {
            this.pX = input.deltaX;
            this.pY = input.deltaY;
            var direction = directionStr(input.direction);
            if (direction) {
              input.additionalEvent = this.options.event + direction;
            }
            this._super.emit.call(this, input);
          }
        });
        function PinchRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }
        inherit(PinchRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof PinchRecognizer
           */
          defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
          },
          getTouchAction: function() {
            return [TOUCH_ACTION_NONE];
          },
          attrTest: function(input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
          },
          emit: function(input) {
            if (input.scale !== 1) {
              var inOut = input.scale < 1 ? "in" : "out";
              input.additionalEvent = this.options.event + inOut;
            }
            this._super.emit.call(this, input);
          }
        });
        function PressRecognizer() {
          Recognizer.apply(this, arguments);
          this._timer = null;
          this._input = null;
        }
        inherit(PressRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof PressRecognizer
           */
          defaults: {
            event: "press",
            pointers: 1,
            time: 251,
            // minimal time of the pointer to be pressed
            threshold: 9
            // a minimal movement is ok, but keep it low
          },
          getTouchAction: function() {
            return [TOUCH_ACTION_AUTO];
          },
          process: function(input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTime = input.deltaTime > options.time;
            this._input = input;
            if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
              this.reset();
            } else if (input.eventType & INPUT_START) {
              this.reset();
              this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
              }, options.time, this);
            } else if (input.eventType & INPUT_END) {
              return STATE_RECOGNIZED;
            }
            return STATE_FAILED;
          },
          reset: function() {
            clearTimeout(this._timer);
          },
          emit: function(input) {
            if (this.state !== STATE_RECOGNIZED) {
              return;
            }
            if (input && input.eventType & INPUT_END) {
              this.manager.emit(this.options.event + "up", input);
            } else {
              this._input.timeStamp = now2();
              this.manager.emit(this.options.event, this._input);
            }
          }
        });
        function RotateRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }
        inherit(RotateRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof RotateRecognizer
           */
          defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
          },
          getTouchAction: function() {
            return [TOUCH_ACTION_NONE];
          },
          attrTest: function(input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
          }
        });
        function SwipeRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }
        inherit(SwipeRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof SwipeRecognizer
           */
          defaults: {
            event: "swipe",
            threshold: 10,
            velocity: 0.3,
            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
            pointers: 1
          },
          getTouchAction: function() {
            return PanRecognizer.prototype.getTouchAction.call(this);
          },
          attrTest: function(input) {
            var direction = this.options.direction;
            var velocity;
            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
              velocity = input.overallVelocity;
            } else if (direction & DIRECTION_HORIZONTAL) {
              velocity = input.overallVelocityX;
            } else if (direction & DIRECTION_VERTICAL) {
              velocity = input.overallVelocityY;
            }
            return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
          },
          emit: function(input) {
            var direction = directionStr(input.offsetDirection);
            if (direction) {
              this.manager.emit(this.options.event + direction, input);
            }
            this.manager.emit(this.options.event, input);
          }
        });
        function TapRecognizer() {
          Recognizer.apply(this, arguments);
          this.pTime = false;
          this.pCenter = false;
          this._timer = null;
          this._input = null;
          this.count = 0;
        }
        inherit(TapRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof PinchRecognizer
           */
          defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            // max time between the multi-tap taps
            time: 250,
            // max time of the pointer to be down (like finger on the screen)
            threshold: 9,
            // a minimal movement is ok, but keep it low
            posThreshold: 10
            // a multi-tap can be a bit off the initial position
          },
          getTouchAction: function() {
            return [TOUCH_ACTION_MANIPULATION];
          },
          process: function(input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTouchTime = input.deltaTime < options.time;
            this.reset();
            if (input.eventType & INPUT_START && this.count === 0) {
              return this.failTimeout();
            }
            if (validMovement && validTouchTime && validPointers) {
              if (input.eventType != INPUT_END) {
                return this.failTimeout();
              }
              var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
              var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
              this.pTime = input.timeStamp;
              this.pCenter = input.center;
              if (!validMultiTap || !validInterval) {
                this.count = 1;
              } else {
                this.count += 1;
              }
              this._input = input;
              var tapCount = this.count % options.taps;
              if (tapCount === 0) {
                if (!this.hasRequireFailures()) {
                  return STATE_RECOGNIZED;
                } else {
                  this._timer = setTimeoutContext(function() {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                  }, options.interval, this);
                  return STATE_BEGAN;
                }
              }
            }
            return STATE_FAILED;
          },
          failTimeout: function() {
            this._timer = setTimeoutContext(function() {
              this.state = STATE_FAILED;
            }, this.options.interval, this);
            return STATE_FAILED;
          },
          reset: function() {
            clearTimeout(this._timer);
          },
          emit: function() {
            if (this.state == STATE_RECOGNIZED) {
              this._input.tapCount = this.count;
              this.manager.emit(this.options.event, this._input);
            }
          }
        });
        function Hammer(element, options) {
          options = options || {};
          options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
          return new Manager(element, options);
        }
        Hammer.VERSION = "2.0.7";
        Hammer.defaults = {
          /**
           * set if DOM events are being triggered.
           * But this is slower and unused by simple implementations, so disabled by default.
           * @type {Boolean}
           * @default false
           */
          domEvents: false,
          /**
           * The value for the touchAction property/fallback.
           * When set to `compute` it will magically set the correct value based on the added recognizers.
           * @type {String}
           * @default compute
           */
          touchAction: TOUCH_ACTION_COMPUTE,
          /**
           * @type {Boolean}
           * @default true
           */
          enable: true,
          /**
           * EXPERIMENTAL FEATURE -- can be removed/changed
           * Change the parent input target element.
           * If Null, then it is being set the to main element.
           * @type {Null|EventTarget}
           * @default null
           */
          inputTarget: null,
          /**
           * force an input class
           * @type {Null|Function}
           * @default null
           */
          inputClass: null,
          /**
           * Default recognizer setup when calling `Hammer()`
           * When creating a new Manager these will be skipped.
           * @type {Array}
           */
          preset: [
            // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
            [RotateRecognizer, { enable: false }],
            [PinchRecognizer, { enable: false }, ["rotate"]],
            [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }],
            [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ["swipe"]],
            [TapRecognizer],
            [TapRecognizer, { event: "doubletap", taps: 2 }, ["tap"]],
            [PressRecognizer]
          ],
          /**
           * Some CSS properties can be used to improve the working of Hammer.
           * Add them to this method and they will be set when creating a new Manager.
           * @namespace
           */
          cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: "none",
            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: "none",
            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: "none",
            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: "none",
            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: "none",
            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: "rgba(0,0,0,0)"
          }
        };
        var STOP = 1;
        var FORCED_STOP = 2;
        function Manager(element, options) {
          this.options = assign({}, Hammer.defaults, options || {});
          this.options.inputTarget = this.options.inputTarget || element;
          this.handlers = {};
          this.session = {};
          this.recognizers = [];
          this.oldCssProps = {};
          this.element = element;
          this.input = createInputInstance(this);
          this.touchAction = new TouchAction(this, this.options.touchAction);
          toggleCssProps(this, true);
          each(this.options.recognizers, function(item) {
            var recognizer = this.add(new item[0](item[1]));
            item[2] && recognizer.recognizeWith(item[2]);
            item[3] && recognizer.requireFailure(item[3]);
          }, this);
        }
        Manager.prototype = {
          /**
           * set options
           * @param {Object} options
           * @returns {Manager}
           */
          set: function(options) {
            assign(this.options, options);
            if (options.touchAction) {
              this.touchAction.update();
            }
            if (options.inputTarget) {
              this.input.destroy();
              this.input.target = options.inputTarget;
              this.input.init();
            }
            return this;
          },
          /**
           * stop recognizing for this session.
           * This session will be discarded, when a new [input]start event is fired.
           * When forced, the recognizer cycle is stopped immediately.
           * @param {Boolean} [force]
           */
          stop: function(force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
          },
          /**
           * run the recognizers!
           * called by the inputHandler function on every movement of the pointers (touches)
           * it walks through all the recognizers and tries to detect the gesture that is being made
           * @param {Object} inputData
           */
          recognize: function(inputData) {
            var session2 = this.session;
            if (session2.stopped) {
              return;
            }
            this.touchAction.preventDefaults(inputData);
            var recognizer;
            var recognizers = this.recognizers;
            var curRecognizer = session2.curRecognizer;
            if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
              curRecognizer = session2.curRecognizer = null;
            }
            var i = 0;
            while (i < recognizers.length) {
              recognizer = recognizers[i];
              if (session2.stopped !== FORCED_STOP && // 1
              (!curRecognizer || recognizer == curRecognizer || // 2
              recognizer.canRecognizeWith(curRecognizer))) {
                recognizer.recognize(inputData);
              } else {
                recognizer.reset();
              }
              if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session2.curRecognizer = recognizer;
              }
              i++;
            }
          },
          /**
           * get a recognizer by its event name.
           * @param {Recognizer|String} recognizer
           * @returns {Recognizer|Null}
           */
          get: function(recognizer) {
            if (recognizer instanceof Recognizer) {
              return recognizer;
            }
            var recognizers = this.recognizers;
            for (var i = 0; i < recognizers.length; i++) {
              if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
              }
            }
            return null;
          },
          /**
           * add a recognizer to the manager
           * existing recognizers with the same event name will be removed
           * @param {Recognizer} recognizer
           * @returns {Recognizer|Manager}
           */
          add: function(recognizer) {
            if (invokeArrayArg(recognizer, "add", this)) {
              return this;
            }
            var existing = this.get(recognizer.options.event);
            if (existing) {
              this.remove(existing);
            }
            this.recognizers.push(recognizer);
            recognizer.manager = this;
            this.touchAction.update();
            return recognizer;
          },
          /**
           * remove a recognizer by name or instance
           * @param {Recognizer|String} recognizer
           * @returns {Manager}
           */
          remove: function(recognizer) {
            if (invokeArrayArg(recognizer, "remove", this)) {
              return this;
            }
            recognizer = this.get(recognizer);
            if (recognizer) {
              var recognizers = this.recognizers;
              var index = inArray(recognizers, recognizer);
              if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
              }
            }
            return this;
          },
          /**
           * bind event
           * @param {String} events
           * @param {Function} handler
           * @returns {EventEmitter} this
           */
          on: function(events, handler) {
            if (events === undefined2) {
              return;
            }
            if (handler === undefined2) {
              return;
            }
            var handlers = this.handlers;
            each(splitStr(events), function(event) {
              handlers[event] = handlers[event] || [];
              handlers[event].push(handler);
            });
            return this;
          },
          /**
           * unbind event, leave emit blank to remove all handlers
           * @param {String} events
           * @param {Function} [handler]
           * @returns {EventEmitter} this
           */
          off: function(events, handler) {
            if (events === undefined2) {
              return;
            }
            var handlers = this.handlers;
            each(splitStr(events), function(event) {
              if (!handler) {
                delete handlers[event];
              } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
              }
            });
            return this;
          },
          /**
           * emit event to the listeners
           * @param {String} event
           * @param {Object} data
           */
          emit: function(event, data) {
            if (this.options.domEvents) {
              triggerDomEvent(event, data);
            }
            var handlers = this.handlers[event] && this.handlers[event].slice();
            if (!handlers || !handlers.length) {
              return;
            }
            data.type = event;
            data.preventDefault = function() {
              data.srcEvent.preventDefault();
            };
            var i = 0;
            while (i < handlers.length) {
              handlers[i](data);
              i++;
            }
          },
          /**
           * destroy the manager and unbinds all events
           * it doesn't unbind dom events, that is the user own responsibility
           */
          destroy: function() {
            this.element && toggleCssProps(this, false);
            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
          }
        };
        function toggleCssProps(manager, add) {
          var element = manager.element;
          if (!element.style) {
            return;
          }
          var prop;
          each(manager.options.cssProps, function(value, name) {
            prop = prefixed(element.style, name);
            if (add) {
              manager.oldCssProps[prop] = element.style[prop];
              element.style[prop] = value;
            } else {
              element.style[prop] = manager.oldCssProps[prop] || "";
            }
          });
          if (!add) {
            manager.oldCssProps = {};
          }
        }
        function triggerDomEvent(event, data) {
          var gestureEvent = document2.createEvent("Event");
          gestureEvent.initEvent(event, true, true);
          gestureEvent.gesture = data;
          data.target.dispatchEvent(gestureEvent);
        }
        assign(Hammer, {
          INPUT_START,
          INPUT_MOVE,
          INPUT_END,
          INPUT_CANCEL,
          STATE_POSSIBLE,
          STATE_BEGAN,
          STATE_CHANGED,
          STATE_ENDED,
          STATE_RECOGNIZED,
          STATE_CANCELLED,
          STATE_FAILED,
          DIRECTION_NONE,
          DIRECTION_LEFT,
          DIRECTION_RIGHT,
          DIRECTION_UP,
          DIRECTION_DOWN,
          DIRECTION_HORIZONTAL,
          DIRECTION_VERTICAL,
          DIRECTION_ALL,
          Manager,
          Input,
          TouchAction,
          TouchInput,
          MouseInput,
          PointerEventInput,
          TouchMouseInput,
          SingleTouchInput,
          Recognizer,
          AttrRecognizer,
          Tap: TapRecognizer,
          Pan: PanRecognizer,
          Swipe: SwipeRecognizer,
          Pinch: PinchRecognizer,
          Rotate: RotateRecognizer,
          Press: PressRecognizer,
          on: addEventListeners,
          off: removeEventListeners,
          each,
          merge,
          extend: extend2,
          assign,
          inherit,
          bindFn,
          prefixed
        });
        var freeGlobal = typeof window2 !== "undefined" ? window2 : typeof self !== "undefined" ? self : {};
        freeGlobal.Hammer = Hammer;
        if (typeof define === "function" && define.amd) {
          define(function() {
            return Hammer;
          });
        } else if (typeof module != "undefined" && module.exports) {
          module.exports = Hammer;
        } else {
          window2[exportName] = Hammer;
        }
      })(window, document, "Hammer");
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  var turbo_es2017_esm_exports = {};
  __export(turbo_es2017_esm_exports, {
    FetchEnctype: () => FetchEnctype,
    FetchMethod: () => FetchMethod,
    FetchRequest: () => FetchRequest,
    FetchResponse: () => FetchResponse,
    FrameElement: () => FrameElement,
    FrameLoadingStyle: () => FrameLoadingStyle,
    FrameRenderer: () => FrameRenderer,
    PageRenderer: () => PageRenderer,
    PageSnapshot: () => PageSnapshot,
    StreamActions: () => StreamActions,
    StreamElement: () => StreamElement,
    StreamSourceElement: () => StreamSourceElement,
    cache: () => cache,
    clearCache: () => clearCache,
    config: () => config,
    connectStreamSource: () => connectStreamSource,
    disconnectStreamSource: () => disconnectStreamSource,
    fetch: () => fetchWithTurboHeaders,
    fetchEnctypeFromString: () => fetchEnctypeFromString,
    fetchMethodFromString: () => fetchMethodFromString,
    isSafe: () => isSafe,
    navigator: () => navigator$1,
    registerAdapter: () => registerAdapter,
    renderStreamMessage: () => renderStreamMessage,
    session: () => session,
    setConfirmMethod: () => setConfirmMethod,
    setFormMode: () => setFormMode,
    setProgressBarDelay: () => setProgressBarDelay,
    start: () => start,
    visit: () => visit
  });
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function") return;
    prototype.requestSubmit = function(submitter2) {
      if (submitter2) {
        validateSubmitter(submitter2, this);
        submitter2.click();
      } else {
        submitter2 = document.createElement("input");
        submitter2.type = "submit";
        submitter2.hidden = true;
        this.appendChild(submitter2);
        submitter2.click();
        this.removeChild(submitter2);
      }
    };
    function validateSubmitter(submitter2, form) {
      submitter2 instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter2.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter2.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return candidate?.type == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter2 = findSubmitterFromClickTarget(event.target);
    if (submitter2 && submitter2.form) {
      submittersByForm.set(submitter2.form, submitter2);
    }
  }
  (function() {
    if ("submitter" in Event.prototype) return;
    let prototype = window.Event.prototype;
    if ("SubmitEvent" in window) {
      const prototypeOfSubmitEvent = window.SubmitEvent.prototype;
      if (/Apple Computer/.test(navigator.vendor) && !("submitter" in prototypeOfSubmitEvent)) {
        prototype = prototypeOfSubmitEvent;
      } else {
        return;
      }
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle = {
    eager: "eager",
    lazy: "lazy"
  };
  var FrameElement = class _FrameElement extends HTMLElement {
    static delegateConstructor = void 0;
    loaded = Promise.resolve();
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    constructor() {
      super();
      this.delegate = new _FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else if (name == "disabled") {
        this.delegate.disabledChanged();
      }
    }
    /**
     * Gets the URL to lazily load source HTML from
     */
    get src() {
      return this.getAttribute("src");
    }
    /**
     * Sets the URL to lazily load source HTML from
     */
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    /**
     * Gets the refresh mode for the frame.
     */
    get refresh() {
      return this.getAttribute("refresh");
    }
    /**
     * Sets the refresh mode for the frame.
     */
    set refresh(value) {
      if (value) {
        this.setAttribute("refresh", value);
      } else {
        this.removeAttribute("refresh");
      }
    }
    get shouldReloadWithMorph() {
      return this.src && this.refresh === "morph";
    }
    /**
     * Determines if the element is loading
     */
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    /**
     * Sets the value of if the element is loading
     */
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    /**
     * Gets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    get disabled() {
      return this.hasAttribute("disabled");
    }
    /**
     * Sets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    /**
     * Gets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    /**
     * Sets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    /**
     * Determines if the element has finished loading
     */
    get complete() {
      return !this.delegate.isLoading;
    }
    /**
     * Gets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    /**
     * Sets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isPreview() {
      return this.ownerDocument?.documentElement?.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  var drive = {
    enabled: true,
    progressBarDelay: 500,
    unvisitableExtensions: /* @__PURE__ */ new Set(
      [
        ".7z",
        ".aac",
        ".apk",
        ".avi",
        ".bmp",
        ".bz2",
        ".css",
        ".csv",
        ".deb",
        ".dmg",
        ".doc",
        ".docx",
        ".exe",
        ".gif",
        ".gz",
        ".heic",
        ".heif",
        ".ico",
        ".iso",
        ".jpeg",
        ".jpg",
        ".js",
        ".json",
        ".m4a",
        ".mkv",
        ".mov",
        ".mp3",
        ".mp4",
        ".mpeg",
        ".mpg",
        ".msi",
        ".ogg",
        ".ogv",
        ".pdf",
        ".pkg",
        ".png",
        ".ppt",
        ".pptx",
        ".rar",
        ".rtf",
        ".svg",
        ".tar",
        ".tif",
        ".tiff",
        ".txt",
        ".wav",
        ".webm",
        ".webp",
        ".wma",
        ".wmv",
        ".xls",
        ".xlsx",
        ".xml",
        ".zip"
      ]
    )
  };
  function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
      return element;
    } else {
      const createdScriptElement = document.createElement("script");
      const cspNonce = getCspNonce();
      if (cspNonce) {
        createdScriptElement.nonce = cspNonce;
      }
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
      destinationElement.setAttribute(name, value);
    }
  }
  function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
      cancelable,
      bubbles: true,
      composed: true,
      detail
    });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function cancelEvent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  function nextRepaint() {
    if (document.visibilityState === "hidden") {
      return nextEventLoopTick();
    } else {
      return nextAnimationFrame();
    }
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.from({ length: 36 }).map((_, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element?.getAttribute(attributeName))) {
      if (typeof value == "string") return value;
    }
    return null;
  }
  function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  function waitForLoad(element, timeoutInMilliseconds = 2e3) {
    return new Promise((resolve) => {
      const onComplete = () => {
        element.removeEventListener("error", onComplete);
        element.removeEventListener("load", onComplete);
        resolve();
      };
      element.addEventListener("load", onComplete, { once: true });
      element.addEventListener("error", onComplete, { once: true });
      setTimeout(resolve, timeoutInMilliseconds);
    });
  }
  function getHistoryMethodForAction(action) {
    switch (action) {
      case "replace":
        return history.replaceState;
      case "advance":
      case "restore":
        return history.pushState;
    }
  }
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
  }
  function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
  }
  function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
  }
  function getCspNonce() {
    const element = getMetaElement("csp-nonce");
    if (element) {
      const { nonce, content } = element;
      return nonce == "" ? content : nonce;
    }
  }
  function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
  }
  function findClosestRecursively(element, selector) {
    if (element instanceof Element) {
      return element.closest(selector) || findClosestRecursively(element.assignedSlot || element.getRootNode()?.host, selector);
    }
  }
  function elementIsFocusable(element) {
    const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
    return !!element && element.closest(inertDisabledOrHidden) == null && typeof element.focus == "function";
  }
  function queryAutofocusableElement(elementOrDocumentFragment) {
    return Array.from(elementOrDocumentFragment.querySelectorAll("[autofocus]")).find(elementIsFocusable);
  }
  async function around(callback, reader) {
    const before = reader();
    callback();
    await nextAnimationFrame();
    const after = reader();
    return [before, after];
  }
  function doesNotTargetIFrame(name) {
    if (name === "_blank") {
      return false;
    } else if (name) {
      for (const element of document.getElementsByName(name)) {
        if (element instanceof HTMLIFrameElement) return false;
      }
      return true;
    } else {
      return true;
    }
  }
  function findLinkFromClickTarget(target) {
    return findClosestRecursively(target, "a[href]:not([target^=_]):not([download])");
  }
  function getLocationForLink(link) {
    return expandURL(link.getAttribute("href") || "");
  }
  function debounce(fn, delay) {
    let timeoutId = null;
    return (...args) => {
      const callback = () => fn.apply(this, args);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }
  var submitter = {
    "aria-disabled": {
      beforeSubmit: (submitter2) => {
        submitter2.setAttribute("aria-disabled", "true");
        submitter2.addEventListener("click", cancelEvent);
      },
      afterSubmit: (submitter2) => {
        submitter2.removeAttribute("aria-disabled");
        submitter2.removeEventListener("click", cancelEvent);
      }
    },
    "disabled": {
      beforeSubmit: (submitter2) => submitter2.disabled = true,
      afterSubmit: (submitter2) => submitter2.disabled = false
    }
  };
  var Config = class {
    #submitter = null;
    constructor(config2) {
      Object.assign(this, config2);
    }
    get submitter() {
      return this.#submitter;
    }
    set submitter(value) {
      this.#submitter = submitter[value] || value;
    }
  };
  var forms = new Config({
    mode: "on",
    submitter: "disabled"
  });
  var config = {
    drive,
    forms
  };
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction$1(form, submitter2) {
    const action = submitter2?.getAttribute("formaction") || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && !config.drive.unvisitableExtensions.has(getExtension(location2));
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  var LimitedSet = class extends Set {
    constructor(maxSize) {
      super();
      this.maxSize = maxSize;
    }
    add(value) {
      if (this.size >= this.maxSize) {
        const iterator = this.values();
        const oldestValue = iterator.next().value;
        this.delete(oldestValue);
      }
      super.add(value);
    }
  };
  var recentRequests = new LimitedSet(20);
  var nativeFetch = window.fetch;
  function fetchWithTurboHeaders(url, options = {}) {
    const modifiedHeaders = new Headers(options.headers || {});
    const requestUID = uuid();
    recentRequests.add(requestUID);
    modifiedHeaders.append("X-Turbo-Request-Id", requestUID);
    return nativeFetch(url, {
      ...options,
      headers: modifiedHeaders
    });
  }
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchMethod = {
    get: "get",
    post: "post",
    put: "put",
    patch: "patch",
    delete: "delete"
  };
  function fetchEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FetchEnctype.multipart:
        return FetchEnctype.multipart;
      case FetchEnctype.plain:
        return FetchEnctype.plain;
      default:
        return FetchEnctype.urlEncoded;
    }
  }
  var FetchEnctype = {
    urlEncoded: "application/x-www-form-urlencoded",
    multipart: "multipart/form-data",
    plain: "text/plain"
  };
  var FetchRequest = class {
    abortController = new AbortController();
    #resolveRequestPromise = (_value) => {
    };
    constructor(delegate, method, location2, requestBody = new URLSearchParams(), target = null, enctype = FetchEnctype.urlEncoded) {
      const [url, body] = buildResourceAndBody(expandURL(location2), method, requestBody, enctype);
      this.delegate = delegate;
      this.url = url;
      this.target = target;
      this.fetchOptions = {
        credentials: "same-origin",
        redirect: "follow",
        method: method.toUpperCase(),
        headers: { ...this.defaultHeaders },
        body,
        signal: this.abortSignal,
        referrer: this.delegate.referrer?.href
      };
      this.enctype = enctype;
    }
    get method() {
      return this.fetchOptions.method;
    }
    set method(value) {
      const fetchBody = this.isSafe ? this.url.searchParams : this.fetchOptions.body || new FormData();
      const fetchMethod = fetchMethodFromString(value) || FetchMethod.get;
      this.url.search = "";
      const [url, body] = buildResourceAndBody(this.url, fetchMethod, fetchBody, this.enctype);
      this.url = url;
      this.fetchOptions.body = body;
      this.fetchOptions.method = fetchMethod.toUpperCase();
    }
    get headers() {
      return this.fetchOptions.headers;
    }
    set headers(value) {
      this.fetchOptions.headers = value;
    }
    get body() {
      if (this.isSafe) {
        return this.url.searchParams;
      } else {
        return this.fetchOptions.body;
      }
    }
    set body(value) {
      this.fetchOptions.body = value;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      const { fetchOptions } = this;
      this.delegate.prepareRequest(this);
      const event = await this.#allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        if (event.detail.fetchRequest) {
          this.response = event.detail.fetchRequest.response;
        } else {
          this.response = fetchWithTurboHeaders(this.url.href, fetchOptions);
        }
        const response = await this.response;
        return await this.receive(response);
      } catch (error) {
        if (error.name !== "AbortError") {
          if (this.#willDelegateErrorHandling(error)) {
            this.delegate.requestErrored(this, error);
          }
          throw error;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", {
        cancelable: true,
        detail: { fetchResponse },
        target: this.target
      });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get defaultHeaders() {
      return {
        Accept: "text/html, application/xhtml+xml"
      };
    }
    get isSafe() {
      return isSafe(this.method);
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
      this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async #allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.#resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.#resolveRequestPromise
        },
        target: this.target
      });
      this.url = event.detail.url;
      if (event.defaultPrevented) await requestInterception;
      return event;
    }
    #willDelegateErrorHandling(error) {
      const event = dispatch("turbo:fetch-request-error", {
        target: this.target,
        cancelable: true,
        detail: { request: this, error }
      });
      return !event.defaultPrevented;
    }
  };
  function isSafe(fetchMethod) {
    return fetchMethodFromString(fetchMethod) == FetchMethod.get;
  }
  function buildResourceAndBody(resource, method, requestBody, enctype) {
    const searchParams = Array.from(requestBody).length > 0 ? new URLSearchParams(entriesExcludingFiles(requestBody)) : resource.searchParams;
    if (isSafe(method)) {
      return [mergeIntoURLSearchParams(resource, searchParams), null];
    } else if (enctype == FetchEnctype.urlEncoded) {
      return [resource, searchParams];
    } else {
      return [resource, requestBody];
    }
  }
  function entriesExcludingFiles(requestBody) {
    const entries = [];
    for (const [name, value] of requestBody) {
      if (value instanceof File) continue;
      else entries.push([name, value]);
    }
    return entries;
  }
  function mergeIntoURLSearchParams(url, requestBody) {
    const searchParams = new URLSearchParams(entriesExcludingFiles(requestBody));
    url.search = searchParams.toString();
    return url;
  }
  var AppearanceObserver = class {
    started = false;
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
    intersect = (entries) => {
      const lastEntry = entries.slice(-1)[0];
      if (lastEntry?.isIntersecting) {
        this.delegate.elementAppearedInViewport(this.element);
      }
    };
  };
  var StreamMessage = class {
    static contentType = "text/vnd.turbo-stream.html";
    static wrap(message) {
      if (typeof message == "string") {
        return new this(createDocumentFragment(message));
      } else {
        return message;
      }
    }
    constructor(fragment) {
      this.fragment = importStreamElements(fragment);
    }
  };
  function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
      const streamElement = document.importNode(element, true);
      for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
        inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
      }
      element.replaceWith(streamElement);
    }
    return fragment;
  }
  var PREFETCH_DELAY = 100;
  var PrefetchCache = class {
    #prefetchTimeout = null;
    #prefetched = null;
    get(url) {
      if (this.#prefetched && this.#prefetched.url === url && this.#prefetched.expire > Date.now()) {
        return this.#prefetched.request;
      }
    }
    setLater(url, request, ttl) {
      this.clear();
      this.#prefetchTimeout = setTimeout(() => {
        request.perform();
        this.set(url, request, ttl);
        this.#prefetchTimeout = null;
      }, PREFETCH_DELAY);
    }
    set(url, request, ttl) {
      this.#prefetched = { url, request, expire: new Date((/* @__PURE__ */ new Date()).getTime() + ttl) };
    }
    clear() {
      if (this.#prefetchTimeout) clearTimeout(this.#prefetchTimeout);
      this.#prefetched = null;
    }
  };
  var cacheTtl = 10 * 1e3;
  var prefetchCache = new PrefetchCache();
  var FormSubmissionState = {
    initialized: "initialized",
    requesting: "requesting",
    waiting: "waiting",
    receiving: "receiving",
    stopping: "stopping",
    stopped: "stopped"
  };
  var FormSubmission = class _FormSubmission {
    state = FormSubmissionState.initialized;
    static confirmMethod(message) {
      return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter2, mustRedirect = false) {
      const method = getMethod(formElement, submitter2);
      const action = getAction(getFormAction(formElement, submitter2), method);
      const body = buildFormData(formElement, submitter2);
      const enctype = getEnctype(formElement, submitter2);
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter2;
      this.fetchRequest = new FetchRequest(this, method, action, body, formElement, enctype);
      this.mustRedirect = mustRedirect;
    }
    get method() {
      return this.fetchRequest.method;
    }
    set method(value) {
      this.fetchRequest.method = value;
    }
    get action() {
      return this.fetchRequest.url.toString();
    }
    set action(value) {
      this.fetchRequest.url = expandURL(value);
    }
    get body() {
      return this.fetchRequest.body;
    }
    get enctype() {
      return this.fetchRequest.enctype;
    }
    get isSafe() {
      return this.fetchRequest.isSafe;
    }
    get location() {
      return this.fetchRequest.url;
    }
    // The submission process
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
      if (typeof confirmationMessage === "string") {
        const confirmMethod = typeof config.forms.confirm === "function" ? config.forms.confirm : _FormSubmission.confirmMethod;
        const answer = await confirmMethod(confirmationMessage, this.formElement, this.submitter);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (!request.isSafe) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          request.headers["X-CSRF-Token"] = token;
        }
      }
      if (this.requestAcceptsTurboStreamResponse(request)) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      this.state = FormSubmissionState.waiting;
      if (this.submitter) config.forms.submitter.beforeSubmit(this.submitter);
      this.setSubmitsWith();
      markAsBusy(this.formElement);
      dispatch("turbo:submit-start", {
        target: this.formElement,
        detail: { formSubmission: this }
      });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      prefetchCache.clear();
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
        return;
      }
      prefetchCache.clear();
      if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error) {
      this.result = { success: false, error };
      this.delegate.formSubmissionErrored(this, error);
    }
    requestFinished(_request) {
      this.state = FormSubmissionState.stopped;
      if (this.submitter) config.forms.submitter.afterSubmit(this.submitter);
      this.resetSubmitterText();
      clearBusyState(this.formElement);
      dispatch("turbo:submit-end", {
        target: this.formElement,
        detail: { formSubmission: this, ...this.result }
      });
      this.delegate.formSubmissionFinished(this);
    }
    // Private
    setSubmitsWith() {
      if (!this.submitter || !this.submitsWith) return;
      if (this.submitter.matches("button")) {
        this.originalSubmitText = this.submitter.innerHTML;
        this.submitter.innerHTML = this.submitsWith;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        this.originalSubmitText = input.value;
        input.value = this.submitsWith;
      }
    }
    resetSubmitterText() {
      if (!this.submitter || !this.originalSubmitText) return;
      if (this.submitter.matches("button")) {
        this.submitter.innerHTML = this.originalSubmitText;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        input.value = this.originalSubmitText;
      }
    }
    requestMustRedirect(request) {
      return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
      return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
      return this.submitter?.getAttribute("data-turbo-submits-with");
    }
  };
  function buildFormData(formElement, submitter2) {
    const formData = new FormData(formElement);
    const name = submitter2?.getAttribute("name");
    const value = submitter2?.getAttribute("value");
    if (name) {
      formData.append(name, value || "");
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function getFormAction(formElement, submitter2) {
    const formElementAction = typeof formElement.action === "string" ? formElement.action : null;
    if (submitter2?.hasAttribute("formaction")) {
      return submitter2.getAttribute("formaction") || "";
    } else {
      return formElement.getAttribute("action") || formElementAction || "";
    }
  }
  function getAction(formAction, fetchMethod) {
    const action = expandURL(formAction);
    if (isSafe(fetchMethod)) {
      action.search = "";
    }
    return action;
  }
  function getMethod(formElement, submitter2) {
    const method = submitter2?.getAttribute("formmethod") || formElement.getAttribute("method") || "";
    return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
  }
  function getEnctype(formElement, submitter2) {
    return fetchEnctypeFromString(submitter2?.getAttribute("formenctype") || formElement.enctype);
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get activeElement() {
      return this.element.ownerDocument.activeElement;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return queryAutofocusableElement(this.element);
    }
    get permanentElements() {
      return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
      return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id);
        if (newPermanentElement) {
          permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
  }
  function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
  }
  var FormSubmitObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
    submitCaptured = () => {
      this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
      this.eventTarget.addEventListener("submit", this.submitBubbled, false);
    };
    submitBubbled = (event) => {
      if (!event.defaultPrevented) {
        const form = event.target instanceof HTMLFormElement ? event.target : void 0;
        const submitter2 = event.submitter || void 0;
        if (form && submissionDoesNotDismissDialog(form, submitter2) && submissionDoesNotTargetIFrame(form, submitter2) && this.delegate.willSubmitForm(form, submitter2)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.delegate.formSubmitted(form, submitter2);
        }
      }
    };
  };
  function submissionDoesNotDismissDialog(form, submitter2) {
    const method = submitter2?.getAttribute("formmethod") || form.getAttribute("method");
    return method != "dialog";
  }
  function submissionDoesNotTargetIFrame(form, submitter2) {
    const target = submitter2?.getAttribute("formtarget") || form.getAttribute("target");
    return doesNotTargetIFrame(target);
  }
  var View = class {
    #resolveRenderPromise = (_value) => {
    };
    #resolveInterceptionPromise = (_value) => {
    };
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    // Scrolling
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    // Rendering
    async render(renderer) {
      const { isPreview, shouldRender, willRender, newSnapshot: snapshot } = renderer;
      const shouldInvalidate = willRender;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.#resolveRenderPromise = resolve);
          this.renderer = renderer;
          await this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.#resolveInterceptionPromise = resolve);
          const options = { resume: this.#resolveInterceptionPromise, render: this.renderer.renderElement, renderMethod: this.renderer.renderMethod };
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
          if (!immediateRender) await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview, this.renderer.renderMethod);
          this.delegate.preloadOnLoadLinksForView(this.element);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.#resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else if (shouldInvalidate) {
        this.invalidate(renderer.reloadReason);
      }
    }
    invalidate(reason) {
      this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    markVisitDirection(direction) {
      this.element.setAttribute("data-turbo-visit-direction", direction);
    }
    unmarkVisitDirection() {
      this.element.removeAttribute("data-turbo-visit-direction");
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    missing() {
      this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    clickBubbled = (event) => {
      if (this.clickEventIsSignificant(event)) {
        this.clickEvent = event;
      } else {
        delete this.clickEvent;
      }
    };
    linkClicked = (event) => {
      if (this.clickEvent && this.clickEventIsSignificant(event)) {
        if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
          this.clickEvent.preventDefault();
          event.preventDefault();
          this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
        }
      }
      delete this.clickEvent;
    };
    willVisit = (_event) => {
      delete this.clickEvent;
    };
    clickEventIsSignificant(event) {
      const target = event.composed ? event.target?.parentElement : event.target;
      const element = findLinkFromClickTarget(target) || target;
      return element instanceof Element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var LinkClickObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickCaptured = () => {
      this.eventTarget.removeEventListener("click", this.clickBubbled, false);
      this.eventTarget.addEventListener("click", this.clickBubbled, false);
    };
    clickBubbled = (event) => {
      if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
        const target = event.composedPath && event.composedPath()[0] || event.target;
        const link = findLinkFromClickTarget(target);
        if (link && doesNotTargetIFrame(link.target)) {
          const location2 = getLocationForLink(link);
          if (this.delegate.willFollowLinkToLocation(link, location2, event)) {
            event.preventDefault();
            this.delegate.followedLinkToLocation(link, location2);
          }
        }
      }
    };
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
  };
  var FormLinkClickObserver = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return false;
    }
    prefetchAndCacheRequestToLocation(link, location2) {
      return;
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, originalEvent) {
      return this.delegate.willSubmitFormLinkToLocation(link, location2, originalEvent) && (link.hasAttribute("data-turbo-method") || link.hasAttribute("data-turbo-stream"));
    }
    followedLinkToLocation(link, location2) {
      const form = document.createElement("form");
      const type = "hidden";
      for (const [name, value] of location2.searchParams) {
        form.append(Object.assign(document.createElement("input"), { type, name, value }));
      }
      const action = Object.assign(location2, { search: "" });
      form.setAttribute("data-turbo", "true");
      form.setAttribute("action", action.href);
      form.setAttribute("hidden", "");
      const method = link.getAttribute("data-turbo-method");
      if (method) form.setAttribute("method", method);
      const turboFrame = link.getAttribute("data-turbo-frame");
      if (turboFrame) form.setAttribute("data-turbo-frame", turboFrame);
      const turboAction = getVisitAction(link);
      if (turboAction) form.setAttribute("data-turbo-action", turboAction);
      const turboConfirm = link.getAttribute("data-turbo-confirm");
      if (turboConfirm) form.setAttribute("data-turbo-confirm", turboConfirm);
      const turboStream = link.hasAttribute("data-turbo-stream");
      if (turboStream) form.setAttribute("data-turbo-stream", "");
      this.delegate.submittedFormLinkToLocation(link, location2, form);
      document.body.appendChild(form);
      form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
      requestAnimationFrame(() => form.requestSubmit());
    }
  };
  var Bardo = class {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
      const bardo = new this(delegate, permanentElementMap);
      bardo.enter();
      await callback();
      bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
      this.delegate = delegate;
      this.permanentElementMap = permanentElementMap;
    }
    enter() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
        this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
        this.delegate.leavingBardo(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder?.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
      return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    #activeElement = null;
    static renderElement(currentElement, newElement) {
    }
    constructor(currentSnapshot, newSnapshot, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.renderElement = this.constructor.renderElement;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    get shouldAutofocus() {
      return true;
    }
    get reloadReason() {
      return;
    }
    prepareToRender() {
      return;
    }
    render() {
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    async preservingPermanentElements(callback) {
      await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      if (this.shouldAutofocus) {
        const element = this.connectedSnapshot.firstAutofocusableElement;
        if (element) {
          element.focus();
        }
      }
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement) {
      if (this.#activeElement) return;
      if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
        this.#activeElement = this.currentSnapshot.activeElement;
      }
    }
    leavingBardo(currentPermanentElement) {
      if (currentPermanentElement.contains(this.#activeElement) && this.#activeElement instanceof HTMLElement) {
        this.#activeElement.focus();
        this.#activeElement = null;
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get renderMethod() {
      return "replace";
    }
  };
  var FrameRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(currentElement);
      destinationRange.deleteContents();
      const frameElement = newElement;
      const sourceRange = frameElement.ownerDocument?.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        currentElement.appendChild(sourceRange.extractContents());
      }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
      this.delegate = delegate;
    }
    get shouldRender() {
      return true;
    }
    async render() {
      await nextRepaint();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextRepaint();
      this.focusFirstAutofocusableElement();
      await nextRepaint();
      this.activateScriptElements();
    }
    loadFrameElement() {
      this.delegate.willRenderFrame(this.currentElement, this.newElement);
      this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
        if (element) {
          element.scrollIntoView({ block, behavior });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var Idiomorph = (function() {
    const noOp = () => {
    };
    const defaults = {
      morphStyle: "outerHTML",
      callbacks: {
        beforeNodeAdded: noOp,
        afterNodeAdded: noOp,
        beforeNodeMorphed: noOp,
        afterNodeMorphed: noOp,
        beforeNodeRemoved: noOp,
        afterNodeRemoved: noOp,
        beforeAttributeUpdated: noOp
      },
      head: {
        style: "merge",
        shouldPreserve: (elt) => elt.getAttribute("im-preserve") === "true",
        shouldReAppend: (elt) => elt.getAttribute("im-re-append") === "true",
        shouldRemove: noOp,
        afterHeadMorphed: noOp
      },
      restoreFocus: true
    };
    function morph(oldNode, newContent, config2 = {}) {
      oldNode = normalizeElement(oldNode);
      const newNode = normalizeParent(newContent);
      const ctx = createMorphContext(oldNode, newNode, config2);
      const morphedNodes = saveAndRestoreFocus(ctx, () => {
        return withHeadBlocking(
          ctx,
          oldNode,
          newNode,
          /** @param {MorphContext} ctx */
          (ctx2) => {
            if (ctx2.morphStyle === "innerHTML") {
              morphChildren2(ctx2, oldNode, newNode);
              return Array.from(oldNode.childNodes);
            } else {
              return morphOuterHTML(ctx2, oldNode, newNode);
            }
          }
        );
      });
      ctx.pantry.remove();
      return morphedNodes;
    }
    function morphOuterHTML(ctx, oldNode, newNode) {
      const oldParent = normalizeParent(oldNode);
      let childNodes = Array.from(oldParent.childNodes);
      const index = childNodes.indexOf(oldNode);
      const rightMargin = childNodes.length - (index + 1);
      morphChildren2(
        ctx,
        oldParent,
        newNode,
        // these two optional params are the secret sauce
        oldNode,
        // start point for iteration
        oldNode.nextSibling
        // end point for iteration
      );
      childNodes = Array.from(oldParent.childNodes);
      return childNodes.slice(index, childNodes.length - rightMargin);
    }
    function saveAndRestoreFocus(ctx, fn) {
      if (!ctx.config.restoreFocus) return fn();
      let activeElement = (
        /** @type {HTMLInputElement|HTMLTextAreaElement|null} */
        document.activeElement
      );
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        return fn();
      }
      const { id: activeElementId, selectionStart, selectionEnd } = activeElement;
      const results = fn();
      if (activeElementId && activeElementId !== document.activeElement?.id) {
        activeElement = ctx.target.querySelector(`#${activeElementId}`);
        activeElement?.focus();
      }
      if (activeElement && !activeElement.selectionEnd && selectionEnd) {
        activeElement.setSelectionRange(selectionStart, selectionEnd);
      }
      return results;
    }
    const morphChildren2 = /* @__PURE__ */ (function() {
      function morphChildren3(ctx, oldParent, newParent, insertionPoint = null, endPoint = null) {
        if (oldParent instanceof HTMLTemplateElement && newParent instanceof HTMLTemplateElement) {
          oldParent = oldParent.content;
          newParent = newParent.content;
        }
        insertionPoint ||= oldParent.firstChild;
        for (const newChild of newParent.childNodes) {
          if (insertionPoint && insertionPoint != endPoint) {
            const bestMatch = findBestMatch(
              ctx,
              newChild,
              insertionPoint,
              endPoint
            );
            if (bestMatch) {
              if (bestMatch !== insertionPoint) {
                removeNodesBetween(ctx, insertionPoint, bestMatch);
              }
              morphNode(bestMatch, newChild, ctx);
              insertionPoint = bestMatch.nextSibling;
              continue;
            }
          }
          if (newChild instanceof Element && ctx.persistentIds.has(newChild.id)) {
            const movedChild = moveBeforeById(
              oldParent,
              newChild.id,
              insertionPoint,
              ctx
            );
            morphNode(movedChild, newChild, ctx);
            insertionPoint = movedChild.nextSibling;
            continue;
          }
          const insertedNode = createNode(
            oldParent,
            newChild,
            insertionPoint,
            ctx
          );
          if (insertedNode) {
            insertionPoint = insertedNode.nextSibling;
          }
        }
        while (insertionPoint && insertionPoint != endPoint) {
          const tempNode = insertionPoint;
          insertionPoint = insertionPoint.nextSibling;
          removeNode(ctx, tempNode);
        }
      }
      function createNode(oldParent, newChild, insertionPoint, ctx) {
        if (ctx.callbacks.beforeNodeAdded(newChild) === false) return null;
        if (ctx.idMap.has(newChild)) {
          const newEmptyChild = document.createElement(
            /** @type {Element} */
            newChild.tagName
          );
          oldParent.insertBefore(newEmptyChild, insertionPoint);
          morphNode(newEmptyChild, newChild, ctx);
          ctx.callbacks.afterNodeAdded(newEmptyChild);
          return newEmptyChild;
        } else {
          const newClonedChild = document.importNode(newChild, true);
          oldParent.insertBefore(newClonedChild, insertionPoint);
          ctx.callbacks.afterNodeAdded(newClonedChild);
          return newClonedChild;
        }
      }
      const findBestMatch = /* @__PURE__ */ (function() {
        function findBestMatch2(ctx, node, startPoint, endPoint) {
          let softMatch = null;
          let nextSibling = node.nextSibling;
          let siblingSoftMatchCount = 0;
          let cursor = startPoint;
          while (cursor && cursor != endPoint) {
            if (isSoftMatch(cursor, node)) {
              if (isIdSetMatch(ctx, cursor, node)) {
                return cursor;
              }
              if (softMatch === null) {
                if (!ctx.idMap.has(cursor)) {
                  softMatch = cursor;
                }
              }
            }
            if (softMatch === null && nextSibling && isSoftMatch(cursor, nextSibling)) {
              siblingSoftMatchCount++;
              nextSibling = nextSibling.nextSibling;
              if (siblingSoftMatchCount >= 2) {
                softMatch = void 0;
              }
            }
            if (cursor.contains(document.activeElement)) break;
            cursor = cursor.nextSibling;
          }
          return softMatch || null;
        }
        function isIdSetMatch(ctx, oldNode, newNode) {
          let oldSet = ctx.idMap.get(oldNode);
          let newSet = ctx.idMap.get(newNode);
          if (!newSet || !oldSet) return false;
          for (const id of oldSet) {
            if (newSet.has(id)) {
              return true;
            }
          }
          return false;
        }
        function isSoftMatch(oldNode, newNode) {
          const oldElt = (
            /** @type {Element} */
            oldNode
          );
          const newElt = (
            /** @type {Element} */
            newNode
          );
          return oldElt.nodeType === newElt.nodeType && oldElt.tagName === newElt.tagName && // If oldElt has an `id` with possible state and it doesn't match newElt.id then avoid morphing.
          // We'll still match an anonymous node with an IDed newElt, though, because if it got this far,
          // its not persistent, and new nodes can't have any hidden state.
          (!oldElt.id || oldElt.id === newElt.id);
        }
        return findBestMatch2;
      })();
      function removeNode(ctx, node) {
        if (ctx.idMap.has(node)) {
          moveBefore(ctx.pantry, node, null);
        } else {
          if (ctx.callbacks.beforeNodeRemoved(node) === false) return;
          node.parentNode?.removeChild(node);
          ctx.callbacks.afterNodeRemoved(node);
        }
      }
      function removeNodesBetween(ctx, startInclusive, endExclusive) {
        let cursor = startInclusive;
        while (cursor && cursor !== endExclusive) {
          let tempNode = (
            /** @type {Node} */
            cursor
          );
          cursor = cursor.nextSibling;
          removeNode(ctx, tempNode);
        }
        return cursor;
      }
      function moveBeforeById(parentNode, id, after, ctx) {
        const target = (
          /** @type {Element} - will always be found */
          ctx.target.querySelector(`#${id}`) || ctx.pantry.querySelector(`#${id}`)
        );
        removeElementFromAncestorsIdMaps(target, ctx);
        moveBefore(parentNode, target, after);
        return target;
      }
      function removeElementFromAncestorsIdMaps(element, ctx) {
        const id = element.id;
        while (element = element.parentNode) {
          let idSet = ctx.idMap.get(element);
          if (idSet) {
            idSet.delete(id);
            if (!idSet.size) {
              ctx.idMap.delete(element);
            }
          }
        }
      }
      function moveBefore(parentNode, element, after) {
        if (parentNode.moveBefore) {
          try {
            parentNode.moveBefore(element, after);
          } catch (e) {
            parentNode.insertBefore(element, after);
          }
        } else {
          parentNode.insertBefore(element, after);
        }
      }
      return morphChildren3;
    })();
    const morphNode = /* @__PURE__ */ (function() {
      function morphNode2(oldNode, newContent, ctx) {
        if (ctx.ignoreActive && oldNode === document.activeElement) {
          return null;
        }
        if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) {
          return oldNode;
        }
        if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ;
        else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
          handleHeadElement(
            oldNode,
            /** @type {HTMLHeadElement} */
            newContent,
            ctx
          );
        } else {
          morphAttributes(oldNode, newContent, ctx);
          if (!ignoreValueOfActiveElement(oldNode, ctx)) {
            morphChildren2(ctx, oldNode, newContent);
          }
        }
        ctx.callbacks.afterNodeMorphed(oldNode, newContent);
        return oldNode;
      }
      function morphAttributes(oldNode, newNode, ctx) {
        let type = newNode.nodeType;
        if (type === 1) {
          const oldElt = (
            /** @type {Element} */
            oldNode
          );
          const newElt = (
            /** @type {Element} */
            newNode
          );
          const oldAttributes = oldElt.attributes;
          const newAttributes = newElt.attributes;
          for (const newAttribute of newAttributes) {
            if (ignoreAttribute(newAttribute.name, oldElt, "update", ctx)) {
              continue;
            }
            if (oldElt.getAttribute(newAttribute.name) !== newAttribute.value) {
              oldElt.setAttribute(newAttribute.name, newAttribute.value);
            }
          }
          for (let i = oldAttributes.length - 1; 0 <= i; i--) {
            const oldAttribute = oldAttributes[i];
            if (!oldAttribute) continue;
            if (!newElt.hasAttribute(oldAttribute.name)) {
              if (ignoreAttribute(oldAttribute.name, oldElt, "remove", ctx)) {
                continue;
              }
              oldElt.removeAttribute(oldAttribute.name);
            }
          }
          if (!ignoreValueOfActiveElement(oldElt, ctx)) {
            syncInputValue(oldElt, newElt, ctx);
          }
        }
        if (type === 8 || type === 3) {
          if (oldNode.nodeValue !== newNode.nodeValue) {
            oldNode.nodeValue = newNode.nodeValue;
          }
        }
      }
      function syncInputValue(oldElement, newElement, ctx) {
        if (oldElement instanceof HTMLInputElement && newElement instanceof HTMLInputElement && newElement.type !== "file") {
          let newValue = newElement.value;
          let oldValue = oldElement.value;
          syncBooleanAttribute(oldElement, newElement, "checked", ctx);
          syncBooleanAttribute(oldElement, newElement, "disabled", ctx);
          if (!newElement.hasAttribute("value")) {
            if (!ignoreAttribute("value", oldElement, "remove", ctx)) {
              oldElement.value = "";
              oldElement.removeAttribute("value");
            }
          } else if (oldValue !== newValue) {
            if (!ignoreAttribute("value", oldElement, "update", ctx)) {
              oldElement.setAttribute("value", newValue);
              oldElement.value = newValue;
            }
          }
        } else if (oldElement instanceof HTMLOptionElement && newElement instanceof HTMLOptionElement) {
          syncBooleanAttribute(oldElement, newElement, "selected", ctx);
        } else if (oldElement instanceof HTMLTextAreaElement && newElement instanceof HTMLTextAreaElement) {
          let newValue = newElement.value;
          let oldValue = oldElement.value;
          if (ignoreAttribute("value", oldElement, "update", ctx)) {
            return;
          }
          if (newValue !== oldValue) {
            oldElement.value = newValue;
          }
          if (oldElement.firstChild && oldElement.firstChild.nodeValue !== newValue) {
            oldElement.firstChild.nodeValue = newValue;
          }
        }
      }
      function syncBooleanAttribute(oldElement, newElement, attributeName, ctx) {
        const newLiveValue = newElement[attributeName], oldLiveValue = oldElement[attributeName];
        if (newLiveValue !== oldLiveValue) {
          const ignoreUpdate = ignoreAttribute(
            attributeName,
            oldElement,
            "update",
            ctx
          );
          if (!ignoreUpdate) {
            oldElement[attributeName] = newElement[attributeName];
          }
          if (newLiveValue) {
            if (!ignoreUpdate) {
              oldElement.setAttribute(attributeName, "");
            }
          } else {
            if (!ignoreAttribute(attributeName, oldElement, "remove", ctx)) {
              oldElement.removeAttribute(attributeName);
            }
          }
        }
      }
      function ignoreAttribute(attr, element, updateType, ctx) {
        if (attr === "value" && ctx.ignoreActiveValue && element === document.activeElement) {
          return true;
        }
        return ctx.callbacks.beforeAttributeUpdated(attr, element, updateType) === false;
      }
      function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
        return !!ctx.ignoreActiveValue && possibleActiveElement === document.activeElement && possibleActiveElement !== document.body;
      }
      return morphNode2;
    })();
    function withHeadBlocking(ctx, oldNode, newNode, callback) {
      if (ctx.head.block) {
        const oldHead = oldNode.querySelector("head");
        const newHead = newNode.querySelector("head");
        if (oldHead && newHead) {
          const promises = handleHeadElement(oldHead, newHead, ctx);
          return Promise.all(promises).then(() => {
            const newCtx = Object.assign(ctx, {
              head: {
                block: false,
                ignore: true
              }
            });
            return callback(newCtx);
          });
        }
      }
      return callback(ctx);
    }
    function handleHeadElement(oldHead, newHead, ctx) {
      let added = [];
      let removed = [];
      let preserved = [];
      let nodesToAppend = [];
      let srcToNewHeadNodes = /* @__PURE__ */ new Map();
      for (const newHeadChild of newHead.children) {
        srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
      }
      for (const currentHeadElt of oldHead.children) {
        let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
        let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
        let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
        if (inNewContent || isPreserved) {
          if (isReAppended) {
            removed.push(currentHeadElt);
          } else {
            srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
            preserved.push(currentHeadElt);
          }
        } else {
          if (ctx.head.style === "append") {
            if (isReAppended) {
              removed.push(currentHeadElt);
              nodesToAppend.push(currentHeadElt);
            }
          } else {
            if (ctx.head.shouldRemove(currentHeadElt) !== false) {
              removed.push(currentHeadElt);
            }
          }
        }
      }
      nodesToAppend.push(...srcToNewHeadNodes.values());
      let promises = [];
      for (const newNode of nodesToAppend) {
        let newElt = (
          /** @type {ChildNode} */
          document.createRange().createContextualFragment(newNode.outerHTML).firstChild
        );
        if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
          if ("href" in newElt && newElt.href || "src" in newElt && newElt.src) {
            let resolve;
            let promise = new Promise(function(_resolve) {
              resolve = _resolve;
            });
            newElt.addEventListener("load", function() {
              resolve();
            });
            promises.push(promise);
          }
          oldHead.appendChild(newElt);
          ctx.callbacks.afterNodeAdded(newElt);
          added.push(newElt);
        }
      }
      for (const removedElement of removed) {
        if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
          oldHead.removeChild(removedElement);
          ctx.callbacks.afterNodeRemoved(removedElement);
        }
      }
      ctx.head.afterHeadMorphed(oldHead, {
        added,
        kept: preserved,
        removed
      });
      return promises;
    }
    const createMorphContext = /* @__PURE__ */ (function() {
      function createMorphContext2(oldNode, newContent, config2) {
        const { persistentIds, idMap } = createIdMaps(oldNode, newContent);
        const mergedConfig = mergeDefaults(config2);
        const morphStyle = mergedConfig.morphStyle || "outerHTML";
        if (!["innerHTML", "outerHTML"].includes(morphStyle)) {
          throw `Do not understand how to morph style ${morphStyle}`;
        }
        return {
          target: oldNode,
          newContent,
          config: mergedConfig,
          morphStyle,
          ignoreActive: mergedConfig.ignoreActive,
          ignoreActiveValue: mergedConfig.ignoreActiveValue,
          restoreFocus: mergedConfig.restoreFocus,
          idMap,
          persistentIds,
          pantry: createPantry(),
          callbacks: mergedConfig.callbacks,
          head: mergedConfig.head
        };
      }
      function mergeDefaults(config2) {
        let finalConfig = Object.assign({}, defaults);
        Object.assign(finalConfig, config2);
        finalConfig.callbacks = Object.assign(
          {},
          defaults.callbacks,
          config2.callbacks
        );
        finalConfig.head = Object.assign({}, defaults.head, config2.head);
        return finalConfig;
      }
      function createPantry() {
        const pantry = document.createElement("div");
        pantry.hidden = true;
        document.body.insertAdjacentElement("afterend", pantry);
        return pantry;
      }
      function findIdElements(root) {
        let elements = Array.from(root.querySelectorAll("[id]"));
        if (root.id) {
          elements.push(root);
        }
        return elements;
      }
      function populateIdMapWithTree(idMap, persistentIds, root, elements) {
        for (const elt of elements) {
          if (persistentIds.has(elt.id)) {
            let current = elt;
            while (current) {
              let idSet = idMap.get(current);
              if (idSet == null) {
                idSet = /* @__PURE__ */ new Set();
                idMap.set(current, idSet);
              }
              idSet.add(elt.id);
              if (current === root) break;
              current = current.parentElement;
            }
          }
        }
      }
      function createIdMaps(oldContent, newContent) {
        const oldIdElements = findIdElements(oldContent);
        const newIdElements = findIdElements(newContent);
        const persistentIds = createPersistentIds(oldIdElements, newIdElements);
        let idMap = /* @__PURE__ */ new Map();
        populateIdMapWithTree(idMap, persistentIds, oldContent, oldIdElements);
        const newRoot = newContent.__idiomorphRoot || newContent;
        populateIdMapWithTree(idMap, persistentIds, newRoot, newIdElements);
        return { persistentIds, idMap };
      }
      function createPersistentIds(oldIdElements, newIdElements) {
        let duplicateIds = /* @__PURE__ */ new Set();
        let oldIdTagNameMap = /* @__PURE__ */ new Map();
        for (const { id, tagName } of oldIdElements) {
          if (oldIdTagNameMap.has(id)) {
            duplicateIds.add(id);
          } else {
            oldIdTagNameMap.set(id, tagName);
          }
        }
        let persistentIds = /* @__PURE__ */ new Set();
        for (const { id, tagName } of newIdElements) {
          if (persistentIds.has(id)) {
            duplicateIds.add(id);
          } else if (oldIdTagNameMap.get(id) === tagName) {
            persistentIds.add(id);
          }
        }
        for (const id of duplicateIds) {
          persistentIds.delete(id);
        }
        return persistentIds;
      }
      return createMorphContext2;
    })();
    const { normalizeElement, normalizeParent } = /* @__PURE__ */ (function() {
      const generatedByIdiomorph = /* @__PURE__ */ new WeakSet();
      function normalizeElement2(content) {
        if (content instanceof Document) {
          return content.documentElement;
        } else {
          return content;
        }
      }
      function normalizeParent2(newContent) {
        if (newContent == null) {
          return document.createElement("div");
        } else if (typeof newContent === "string") {
          return normalizeParent2(parseContent(newContent));
        } else if (generatedByIdiomorph.has(
          /** @type {Element} */
          newContent
        )) {
          return (
            /** @type {Element} */
            newContent
          );
        } else if (newContent instanceof Node) {
          if (newContent.parentNode) {
            return createDuckTypedParent(newContent);
          } else {
            const dummyParent = document.createElement("div");
            dummyParent.append(newContent);
            return dummyParent;
          }
        } else {
          const dummyParent = document.createElement("div");
          for (const elt of [...newContent]) {
            dummyParent.append(elt);
          }
          return dummyParent;
        }
      }
      function createDuckTypedParent(newContent) {
        return (
          /** @type {Element} */
          /** @type {unknown} */
          {
            childNodes: [newContent],
            /** @ts-ignore - cover your eyes for a minute, tsc */
            querySelectorAll: (s) => {
              const elements = newContent.querySelectorAll(s);
              return newContent.matches(s) ? [newContent, ...elements] : elements;
            },
            /** @ts-ignore */
            insertBefore: (n, r) => newContent.parentNode.insertBefore(n, r),
            /** @ts-ignore */
            moveBefore: (n, r) => newContent.parentNode.moveBefore(n, r),
            // for later use with populateIdMapWithTree to halt upwards iteration
            get __idiomorphRoot() {
              return newContent;
            }
          }
        );
      }
      function parseContent(newContent) {
        let parser = new DOMParser();
        let contentWithSvgsRemoved = newContent.replace(
          /<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,
          ""
        );
        if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
          let content = parser.parseFromString(newContent, "text/html");
          if (contentWithSvgsRemoved.match(/<\/html>/)) {
            generatedByIdiomorph.add(content);
            return content;
          } else {
            let htmlElement = content.firstChild;
            if (htmlElement) {
              generatedByIdiomorph.add(htmlElement);
            }
            return htmlElement;
          }
        } else {
          let responseDoc = parser.parseFromString(
            "<body><template>" + newContent + "</template></body>",
            "text/html"
          );
          let content = (
            /** @type {HTMLTemplateElement} */
            responseDoc.body.querySelector("template").content
          );
          generatedByIdiomorph.add(content);
          return content;
        }
      }
      return { normalizeElement: normalizeElement2, normalizeParent: normalizeParent2 };
    })();
    return {
      morph,
      defaults
    };
  })();
  function morphElements(currentElement, newElement, { callbacks, ...options } = {}) {
    Idiomorph.morph(currentElement, newElement, {
      ...options,
      callbacks: new DefaultIdiomorphCallbacks(callbacks)
    });
  }
  function morphChildren(currentElement, newElement) {
    morphElements(currentElement, newElement.childNodes, {
      morphStyle: "innerHTML"
    });
  }
  var DefaultIdiomorphCallbacks = class {
    #beforeNodeMorphed;
    constructor({ beforeNodeMorphed } = {}) {
      this.#beforeNodeMorphed = beforeNodeMorphed || (() => true);
    }
    beforeNodeAdded = (node) => {
      return !(node.id && node.hasAttribute("data-turbo-permanent") && document.getElementById(node.id));
    };
    beforeNodeMorphed = (currentElement, newElement) => {
      if (currentElement instanceof Element) {
        if (!currentElement.hasAttribute("data-turbo-permanent") && this.#beforeNodeMorphed(currentElement, newElement)) {
          const event = dispatch("turbo:before-morph-element", {
            cancelable: true,
            target: currentElement,
            detail: { currentElement, newElement }
          });
          return !event.defaultPrevented;
        } else {
          return false;
        }
      }
    };
    beforeAttributeUpdated = (attributeName, target, mutationType) => {
      const event = dispatch("turbo:before-morph-attribute", {
        cancelable: true,
        target,
        detail: { attributeName, mutationType }
      });
      return !event.defaultPrevented;
    };
    beforeNodeRemoved = (node) => {
      return this.beforeNodeMorphed(node);
    };
    afterNodeMorphed = (currentElement, newElement) => {
      if (currentElement instanceof Element) {
        dispatch("turbo:morph-element", {
          target: currentElement,
          detail: { currentElement, newElement }
        });
      }
    };
  };
  var MorphingFrameRenderer = class extends FrameRenderer {
    static renderElement(currentElement, newElement) {
      dispatch("turbo:before-frame-morph", {
        target: currentElement,
        detail: { currentElement, newElement }
      });
      morphChildren(currentElement, newElement);
    }
    async preservingPermanentElements(callback) {
      return await callback();
    }
  };
  var ProgressBar = class _ProgressBar {
    static animationDuration = 300;
    /*ms*/
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${_ProgressBar.animationDuration}ms ease-out,
          opacity ${_ProgressBar.animationDuration / 2}ms ${_ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    hiding = false;
    value = 0;
    visible = false;
    constructor() {
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    // Private
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, _ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, _ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    trickle = () => {
      this.setValue(this.value + Math.random() / 100);
    };
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = _ProgressBar.defaultCSS;
      const cspNonce = getCspNonce();
      if (cspNonce) {
        element.nonce = cspNonce;
      }
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
  };
  var HeadSnapshot = class extends Snapshot {
    detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
      const { outerHTML } = element;
      const details = outerHTML in result ? result[outerHTML] : {
        type: elementType(element),
        tracked: elementIsTracked(element),
        elements: []
      };
      return {
        ...result,
        [outerHTML]: {
          ...details,
          elements: [...details.elements, element]
        }
      };
    }, {});
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const {
          elements: [element]
        } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0 | void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class _PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ documentElement, body, head }) {
      return new this(documentElement, body, new HeadSnapshot(head));
    }
    constructor(documentElement, body, headSnapshot) {
      super(body);
      this.documentElement = documentElement;
      this.headSnapshot = headSnapshot;
    }
    clone() {
      const clonedElement = this.element.cloneNode(true);
      const selectElements = this.element.querySelectorAll("select");
      const clonedSelectElements = clonedElement.querySelectorAll("select");
      for (const [index, source] of selectElements.entries()) {
        const clone = clonedSelectElements[index];
        for (const option of clone.selectedOptions) option.selected = false;
        for (const option of source.selectedOptions) clone.options[option.index].selected = true;
      }
      for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
        clonedPasswordInput.value = "";
      }
      return new _PageSnapshot(this.documentElement, clonedElement, this.headSnapshot);
    }
    get lang() {
      return this.documentElement.getAttribute("lang");
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      const root = this.getSetting("root") ?? "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    get prefersViewTransitions() {
      return this.headSnapshot.getMetaValue("view-transition") === "same-origin";
    }
    get shouldMorphPage() {
      return this.getSetting("refresh-method") === "morph";
    }
    get shouldPreserveScrollPosition() {
      return this.getSetting("refresh-scroll") === "preserve";
    }
    // Private
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var ViewTransitioner = class {
    #viewTransitionStarted = false;
    #lastOperation = Promise.resolve();
    renderChange(useViewTransition, render) {
      if (useViewTransition && this.viewTransitionsAvailable && !this.#viewTransitionStarted) {
        this.#viewTransitionStarted = true;
        this.#lastOperation = this.#lastOperation.then(async () => {
          await document.startViewTransition(render).finished;
        });
      } else {
        this.#lastOperation = this.#lastOperation.then(render);
      }
      return this.#lastOperation;
    }
    get viewTransitionsAvailable() {
      return document.startViewTransition;
    }
  };
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false
  };
  var TimingMetric = {
    visitStart: "visitStart",
    requestStart: "requestStart",
    requestEnd: "requestEnd",
    visitEnd: "visitEnd"
  };
  var VisitState = {
    initialized: "initialized",
    started: "started",
    canceled: "canceled",
    failed: "failed",
    completed: "completed"
  };
  var SystemStatusCode = {
    networkFailure: 0,
    timeoutFailure: -1,
    contentTypeMismatch: -2
  };
  var Direction = {
    advance: "forward",
    restore: "back",
    replace: "none"
  };
  var Visit = class {
    identifier = uuid();
    // Required by turbo-ios
    timingMetrics = {};
    followedRedirect = false;
    historyChanged = false;
    scrolled = false;
    shouldCacheSnapshot = true;
    acceptsStreamResponse = false;
    snapshotCached = false;
    state = VisitState.initialized;
    viewTransitioner = new ViewTransitioner();
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const {
        action,
        historyChanged,
        referrer,
        snapshot,
        snapshotHTML,
        response,
        visitCachedSnapshot,
        willRender,
        updateHistory,
        shouldCacheSnapshot,
        acceptsStreamResponse,
        direction
      } = {
        ...defaultOptions,
        ...options
      };
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshot = snapshot;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.isPageRefresh = this.view.isPageRefresh(this);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.updateHistory = updateHistory;
      this.scrolled = !willRender;
      this.shouldCacheSnapshot = shouldCacheSnapshot;
      this.acceptsStreamResponse = acceptsStreamResponse;
      this.direction = direction || Direction[action];
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.adapter.visitCompleted(this);
        this.state = VisitState.completed;
        this.followRedirect();
        if (!this.followedRedirect) {
          this.delegate.visitCompleted(this);
        }
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
        this.delegate.visitCompleted(this);
      }
    }
    changeHistory() {
      if (!this.historyChanged && this.updateHistory) {
        const actionForHistory = this.location.href === this.referrer?.href ? "replace" : this.action;
        const method = getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          if (this.shouldCacheSnapshot) this.cacheSnapshot();
          if (this.view.renderPromise) await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            await this.renderPageSnapshot(snapshot, false);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage || this.isPageRefresh) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise) await this.view.renderPromise;
            await this.renderPageSnapshot(snapshot, isPreview);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      if (this.redirectedToLocation && !this.followedRedirect && this.response?.redirected) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response,
          shouldCacheSnapshot: false,
          willRender: false
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.performScroll();
          this.changeHistory();
          this.adapter.visitRendered(this);
        });
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (this.acceptsStreamResponse) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(_request, _error) {
      this.recordResponse({
        statusCode: SystemStatusCode.networkFailure,
        redirected: false
      });
    }
    requestFinished() {
      this.finishRequest();
    }
    // Scrolling
    performScroll() {
      if (!this.scrolled && !this.view.forceReloaded && !this.view.shouldPreserveScrollPosition(this)) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    // Instrumentation
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = (/* @__PURE__ */ new Date()).getTime();
    }
    getTimingMetrics() {
      return { ...this.timingMetrics };
    }
    // Private
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = document.visibilityState === "hidden" ? setTimeout(() => resolve(), 0) : requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
    }
    async renderPageSnapshot(snapshot, isPreview) {
      await this.viewTransitioner.renderChange(this.view.shouldTransitionTo(snapshot), async () => {
        await this.view.renderPage(snapshot, isPreview, this.willRender, this);
        this.performScroll();
      });
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    progressBar = new ProgressBar();
    constructor(session2) {
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      if (locationIsVisitable(location2, this.navigator.rootLocation)) {
        this.navigator.startVisit(location2, options?.restorationIdentifier || uuid(), options);
      } else {
        window.location.href = location2.toString();
      }
    }
    visitStarted(visit2) {
      this.location = visit2.location;
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload({
            reason: "request_failed",
            context: {
              statusCode
            }
          });
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(_visit) {
    }
    visitCompleted(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    pageInvalidated(reason) {
      this.reload(reason);
    }
    visitFailed(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitRendered(_visit) {
    }
    // Link prefetching
    linkPrefetchingIsEnabledForLocation(location2) {
      return true;
    }
    // Form Submission Delegate
    formSubmissionStarted(_formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    // Private
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    showProgressBar = () => {
      this.progressBar.show();
    };
    reload(reason) {
      dispatch("turbo:reload", { detail: reason });
      window.location.href = this.location?.toString() || window.location.href;
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    selector = "[data-turbo-temporary]";
    deprecatedSelector = "[data-turbo-cache=false]";
    started = false;
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    removeTemporaryElements = (_event) => {
      for (const element of this.temporaryElements) {
        element.remove();
      }
    };
    get temporaryElements() {
      return [...document.querySelectorAll(this.selector), ...this.temporaryElementsWithDeprecation];
    }
    get temporaryElementsWithDeprecation() {
      const elements = document.querySelectorAll(this.deprecatedSelector);
      if (elements.length) {
        console.warn(
          `The ${this.deprecatedSelector} selector is deprecated and will be removed in a future version. Use ${this.selector} instead.`
        );
      }
      return [...elements];
    }
  };
  var FrameRedirector = class {
    constructor(session2, element) {
      this.session = session2;
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formSubmitObserver.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formSubmitObserver.stop();
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
      const frame = this.#findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url, event);
      }
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter2) {
      return element.closest("turbo-frame") == null && this.#shouldSubmit(element, submitter2) && this.#shouldRedirect(element, submitter2);
    }
    formSubmitted(element, submitter2) {
      const frame = this.#findFrameElement(element, submitter2);
      if (frame) {
        frame.delegate.formSubmitted(element, submitter2);
      }
    }
    #shouldSubmit(form, submitter2) {
      const action = getAction$1(form, submitter2);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL(meta?.content ?? "/");
      return this.#shouldRedirect(form, submitter2) && locationIsVisitable(action, rootLocation);
    }
    #shouldRedirect(element, submitter2) {
      const isNavigatable = element instanceof HTMLFormElement ? this.session.submissionIsNavigatable(element, submitter2) : this.session.elementIsNavigatable(element);
      if (isNavigatable) {
        const frame = this.#findFrameElement(element, submitter2);
        return frame ? frame != element.closest("turbo-frame") : false;
      } else {
        return false;
      }
    }
    #findFrameElement(element, submitter2) {
      const id = submitter2?.getAttribute("data-turbo-frame") || element.getAttribute("data-turbo-frame");
      if (id && id != "_top") {
        const frame = this.element.querySelector(`#${id}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    location;
    restorationIdentifier = uuid();
    restorationData = {};
    started = false;
    pageLoaded = false;
    currentIndex = 0;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.currentIndex = history.state?.turbo?.restorationIndex || 0;
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      if (method === history.pushState) ++this.currentIndex;
      const state = { turbo: { restorationIdentifier, restorationIndex: this.currentIndex } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    // Restoration data
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = {
        ...restorationData,
        ...additionalData
      };
    }
    // Scroll restoration
    assumeControlOfScrollRestoration() {
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = history.scrollRestoration ?? "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    // Event handlers
    onPopState = (event) => {
      if (this.shouldHandlePopState()) {
        const { turbo } = event.state || {};
        if (turbo) {
          this.location = new URL(window.location.href);
          const { restorationIdentifier, restorationIndex } = turbo;
          this.restorationIdentifier = restorationIdentifier;
          const direction = restorationIndex > this.currentIndex ? "forward" : "back";
          this.delegate.historyPoppedToLocationWithRestorationIdentifierAndDirection(this.location, restorationIdentifier, direction);
          this.currentIndex = restorationIndex;
        }
      }
    };
    onPageLoad = async (_event) => {
      await nextMicrotask();
      this.pageLoaded = true;
    };
    // Private
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var LinkPrefetchObserver = class {
    started = false;
    #prefetchedLink = null;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (this.started) return;
      if (this.eventTarget.readyState === "loading") {
        this.eventTarget.addEventListener("DOMContentLoaded", this.#enable, { once: true });
      } else {
        this.#enable();
      }
    }
    stop() {
      if (!this.started) return;
      this.eventTarget.removeEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = false;
    }
    #enable = () => {
      this.eventTarget.addEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = true;
    };
    #tryToPrefetchRequest = (event) => {
      if (getMetaContent("turbo-prefetch") === "false") return;
      const target = event.target;
      const isLink = target.matches && target.matches("a[href]:not([target^=_]):not([download])");
      if (isLink && this.#isPrefetchable(target)) {
        const link = target;
        const location2 = getLocationForLink(link);
        if (this.delegate.canPrefetchRequestToLocation(link, location2)) {
          this.#prefetchedLink = link;
          const fetchRequest = new FetchRequest(
            this,
            FetchMethod.get,
            location2,
            new URLSearchParams(),
            target
          );
          prefetchCache.setLater(location2.toString(), fetchRequest, this.#cacheTtl);
        }
      }
    };
    #cancelRequestIfObsolete = (event) => {
      if (event.target === this.#prefetchedLink) this.#cancelPrefetchRequest();
    };
    #cancelPrefetchRequest = () => {
      prefetchCache.clear();
      this.#prefetchedLink = null;
    };
    #tryToUsePrefetchedRequest = (event) => {
      if (event.target.tagName !== "FORM" && event.detail.fetchOptions.method === "GET") {
        const cached = prefetchCache.get(event.detail.url.toString());
        if (cached) {
          event.detail.fetchRequest = cached;
        }
        prefetchCache.clear();
      }
    };
    prepareRequest(request) {
      const link = request.target;
      request.headers["X-Sec-Purpose"] = "prefetch";
      const turboFrame = link.closest("turbo-frame");
      const turboFrameTarget = link.getAttribute("data-turbo-frame") || turboFrame?.getAttribute("target") || turboFrame?.id;
      if (turboFrameTarget && turboFrameTarget !== "_top") {
        request.headers["Turbo-Frame"] = turboFrameTarget;
      }
    }
    // Fetch request interface
    requestSucceededWithResponse() {
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    get #cacheTtl() {
      return Number(getMetaContent("turbo-prefetch-cache-time")) || cacheTtl;
    }
    #isPrefetchable(link) {
      const href = link.getAttribute("href");
      if (!href) return false;
      if (unfetchableLink(link)) return false;
      if (linkToTheSamePage(link)) return false;
      if (linkOptsOut(link)) return false;
      if (nonSafeLink(link)) return false;
      if (eventPrevented(link)) return false;
      return true;
    }
  };
  var unfetchableLink = (link) => {
    return link.origin !== document.location.origin || !["http:", "https:"].includes(link.protocol) || link.hasAttribute("target");
  };
  var linkToTheSamePage = (link) => {
    return link.pathname + link.search === document.location.pathname + document.location.search || link.href.startsWith("#");
  };
  var linkOptsOut = (link) => {
    if (link.getAttribute("data-turbo-prefetch") === "false") return true;
    if (link.getAttribute("data-turbo") === "false") return true;
    const turboPrefetchParent = findClosestRecursively(link, "[data-turbo-prefetch]");
    if (turboPrefetchParent && turboPrefetchParent.getAttribute("data-turbo-prefetch") === "false") return true;
    return false;
  };
  var nonSafeLink = (link) => {
    const turboMethod = link.getAttribute("data-turbo-method");
    if (turboMethod && turboMethod.toLowerCase() !== "get") return true;
    if (isUJS(link)) return true;
    if (link.hasAttribute("data-turbo-confirm")) return true;
    if (link.hasAttribute("data-turbo-stream")) return true;
    return false;
  };
  var isUJS = (link) => {
    return link.hasAttribute("data-remote") || link.hasAttribute("data-behavior") || link.hasAttribute("data-confirm") || link.hasAttribute("data-method");
  };
  var eventPrevented = (link) => {
    const event = dispatch("turbo:before-prefetch", { target: link, cancelable: true });
    return event.defaultPrevented;
  };
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        this.delegate.visitProposedToLocation(location2, options);
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, {
        referrer: this.location,
        ...options
      });
      this.currentVisit.start();
    }
    submitForm(form, submitter2) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter2, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get rootLocation() {
      return this.view.snapshot.rootLocation;
    }
    get history() {
      return this.delegate.history;
    }
    // Form submission delegate
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          const shouldCacheSnapshot = formSubmission.isSafe;
          if (!shouldCacheSnapshot) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.#getActionForFormSubmission(formSubmission, fetchResponse);
          const visitOptions = {
            action,
            shouldCacheSnapshot,
            response: { statusCode, responseHTML, redirected }
          };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot, this.currentVisit);
        } else {
          await this.view.renderPage(snapshot, false, true, this.currentVisit);
        }
        if (!snapshot.shouldPreserveScrollPosition) {
          this.view.scrollToTop();
        }
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error) {
      console.error(error);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    // Link prefetching
    linkPrefetchingIsEnabledForLocation(location2) {
      if (typeof this.adapter.linkPrefetchingIsEnabledForLocation === "function") {
        return this.adapter.linkPrefetchingIsEnabledForLocation(location2);
      }
      return true;
    }
    // Visit delegate
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
      delete this.currentVisit;
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    // Visits
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    #getActionForFormSubmission(formSubmission, fetchResponse) {
      const { submitter: submitter2, formElement } = formSubmission;
      return getVisitAction(submitter2, formElement) || this.#getDefaultAction(fetchResponse);
    }
    #getDefaultAction(fetchResponse) {
      const sameLocationRedirect = fetchResponse.redirected && fetchResponse.location.href === this.location?.href;
      return sameLocationRedirect ? "replace" : "advance";
    }
  };
  var PageStage = {
    initial: 0,
    loading: 1,
    interactive: 2,
    complete: 3
  };
  var PageObserver = class {
    stage = PageStage.initial;
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    interpretReadyState = () => {
      const { readyState } = this;
      if (readyState == "interactive") {
        this.pageIsInteractive();
      } else if (readyState == "complete") {
        this.pageIsComplete();
      }
    };
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    pageWillUnload = () => {
      this.delegate.pageWillUnload();
    };
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    onScroll = () => {
      this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
    };
    // Private
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamMessageRenderer = class {
    render({ fragment }) {
      Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => {
        withAutofocusFromFragment(fragment, () => {
          withPreservedFocus(() => {
            document.documentElement.appendChild(fragment);
          });
        });
      });
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement, newPermanentElement) {
      newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() {
    }
  };
  function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
      const { id } = permanentElementInDocument;
      for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
        const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
        if (elementInStream) {
          permanentElementMap[id] = [permanentElementInDocument, elementInStream];
        }
      }
    }
    return permanentElementMap;
  }
  async function withAutofocusFromFragment(fragment, callback) {
    const generatedID = `turbo-stream-autofocus-${uuid()}`;
    const turboStreams = fragment.querySelectorAll("turbo-stream");
    const elementWithAutofocus = firstAutofocusableElementInStreams(turboStreams);
    let willAutofocusId = null;
    if (elementWithAutofocus) {
      if (elementWithAutofocus.id) {
        willAutofocusId = elementWithAutofocus.id;
      } else {
        willAutofocusId = generatedID;
      }
      elementWithAutofocus.id = willAutofocusId;
    }
    callback();
    await nextRepaint();
    const hasNoActiveElement = document.activeElement == null || document.activeElement == document.body;
    if (hasNoActiveElement && willAutofocusId) {
      const elementToAutofocus = document.getElementById(willAutofocusId);
      if (elementIsFocusable(elementToAutofocus)) {
        elementToAutofocus.focus();
      }
      if (elementToAutofocus && elementToAutofocus.id == generatedID) {
        elementToAutofocus.removeAttribute("id");
      }
    }
  }
  async function withPreservedFocus(callback) {
    const [activeElementBeforeRender, activeElementAfterRender] = await around(callback, () => document.activeElement);
    const restoreFocusTo = activeElementBeforeRender && activeElementBeforeRender.id;
    if (restoreFocusTo) {
      const elementToFocus = document.getElementById(restoreFocusTo);
      if (elementIsFocusable(elementToFocus) && elementToFocus != activeElementAfterRender) {
        elementToFocus.focus();
      }
    }
  }
  function firstAutofocusableElementInStreams(nodeListOfStreamElements) {
    for (const streamElement of nodeListOfStreamElements) {
      const elementWithAutofocus = queryAutofocusableElement(streamElement.templateElement.content);
      if (elementWithAutofocus) return elementWithAutofocus;
    }
    return null;
  }
  var StreamObserver = class {
    sources = /* @__PURE__ */ new Set();
    #started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.#started) {
        this.#started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.#started) {
        this.#started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    inspectFetchResponse = (event) => {
      const response = fetchResponseFromEvent(event);
      if (response && fetchResponseIsStream(response)) {
        event.preventDefault();
        this.receiveMessageResponse(response);
      }
    };
    receiveMessageEvent = (event) => {
      if (this.#started && typeof event.data == "string") {
        this.receiveMessageHTML(event.data);
      }
    };
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
  };
  function fetchResponseFromEvent(event) {
    const fetchResponse = event.detail?.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    const contentType = response.contentType ?? "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const { documentElement, body } = document;
      documentElement.replaceChild(newElement, body);
    }
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head } = document;
      documentElement.replaceChild(this.newHead, head);
      this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = activateScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return document.documentElement.querySelectorAll("script");
    }
  };
  var PageRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      if (document.body && newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(newElement);
      } else {
        document.documentElement.appendChild(newElement);
      }
    }
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
      if (!this.newSnapshot.isVisitable) {
        return {
          reason: "turbo_visit_control_is_reload"
        };
      }
      if (!this.trackedElementsAreIdentical) {
        return {
          reason: "tracked_element_mismatch"
        };
      }
    }
    async prepareToRender() {
      this.#setLanguage();
      await this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        await this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    #setLanguage() {
      const { documentElement } = this.currentSnapshot;
      const { lang } = this.newSnapshot;
      if (lang) {
        documentElement.setAttribute("lang", lang);
      } else {
        documentElement.removeAttribute("lang");
      }
    }
    async mergeHead() {
      const mergedHeadElements = this.mergeProvisionalElements();
      const newStylesheetElements = this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      await mergedHeadElements;
      await newStylesheetElements;
      if (this.willRender) {
        this.removeUnusedDynamicStylesheetElements();
      }
    }
    async replaceBody() {
      await this.preservingPermanentElements(async () => {
        this.activateNewBody();
        await this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
      const loadingElements = [];
      for (const element of this.newHeadStylesheetElements) {
        loadingElements.push(waitForLoad(element));
        document.head.appendChild(element);
      }
      await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(activateScriptElement(element));
      }
    }
    removeUnusedDynamicStylesheetElements() {
      for (const element of this.unusedDynamicStylesheetElements) {
        document.head.removeChild(element);
      }
    }
    async mergeProvisionalElements() {
      const newHeadElements = [...this.newHeadProvisionalElements];
      for (const element of this.currentHeadProvisionalElements) {
        if (!this.isCurrentElementInElementList(element, newHeadElements)) {
          document.head.removeChild(element);
        }
      }
      for (const element of newHeadElements) {
        document.head.appendChild(element);
      }
    }
    isCurrentElementInElementList(element, elementList) {
      for (const [index, newElement] of elementList.entries()) {
        if (element.tagName == "TITLE") {
          if (newElement.tagName != "TITLE") {
            continue;
          }
          if (element.innerHTML == newElement.innerHTML) {
            elementList.splice(index, 1);
            return true;
          }
        }
        if (newElement.isEqualNode(element)) {
          elementList.splice(index, 1);
          return true;
        }
      }
      return false;
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    async assignNewBody() {
      await this.renderElement(this.currentElement, this.newElement);
    }
    get unusedDynamicStylesheetElements() {
      return this.oldHeadStylesheetElements.filter((element) => {
        return element.getAttribute("data-turbo-track") === "dynamic";
      });
    }
    get oldHeadStylesheetElements() {
      return this.currentHeadSnapshot.getStylesheetElementsNotInSnapshot(this.newHeadSnapshot);
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var MorphingPageRenderer = class extends PageRenderer {
    static renderElement(currentElement, newElement) {
      morphElements(currentElement, newElement, {
        callbacks: {
          beforeNodeMorphed: (element) => !canRefreshFrame(element)
        }
      });
      for (const frame of currentElement.querySelectorAll("turbo-frame")) {
        if (canRefreshFrame(frame)) frame.reload();
      }
      dispatch("turbo:morph", { detail: { currentElement, newElement } });
    }
    async preservingPermanentElements(callback) {
      return await callback();
    }
    get renderMethod() {
      return "morph";
    }
    get shouldAutofocus() {
      return false;
    }
  };
  function canRefreshFrame(frame) {
    return frame instanceof FrameElement && frame.src && frame.refresh === "morph" && !frame.closest("[data-turbo-permanent]");
  }
  var SnapshotCache = class {
    keys = [];
    snapshots = {};
    constructor(size) {
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    // Private
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    snapshotCache = new SnapshotCache(10);
    lastRenderedLocation = new URL(location.href);
    forceReloaded = false;
    shouldTransitionTo(newSnapshot) {
      return this.snapshot.prefersViewTransitions && newSnapshot.prefersViewTransitions;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit2) {
      const shouldMorphPage = this.isPageRefresh(visit2) && this.snapshot.shouldMorphPage;
      const rendererClass = shouldMorphPage ? MorphingPageRenderer : PageRenderer;
      const renderer = new rendererClass(this.snapshot, snapshot, isPreview, willRender);
      if (!renderer.shouldRender) {
        this.forceReloaded = true;
      } else {
        visit2?.changeHistory();
      }
      return this.render(renderer);
    }
    renderError(snapshot, visit2) {
      visit2?.changeHistory();
      const renderer = new ErrorRenderer(this.snapshot, snapshot, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
      if (snapshot.isCacheable) {
        this.delegate.viewWillCacheSnapshot();
        const { lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    isPageRefresh(visit2) {
      return !visit2 || this.lastRenderedLocation.pathname === visit2.location.pathname && visit2.action === "replace";
    }
    shouldPreserveScrollPosition(visit2) {
      return this.isPageRefresh(visit2) && this.snapshot.shouldPreserveScrollPosition;
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
  };
  var Preloader = class {
    selector = "a[data-turbo-preload]";
    constructor(delegate, snapshotCache) {
      this.delegate = delegate;
      this.snapshotCache = snapshotCache;
    }
    start() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", this.#preloadAll);
      } else {
        this.preloadOnLoadLinksForView(document.body);
      }
    }
    stop() {
      document.removeEventListener("DOMContentLoaded", this.#preloadAll);
    }
    preloadOnLoadLinksForView(element) {
      for (const link of element.querySelectorAll(this.selector)) {
        if (this.delegate.shouldPreloadLink(link)) {
          this.preloadURL(link);
        }
      }
    }
    async preloadURL(link) {
      const location2 = new URL(link.href);
      if (this.snapshotCache.has(location2)) {
        return;
      }
      const fetchRequest = new FetchRequest(this, FetchMethod.get, location2, new URLSearchParams(), link);
      await fetchRequest.perform();
    }
    // Fetch request delegate
    prepareRequest(fetchRequest) {
      fetchRequest.headers["X-Sec-Purpose"] = "prefetch";
    }
    async requestSucceededWithResponse(fetchRequest, fetchResponse) {
      try {
        const responseHTML = await fetchResponse.responseHTML;
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        this.snapshotCache.put(fetchRequest.url, snapshot);
      } catch (_) {
      }
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    #preloadAll = () => {
      this.preloadOnLoadLinksForView(document.body);
    };
  };
  var Cache = class {
    constructor(session2) {
      this.session = session2;
    }
    clear() {
      this.session.clearCache();
    }
    resetCacheControl() {
      this.#setCacheControl("");
    }
    exemptPageFromCache() {
      this.#setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
      this.#setCacheControl("no-preview");
    }
    #setCacheControl(value) {
      setMetaContent("turbo-cache-control", value);
    }
  };
  var Session = class {
    navigator = new Navigator(this);
    history = new History(this);
    view = new PageView(this, document.documentElement);
    adapter = new BrowserAdapter(this);
    pageObserver = new PageObserver(this);
    cacheObserver = new CacheObserver();
    linkPrefetchObserver = new LinkPrefetchObserver(this, document);
    linkClickObserver = new LinkClickObserver(this, window);
    formSubmitObserver = new FormSubmitObserver(this, document);
    scrollObserver = new ScrollObserver(this);
    streamObserver = new StreamObserver(this);
    formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
    frameRedirector = new FrameRedirector(this, document.documentElement);
    streamMessageRenderer = new StreamMessageRenderer();
    cache = new Cache(this);
    enabled = true;
    started = false;
    #pageRefreshDebouncePeriod = 150;
    constructor(recentRequests2) {
      this.recentRequests = recentRequests2;
      this.preloader = new Preloader(this, this.view.snapshotCache);
      this.debouncedRefresh = this.refresh;
      this.pageRefreshDebouncePeriod = this.pageRefreshDebouncePeriod;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkPrefetchObserver.start();
        this.formLinkClickObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.preloader.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkPrefetchObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.preloader.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      const frameElement = options.frame ? document.getElementById(options.frame) : null;
      if (frameElement instanceof FrameElement) {
        const action = options.action || getVisitAction(frameElement);
        frameElement.delegate.proposeVisitIfNavigatedWithAction(frameElement, action);
        frameElement.src = location2.toString();
      } else {
        this.navigator.proposeVisit(expandURL(location2), options);
      }
    }
    refresh(url, requestId) {
      const isRecentRequest = requestId && this.recentRequests.has(requestId);
      const isCurrentUrl = url === document.baseURI;
      if (!isRecentRequest && !this.navigator.currentVisit && isCurrentUrl) {
        this.visit(url, { action: "replace", shouldCacheSnapshot: false });
      }
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      console.warn(
        "Please replace `session.setProgressBarDelay(delay)` with `session.progressBarDelay = delay`. The function is deprecated and will be removed in a future version of Turbo.`"
      );
      this.progressBarDelay = delay;
    }
    set progressBarDelay(delay) {
      config.drive.progressBarDelay = delay;
    }
    get progressBarDelay() {
      return config.drive.progressBarDelay;
    }
    set drive(value) {
      config.drive.enabled = value;
    }
    get drive() {
      return config.drive.enabled;
    }
    set formMode(value) {
      config.forms.mode = value;
    }
    get formMode() {
      return config.forms.mode;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    get pageRefreshDebouncePeriod() {
      return this.#pageRefreshDebouncePeriod;
    }
    set pageRefreshDebouncePeriod(value) {
      this.refresh = debounce(this.debouncedRefresh.bind(this), value);
      this.#pageRefreshDebouncePeriod = value;
    }
    // Preloader delegate
    shouldPreloadLink(element) {
      const isUnsafe = element.hasAttribute("data-turbo-method");
      const isStream = element.hasAttribute("data-turbo-stream");
      const frameTarget = element.getAttribute("data-turbo-frame");
      const frame = frameTarget == "_top" ? null : document.getElementById(frameTarget) || findClosestRecursively(element, "turbo-frame:not([disabled])");
      if (isUnsafe || isStream || frame instanceof FrameElement) {
        return false;
      } else {
        const location2 = new URL(element.href);
        return this.elementIsNavigatable(element) && locationIsVisitable(location2, this.snapshot.rootLocation);
      }
    }
    // History delegate
    historyPoppedToLocationWithRestorationIdentifierAndDirection(location2, restorationIdentifier, direction) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, {
          action: "restore",
          historyChanged: true,
          direction
        });
      } else {
        this.adapter.pageInvalidated({
          reason: "turbo_disabled"
        });
      }
    }
    // Scroll observer delegate
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    // Form click observer delegate
    willSubmitFormLinkToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() {
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.navigator.linkPrefetchingIsEnabledForLocation(location2);
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, event) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2, event);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
      this.visit(location2.href, { action, acceptsStreamResponse });
    }
    // Navigator delegate
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    // Visit delegate
    visitStarted(visit2) {
      if (!visit2.acceptsStreamResponse) {
        markAsBusy(document.documentElement);
        this.view.markVisitDirection(visit2.direction);
      }
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.view.unmarkVisitDirection();
      clearBusyState(document.documentElement);
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    // Form submit observer delegate
    willSubmitForm(form, submitter2) {
      const action = getAction$1(form, submitter2);
      return this.submissionIsNavigatable(form, submitter2) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter2) {
      this.navigator.submitForm(form, submitter2);
    }
    // Page observer delegate
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    // Stream observer delegate
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    // Page view delegate
    viewWillCacheSnapshot() {
      if (!this.navigator.currentVisit?.silent) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, options) {
      const event = this.notifyApplicationBeforeRender(element, options);
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, renderMethod) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender(renderMethod);
    }
    preloadOnLoadLinksForView(element) {
      this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
      this.adapter.pageInvalidated(reason);
    }
    // Frame element
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    // Application events
    applicationAllowsFollowingLinkToLocation(link, location2, ev) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2, ev);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2, event) {
      return dispatch("turbo:click", {
        target: link,
        detail: { url: location2.href, originalEvent: event },
        cancelable: true
      });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", {
        detail: { url: location2.href },
        cancelable: true
      });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
      return dispatch("turbo:before-render", {
        detail: { newBody, ...options },
        cancelable: true
      });
    }
    notifyApplicationAfterRender(renderMethod) {
      return dispatch("turbo:render", { detail: { renderMethod } });
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", {
        detail: { url: this.location.href, timing }
      });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(
        new HashChangeEvent("hashchange", {
          oldURL: oldURL.toString(),
          newURL: newURL.toString()
        })
      );
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", {
        detail: { fetchResponse },
        target: frame,
        cancelable: true
      });
    }
    // Helpers
    submissionIsNavigatable(form, submitter2) {
      if (config.forms.mode == "off") {
        return false;
      } else {
        const submitterIsNavigatable = submitter2 ? this.elementIsNavigatable(submitter2) : true;
        if (config.forms.mode == "optin") {
          return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
        } else {
          return submitterIsNavigatable && this.elementIsNavigatable(form);
        }
      }
    }
    elementIsNavigatable(element) {
      const container = findClosestRecursively(element, "[data-turbo]");
      const withinFrame = findClosestRecursively(element, "turbo-frame");
      if (config.drive.enabled || withinFrame) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    // Private
    getActionForLink(link) {
      return getVisitAction(link) || "advance";
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session(recentRequests);
  var { cache, navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    console.warn(
      "Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    console.warn(
      "Please replace `Turbo.setProgressBarDelay(delay)` with `Turbo.config.drive.progressBarDelay = delay`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.drive.progressBarDelay = delay;
  }
  function setConfirmMethod(confirmMethod) {
    console.warn(
      "Please replace `Turbo.setConfirmMethod(confirmMethod)` with `Turbo.config.forms.confirm = confirmMethod`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.forms.confirm = confirmMethod;
  }
  function setFormMode(mode) {
    console.warn(
      "Please replace `Turbo.setFormMode(mode)` with `Turbo.config.forms.mode = mode`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    config.forms.mode = mode;
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    cache,
    PageRenderer,
    PageSnapshot,
    FrameRenderer,
    fetch: fetchWithTurboHeaders,
    config,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod,
    setFormMode
  });
  var TurboFrameMissingError = class extends Error {
  };
  var FrameController = class {
    fetchResponseLoaded = (_fetchResponse) => Promise.resolve();
    #currentFetchRequest = null;
    #resolveVisitPromise = () => {
    };
    #connected = false;
    #hasBeenLoaded = false;
    #ignoredAttributes = /* @__PURE__ */ new Set();
    #shouldMorphFrame = false;
    action = null;
    constructor(element) {
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.restorationIdentifier = uuid();
      this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    // Frame delegate
    connect() {
      if (!this.#connected) {
        this.#connected = true;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        } else {
          this.#loadSourceURL();
        }
        this.formLinkClickObserver.start();
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
      }
    }
    disconnect() {
      if (this.#connected) {
        this.#connected = false;
        this.appearanceObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.#loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.#isIgnoringChangesTo("src")) return;
      if (this.element.isConnected) {
        this.complete = false;
      }
      if (this.loadingStyle == FrameLoadingStyle.eager || this.#hasBeenLoaded) {
        this.#loadSourceURL();
      }
    }
    sourceURLReloaded() {
      const { refresh, src } = this.element;
      this.#shouldMorphFrame = src && refresh === "morph";
      this.element.removeAttribute("complete");
      this.element.src = null;
      this.element.src = src;
      return this.element.loaded;
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.#loadSourceURL();
      }
    }
    async #loadSourceURL() {
      if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
        this.element.loaded = this.#visit(expandURL(this.sourceURL));
        this.appearanceObserver.stop();
        await this.element.loaded;
        this.#hasBeenLoaded = true;
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const document2 = parseHTMLDocument(html);
          const pageSnapshot = PageSnapshot.fromDocument(document2);
          if (pageSnapshot.isVisitable) {
            await this.#loadFrameResponse(fetchResponse, document2);
          } else {
            await this.#handleUnvisitableFrameResponse(fetchResponse);
          }
        }
      } finally {
        this.#shouldMorphFrame = false;
        this.fetchResponseLoaded = () => Promise.resolve();
      }
    }
    // Appearance observer delegate
    elementAppearedInViewport(element) {
      this.proposeVisitIfNavigatedWithAction(element, getVisitAction(element));
      this.#loadSourceURL();
    }
    // Form link click observer delegate
    willSubmitFormLinkToLocation(link) {
      return this.#shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
      const frame = this.#findFrameElement(link);
      if (frame) form.setAttribute("data-turbo-frame", frame.id);
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location2) {
      this.#navigateFrame(element, location2);
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter2) {
      return element.closest("turbo-frame") == this.element && this.#shouldInterceptNavigation(element, submitter2);
    }
    formSubmitted(element, submitter2) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.formSubmission = new FormSubmission(this, element, submitter2);
      const { fetchRequest } = this.formSubmission;
      this.prepareRequest(fetchRequest);
      this.formSubmission.start();
    }
    // Fetch request delegate
    prepareRequest(request) {
      request.headers["Turbo-Frame"] = this.id;
      if (this.currentNavigationElement?.hasAttribute("data-turbo-stream")) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
      this.#resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    requestErrored(request, error) {
      console.error(error);
      this.#resolveVisitPromise();
    }
    requestFinished(_request) {
      clearBusyState(this.element);
    }
    // Form submission delegate
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.#findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.#findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(formSubmission.submitter, formSubmission.formElement, frame));
      frame.delegate.loadResponse(response);
      if (!formSubmission.isSafe) {
        session.clearCache();
      }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
      session.clearCache();
    }
    formSubmissionErrored(formSubmission, error) {
      console.error(error);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.#findFrameElement(formElement));
    }
    // View delegate
    allowsImmediateRender({ element: newFrame }, options) {
      const event = dispatch("turbo:before-frame-render", {
        target: this.element,
        detail: { newFrame, ...options },
        cancelable: true
      });
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, _renderMethod) {
    }
    preloadOnLoadLinksForView(element) {
      session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() {
    }
    // Frame renderer delegate
    willRenderFrame(currentElement, _newElement) {
      this.previousFrameElement = currentElement.cloneNode(true);
    }
    visitCachedSnapshot = ({ element }) => {
      const frame = element.querySelector("#" + this.element.id);
      if (frame && this.previousFrameElement) {
        frame.replaceChildren(...this.previousFrameElement.children);
      }
      delete this.previousFrameElement;
    };
    // Private
    async #loadFrameResponse(fetchResponse, document2) {
      const newFrameElement = await this.extractForeignFrameElement(document2.body);
      const rendererClass = this.#shouldMorphFrame ? MorphingFrameRenderer : FrameRenderer;
      if (newFrameElement) {
        const snapshot = new Snapshot(newFrameElement);
        const renderer = new rendererClass(this, this.view.snapshot, snapshot, false, false);
        if (this.view.renderPromise) await this.view.renderPromise;
        this.changeHistory();
        await this.view.render(renderer);
        this.complete = true;
        session.frameRendered(fetchResponse, this.element);
        session.frameLoaded(this.element);
        await this.fetchResponseLoaded(fetchResponse);
      } else if (this.#willHandleFrameMissingFromResponse(fetchResponse)) {
        this.#handleFrameMissingFromResponse(fetchResponse);
      }
    }
    async #visit(url) {
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      this.#currentFetchRequest?.cancel();
      this.#currentFetchRequest = request;
      return new Promise((resolve) => {
        this.#resolveVisitPromise = () => {
          this.#resolveVisitPromise = () => {
          };
          this.#currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    #navigateFrame(element, url, submitter2) {
      const frame = this.#findFrameElement(element, submitter2);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(submitter2, element, frame));
      this.#withCurrentNavigationElement(element, () => {
        frame.src = url;
      });
    }
    proposeVisitIfNavigatedWithAction(frame, action = null) {
      this.action = action;
      if (this.action) {
        const pageSnapshot = PageSnapshot.fromElement(frame).clone();
        const { visitCachedSnapshot } = frame.delegate;
        frame.delegate.fetchResponseLoaded = async (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = await fetchResponse.responseHTML;
            const response = { statusCode, redirected, responseHTML };
            const options = {
              response,
              visitCachedSnapshot,
              willRender: false,
              updateHistory: false,
              restorationIdentifier: this.restorationIdentifier,
              snapshot: pageSnapshot
            };
            if (this.action) options.action = this.action;
            session.visit(frame.src, options);
          }
        };
      }
    }
    changeHistory() {
      if (this.action) {
        const method = getHistoryMethodForAction(this.action);
        session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
      }
    }
    async #handleUnvisitableFrameResponse(fetchResponse) {
      console.warn(
        `The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`
      );
      await this.#visitResponse(fetchResponse.response);
    }
    #willHandleFrameMissingFromResponse(fetchResponse) {
      this.element.setAttribute("complete", "");
      const response = fetchResponse.response;
      const visit2 = async (url, options) => {
        if (url instanceof Response) {
          this.#visitResponse(url);
        } else {
          session.visit(url, options);
        }
      };
      const event = dispatch("turbo:frame-missing", {
        target: this.element,
        detail: { response, visit: visit2 },
        cancelable: true
      });
      return !event.defaultPrevented;
    }
    #handleFrameMissingFromResponse(fetchResponse) {
      this.view.missing();
      this.#throwFrameMissingError(fetchResponse);
    }
    #throwFrameMissingError(fetchResponse) {
      const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
      throw new TurboFrameMissingError(message);
    }
    async #visitResponse(response) {
      const wrapped = new FetchResponse(response);
      const responseHTML = await wrapped.responseHTML;
      const { location: location2, redirected, statusCode } = wrapped;
      return session.visit(location2, { response: { redirected, statusCode, responseHTML } });
    }
    #findFrameElement(element, submitter2) {
      const id = getAttribute("data-turbo-frame", submitter2, element) || this.element.getAttribute("target");
      return getFrameElementById(id) ?? this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id = CSS.escape(this.id);
      try {
        element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
        if (element) {
          return element;
        }
        element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
        if (element) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
      } catch (error) {
        console.error(error);
        return new FrameElement();
      }
      return null;
    }
    #formActionIsVisitable(form, submitter2) {
      const action = getAction$1(form, submitter2);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    #shouldInterceptNavigation(element, submitter2) {
      const id = getAttribute("data-turbo-frame", submitter2, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.#formActionIsVisitable(element, submitter2)) {
        return false;
      }
      if (!this.enabled || id == "_top") {
        return false;
      }
      if (id) {
        const frameElement = getFrameElementById(id);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementIsNavigatable(element)) {
        return false;
      }
      if (submitter2 && !session.elementIsNavigatable(submitter2)) {
        return false;
      }
      return true;
    }
    // Computed properties
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    set sourceURL(sourceURL) {
      this.#ignoringChangesToAttribute("src", () => {
        this.element.src = sourceURL ?? null;
      });
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.#resolveVisitPromise() !== void 0;
    }
    get complete() {
      return this.element.hasAttribute("complete");
    }
    set complete(value) {
      if (value) {
        this.element.setAttribute("complete", "");
      } else {
        this.element.removeAttribute("complete");
      }
    }
    get isActive() {
      return this.element.isActive && this.#connected;
    }
    get rootLocation() {
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = meta?.content ?? "/";
      return expandURL(root);
    }
    #isIgnoringChangesTo(attributeName) {
      return this.#ignoredAttributes.has(attributeName);
    }
    #ignoringChangesToAttribute(attributeName, callback) {
      this.#ignoredAttributes.add(attributeName);
      callback();
      this.#ignoredAttributes.delete(attributeName);
    }
    #withCurrentNavigationElement(element, callback) {
      this.currentNavigationElement = element;
      callback();
      delete this.currentNavigationElement;
    }
  };
  function getFrameElementById(id) {
    if (id != null) {
      const element = document.getElementById(id);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e.nextSibling));
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e));
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      const method = this.getAttribute("method");
      this.targetElements.forEach((targetElement) => {
        if (method === "morph") {
          morphElements(targetElement, this.templateContent);
        } else {
          targetElement.replaceWith(this.templateContent);
        }
      });
    },
    update() {
      const method = this.getAttribute("method");
      this.targetElements.forEach((targetElement) => {
        if (method === "morph") {
          morphChildren(targetElement, this.templateContent);
        } else {
          targetElement.innerHTML = "";
          targetElement.append(this.templateContent);
        }
      });
    },
    refresh() {
      session.refresh(this.baseURI, this.requestId);
    }
  };
  var StreamElement = class _StreamElement extends HTMLElement {
    static async renderElement(newElement) {
      await newElement.performAction();
    }
    async connectedCallback() {
      try {
        await this.render();
      } catch (error) {
        console.error(error);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      return this.renderPromise ??= (async () => {
        const event = this.beforeRenderEvent;
        if (this.dispatchEvent(event)) {
          await nextRepaint();
          await event.detail.render(this);
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch {
      }
    }
    /**
     * Removes duplicate children (by ID)
     */
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    /**
     * Gets the list of duplicate children (i.e. those with the same ID)
     */
    get duplicateChildren() {
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.getAttribute("id"));
      const newChildrenIds = [...this.templateContent?.children || []].filter((c) => !!c.getAttribute("id")).map((c) => c.getAttribute("id"));
      return existingChildren.filter((c) => newChildrenIds.includes(c.getAttribute("id")));
    }
    /**
     * Gets the action function to be performed.
     */
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.#raise("unknown action");
      }
      this.#raise("action attribute is missing");
    }
    /**
     * Gets the target elements which the template will be rendered to.
     */
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.#raise("target or targets attribute is missing");
      }
    }
    /**
     * Gets the contents of the main `<template>`.
     */
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    /**
     * Gets the main `<template>` used for rendering
     */
    get templateElement() {
      if (this.firstElementChild === null) {
        const template = this.ownerDocument.createElement("template");
        this.appendChild(template);
        return template;
      } else if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.#raise("first child element must be a <template> element");
    }
    /**
     * Gets the current action.
     */
    get action() {
      return this.getAttribute("action");
    }
    /**
     * Gets the current target (an element ID) to which the result will
     * be rendered.
     */
    get target() {
      return this.getAttribute("target");
    }
    /**
     * Gets the current "targets" selector (a CSS selector)
     */
    get targets() {
      return this.getAttribute("targets");
    }
    /**
     * Reads the request-id attribute
     */
    get requestId() {
      return this.getAttribute("request-id");
    }
    #raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      return (this.outerHTML.match(/<[^>]+>/) ?? [])[0] ?? "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", {
        bubbles: true,
        cancelable: true,
        detail: { newStream: this, render: _StreamElement.renderElement }
      });
    }
    get targetElementsById() {
      const element = this.ownerDocument?.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      const elements = this.ownerDocument?.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  var StreamSourceElement = class extends HTMLElement {
    streamSource = null;
    connectedCallback() {
      this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
      connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
      if (this.streamSource) {
        this.streamSource.close();
        disconnectStreamSource(this.streamSource);
      }
    }
    get src() {
      return this.getAttribute("src") || "";
    }
  };
  FrameElement.delegateConstructor = FrameController;
  if (customElements.get("turbo-frame") === void 0) {
    customElements.define("turbo-frame", FrameElement);
  }
  if (customElements.get("turbo-stream") === void 0) {
    customElements.define("turbo-stream", StreamElement);
  }
  if (customElements.get("turbo-stream-source") === void 0) {
    customElements.define("turbo-stream-source", StreamSourceElement);
  }
  (() => {
    let element = document.currentScript;
    if (!element) return;
    if (element.hasAttribute("data-turbo-suppress-warning")) return;
    element = element.parentElement;
    while (element) {
      if (element == document.body) {
        return console.warn(
          unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `,
          element.outerHTML
        );
      }
      element = element.parentElement;
    }
  })();
  window.Turbo = { ...Turbo, StreamActions };
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer4 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer4();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/snakeize.js
  function walk(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (obj instanceof Date || obj instanceof RegExp) return obj;
    if (Array.isArray(obj)) return obj.map(walk);
    return Object.keys(obj).reduce(function(acc, key) {
      var camel = key[0].toLowerCase() + key.slice(1).replace(/([A-Z]+)/g, function(m, x) {
        return "_" + x.toLowerCase();
      });
      acc[camel] = walk(obj[key]);
      return acc;
    }, {});
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    static observedAttributes = ["channel", "signed-stream-name"];
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, {
        received: this.dispatchMessageEvent.bind(this),
        connected: this.subscriptionConnected.bind(this),
        disconnected: this.subscriptionDisconnected.bind(this)
      });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription) this.subscription.unsubscribe();
      this.subscriptionDisconnected();
    }
    attributeChangedCallback() {
      if (this.subscription) {
        this.disconnectedCallback();
        this.connectedCallback();
      }
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    subscriptionConnected() {
      this.setAttribute("connected", "");
    }
    subscriptionDisconnected() {
      this.removeAttribute("connected");
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name, ...walk({ ...this.dataset }) };
    }
  };
  if (customElements.get("turbo-cable-stream-source") === void 0) {
    customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/fetch_requests.js
  function encodeMethodIntoRequestBody(event) {
    if (event.target instanceof HTMLFormElement) {
      const { target: form, detail: { fetchOptions } } = event;
      form.addEventListener("turbo:submit-start", ({ detail: { formSubmission: { submitter: submitter2 } } }) => {
        const body = isBodyInit(fetchOptions.body) ? fetchOptions.body : new URLSearchParams();
        const method = determineFetchMethod(submitter2, body, form);
        if (!/get/i.test(method)) {
          if (/post/i.test(method)) {
            body.delete("_method");
          } else {
            body.set("_method", method);
          }
          fetchOptions.method = "post";
        }
      }, { once: true });
    }
  }
  function determineFetchMethod(submitter2, body, form) {
    const formMethod = determineFormMethod(submitter2);
    const overrideMethod = body.get("_method");
    const method = form.getAttribute("method") || "get";
    if (typeof formMethod == "string") {
      return formMethod;
    } else if (typeof overrideMethod == "string") {
      return overrideMethod;
    } else {
      return method;
    }
  }
  function determineFormMethod(submitter2) {
    if (submitter2 instanceof HTMLButtonElement || submitter2 instanceof HTMLInputElement) {
      if (submitter2.name === "_method") {
        return submitter2.value;
      } else if (submitter2.hasAttribute("formmethod")) {
        return submitter2.formMethod;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  function isBodyInit(body) {
    return body instanceof FormData || body instanceof URLSearchParams;
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/index.js
  window.Turbo = turbo_es2017_esm_exports;
  addEventListener("turbo:before-fetch-request", encodeMethodIntoRequestBody);

  // app/javascript/application.js
  var import_jquery = __toESM(require_jquery());
  var import_ujs = __toESM(require_rails_ujs());
  var ActiveStorage = __toESM(require_activestorage());

  // app/javascript/channels/consumer.js
  var import_actioncable = __toESM(require_action_cable());
  var consumer_default = (0, import_actioncable.createConsumer)();

  // app/javascript/channels/chat_room_channel.js
  var appChatRoom = consumer_default.subscriptions.create("ChatRoomChannel", {
    connected() {
    },
    disconnected() {
    },
    received(data) {
      const chatMessages = document.getElementById("chat-messages");
      chatMessages.insertAdjacentHTML("beforeend", data["chat_message"]);
    },
    speak: function(chat_message, chat_room_id) {
      return this.perform("speak", { chat_message, chat_room_id });
    }
  });
  if (/chat_rooms/.test(location.pathname)) {
    $(document).on("keydown", ".chat-room__message-form_textarea", function(e) {
      if (e.key === "Enter") {
        const chat_room_id = $("textarea").data("chat_room_id");
        appChatRoom.speak(e.target.value, chat_room_id);
        e.target.value = "";
        e.preventDefault();
      }
    });
  }

  // app/javascript/src/profile_image_upload.js
  $(document).on("change", "#profile_image_upload", function(e) {
    if (e.target.files.length) {
      let reader = new FileReader();
      reader.onload = function(e2) {
        $(".hidden").removeClass();
        $(".profile-default-img").removeClass();
        $("#profile-img").remove();
        $("#profile-img-prev").attr("src", e2.target.result);
      };
      return reader.readAsDataURL(e.target.files[0]);
    }
  });

  // app/javascript/src/swipe.js
  var initSwipe = () => {
    const container = document.querySelector(".swipe--cards");
    if (!container) return;
    console.debug("[swipe] initializer attached", container);
    const likeButton = document.getElementById("like");
    const dislikeButton = document.getElementById("dislike");
    if (!likeButton || !dislikeButton) return;
    const handleReaction = (reaction) => {
      console.debug("[swipe] handleReaction called with:", reaction);
      const cards = document.querySelectorAll(".swipe--card:not(.removed)");
      if (!cards.length) return;
      const card = cards[0];
      const postId = card.id;
      const moveOutWidth = document.body.clientWidth * 1.5;
      sendReaction(postId, reaction);
      card.classList.add("removed");
      card.style.transform = reaction === "like" ? `translate(${moveOutWidth}px, -120px) rotate(-24deg)` : `translate(-${moveOutWidth}px, -120px) rotate(24deg)`;
    };
    const sendReaction = (postId, reaction) => {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      const payload = new URLSearchParams({
        post_id: postId,
        reaction
      }).toString();
      console.debug("[swipe] sending reaction payload:", payload);
      fetch("/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRF-Token": csrfToken || ""
        },
        credentials: "same-origin",
        body: payload
      }).then((response) => {
        if (!response.ok) {
          console.error("Failed to send reaction:", response.statusText);
        }
      }).catch((error) => console.error("Failed to send reaction:", error));
    };
    likeButton.addEventListener("click", (event) => {
      event.preventDefault();
      handleReaction("like");
    });
    dislikeButton.addEventListener("click", (event) => {
      event.preventDefault();
      handleReaction("dislike");
    });
  };
  document.addEventListener("turbo:load", initSwipe);
  document.addEventListener("DOMContentLoaded", initSwipe);

  // app/javascript/src/payjp.js
  $(function() {
    if (document.URL.match(/cards/)) {
      var payjp = Payjp("pk_test_710ba4c4b0fc4a97350e86f1");
      var elements = payjp.elements();
      var numberElement = elements.create("cardNumber");
      var expiryElement = elements.create("cardExpiry");
      var cvcElement = elements.create("cardCvc");
      numberElement.mount("#number-form");
      expiryElement.mount("#expiry-form");
      cvcElement.mount("#cvc-form");
      var submit_btn = $("#info_submit");
      submit_btn.on("click", function(e) {
        e.preventDefault();
        payjp.createToken(numberElement).then(function(response) {
          if (response.error) {
            alert(response.error.message);
            regist_card.prop("disabled", false);
          } else {
            $("#card_token").append(
              `<input type="hidden" name="payjp_token" value=${response.id}>
            <input type="hidden" name="card_token" value=${response.card.id}>`
            );
            $("#card_form")[0].submit();
            $("#card_number").removeAttr("name");
            $("#cvc-from").removeAttr("name");
            $("#exp_month").removeAttr("name");
            $("#exp_year").removeAttr("name");
          }
          ;
        });
      });
    }
  });

  // app/javascript/application.js
  var import_hammerjs = __toESM(require_hammer());
  window.$ = window.jQuery = import_jquery.default;
  import_ujs.default.start();
  ActiveStorage.start();
})();
/*! Bundled license information:

jquery/dist/jquery.js:
  (*!
   * jQuery JavaScript Library v3.6.0
   * https://jquery.com/
   *
   * Includes Sizzle.js
   * https://sizzlejs.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2021-03-02T17:08Z
   *)

hammerjs/hammer.js:
  (*! Hammer.JS - v2.0.7 - 2016-04-22
   * http://hammerjs.github.io/
   *
   * Copyright (c) 2016 Jorik Tangelder;
   * Licensed under the MIT license *)

@hotwired/turbo/dist/turbo.es2017-esm.js:
  (*!
  Turbo 8.0.13
  Copyright © 2025 37signals LLC
   *)
*/
//# sourceMappingURL=application.js.map
