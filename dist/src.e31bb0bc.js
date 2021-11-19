// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _asyncIterator(iterable) { var method, async, sync, retry = 2; if (typeof Symbol !== "undefined") { async = Symbol.asyncIterator; sync = Symbol.iterator; } while (retry--) { if (async && (method = iterable[async]) != null) { return method.call(iterable); } if (sync && (method = iterable[sync]) != null) { return new AsyncFromSyncIterator(method.call(iterable)); } async = "@@asyncIterator"; sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s; this.n = s.next; }; AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; if (ret === undefined) { return Promise.resolve({ value: value, done: true }); } return AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; if (thr === undefined) return Promise.reject(value); return AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }; function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) { return Promise.reject(new TypeError(r + " is not an object.")); } var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return new AsyncFromSyncIterator(s); }

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

_AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; };

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

var _document$querySelect = document.querySelectorAll("canvas"),
    _document$querySelect2 = _slicedToArray(_document$querySelect, 2),
    canvas1 = _document$querySelect2[0],
    canvas2 = _document$querySelect2[1];

var ctx1 = canvas1.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var unitSize = 150;
var bounds = {};

function resize() {
  canvas1.width = window.innerWidth;
  canvas1.height = window.innerHeight;
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;
  bounds.left = -canvas1.width / 2;
  bounds.right = canvas1.width / 2;
  bounds.top = -canvas1.height + unitSize;
  bounds.bottom = canvas1.height - unitSize;
  drawGrid();
}

addEventListener("resize", resize);
resize();

function drawGrid() {
  ctx1.strokeStyle = "#333333";
  ctx1.resetTransform();
  ctx1.translate(bounds.right, bounds.bottom);

  for (var x = 0; x < bounds.right; x += unitSize) {
    ctx1.beginPath();
    ctx1.moveTo(x, bounds.top);
    ctx1.lineTo(x, bounds.bottom);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.moveTo(-x, bounds.top);
    ctx1.lineTo(-x, bounds.bottom);
    ctx1.stroke();
  }

  for (var y = 0; y < bounds.bottom; y += unitSize) {
    ctx1.beginPath();
    ctx1.moveTo(bounds.left, y);
    ctx1.lineTo(bounds.right, y);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.moveTo(bounds.left, -y);
    ctx1.lineTo(bounds.right, -y);
    ctx1.stroke();
  }
}

function drawRectangle(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var width = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  var height = Math.pow(unitSize, 2) / width;
  var rads = Math.atan2(y, x);
  ctx2.resetTransform();
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx2.translate(bounds.right, bounds.bottom);
  ctx2.rotate(rads);
  ctx2.strokeStyle = "white";
  ctx2.strokeWidth = 2;
  ctx2.fillStyle = "rgba(50, 50, 200, 0.3)";
  ctx2.beginPath();
  ctx2.rect(0, 0, width, height);
  ctx2.stroke();
  ctx2.fill();
  return {
    x: -Math.sin(rads) * height,
    y: Math.cos(rads) * height
  };
}

function forGen(_x, _x2, _x3) {
  return _forGen.apply(this, arguments);
}

function _forGen() {
  _forGen = _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(init, end, inc) {
    var i;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = init;

          case 1:
            if (!(i < end)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return i;

          case 4:
            i += inc;
            _context.next = 1;
            break;

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _forGen.apply(this, arguments);
}

var sleep = function sleep(t) {
  return new Promise(function (r) {
    return setTimeout(r, t);
  });
};

function draw() {
  return _draw.apply(this, arguments);
}

function _draw() {
  _draw = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, i, x, y, point, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _i2, _iteratorAbruptCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, r, _x4, _y, _point, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _i3, _iteratorAbruptCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _r, _x5, _y2, _point2, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _i4, _iteratorAbruptCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _r2, _x6, _y3, _point3;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ctx1.strokeStyle = "#CCCCCC";
            ctx1.beginPath();
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context2.prev = 4;
            _iterator = _asyncIterator(forGen(-20, 20, 1));

          case 6:
            _context2.next = 8;
            return _iterator.next();

          case 8:
            if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
              _context2.next = 20;
              break;
            }

            i = _step.value;
            x = (i < 0 ? -Math.pow(1.5, -i) : Math.pow(1.5, i)) / 15;
            y = -unitSize;
            point = drawRectangle({
              x: x * unitSize,
              y: y
            });
            ctx1.lineTo(point.x, point.y);
            ctx1.stroke();
            _context2.next = 17;
            return sleep(50);

          case 17:
            _iteratorAbruptCompletion = false;
            _context2.next = 6;
            break;

          case 20:
            _context2.next = 26;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](4);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 26:
            _context2.prev = 26;
            _context2.prev = 27;

            if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
              _context2.next = 31;
              break;
            }

            _context2.next = 31;
            return _iterator.return();

          case 31:
            _context2.prev = 31;

            if (!_didIteratorError) {
              _context2.next = 34;
              break;
            }

            throw _iteratorError;

          case 34:
            return _context2.finish(31);

          case 35:
            return _context2.finish(26);

          case 36:
            _iteratorAbruptCompletion2 = false;
            _didIteratorError2 = false;
            _context2.prev = 38;
            _iterator2 = _asyncIterator([0, -1, 1, -2, 2, -3, 3, -4, 4, -5]);

          case 40:
            _context2.next = 42;
            return _iterator2.next();

          case 42:
            if (!(_iteratorAbruptCompletion2 = !(_step2 = _context2.sent).done)) {
              _context2.next = 85;
              break;
            }

            _i2 = _step2.value;
            ctx1.beginPath();
            ctx1.arc((_i2 + 1 / 2) * unitSize, -3 / 2 * unitSize, unitSize / 2, 0, Math.PI * 2);
            ctx1.stroke();
            ctx1.beginPath();
            _iteratorAbruptCompletion5 = false;
            _didIteratorError5 = false;
            _context2.prev = 50;
            _iterator5 = _asyncIterator(forGen(0, Math.PI * 2, 0.1));

          case 52:
            _context2.next = 54;
            return _iterator5.next();

          case 54:
            if (!(_iteratorAbruptCompletion5 = !(_step5 = _context2.sent).done)) {
              _context2.next = 66;
              break;
            }

            r = _step5.value;
            _x4 = Math.sin(r) * unitSize / 2 + (_i2 + 1 / 2) * unitSize;
            _y = Math.cos(r) * unitSize / 2 + -3 / 2 * unitSize;
            _point = drawRectangle({
              x: _x4,
              y: _y
            });
            ctx1.lineTo(_point.x, _point.y);
            ctx1.stroke();
            _context2.next = 63;
            return sleep(10);

          case 63:
            _iteratorAbruptCompletion5 = false;
            _context2.next = 52;
            break;

          case 66:
            _context2.next = 72;
            break;

          case 68:
            _context2.prev = 68;
            _context2.t1 = _context2["catch"](50);
            _didIteratorError5 = true;
            _iteratorError5 = _context2.t1;

          case 72:
            _context2.prev = 72;
            _context2.prev = 73;

            if (!(_iteratorAbruptCompletion5 && _iterator5.return != null)) {
              _context2.next = 77;
              break;
            }

            _context2.next = 77;
            return _iterator5.return();

          case 77:
            _context2.prev = 77;

            if (!_didIteratorError5) {
              _context2.next = 80;
              break;
            }

            throw _iteratorError5;

          case 80:
            return _context2.finish(77);

          case 81:
            return _context2.finish(72);

          case 82:
            _iteratorAbruptCompletion2 = false;
            _context2.next = 40;
            break;

          case 85:
            _context2.next = 91;
            break;

          case 87:
            _context2.prev = 87;
            _context2.t2 = _context2["catch"](38);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t2;

          case 91:
            _context2.prev = 91;
            _context2.prev = 92;

            if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
              _context2.next = 96;
              break;
            }

            _context2.next = 96;
            return _iterator2.return();

          case 96:
            _context2.prev = 96;

            if (!_didIteratorError2) {
              _context2.next = 99;
              break;
            }

            throw _iteratorError2;

          case 99:
            return _context2.finish(96);

          case 100:
            return _context2.finish(91);

          case 101:
            _iteratorAbruptCompletion3 = false;
            _didIteratorError3 = false;
            _context2.prev = 103;
            _iterator3 = _asyncIterator([0, -1, 1, -2, 2, -3, 3, -4]);

          case 105:
            _context2.next = 107;
            return _iterator3.next();

          case 107:
            if (!(_iteratorAbruptCompletion3 = !(_step3 = _context2.sent).done)) {
              _context2.next = 150;
              break;
            }

            _i3 = _step3.value;
            ctx1.beginPath();
            ctx1.arc((_i3 + 1 / 2) * unitSize, -5 / 2 * unitSize, unitSize / 2, 0, Math.PI * 2);
            ctx1.stroke();
            ctx1.beginPath();
            _iteratorAbruptCompletion6 = false;
            _didIteratorError6 = false;
            _context2.prev = 115;
            _iterator6 = _asyncIterator(forGen(0, Math.PI * 2, 0.1));

          case 117:
            _context2.next = 119;
            return _iterator6.next();

          case 119:
            if (!(_iteratorAbruptCompletion6 = !(_step6 = _context2.sent).done)) {
              _context2.next = 131;
              break;
            }

            _r = _step6.value;
            _x5 = Math.sin(_r) * unitSize / 2 + (_i3 + 1 / 2) * unitSize;
            _y2 = Math.cos(_r) * unitSize / 2 + -5 / 2 * unitSize;
            _point2 = drawRectangle({
              x: _x5,
              y: _y2
            });
            ctx1.lineTo(_point2.x, _point2.y);
            ctx1.stroke();
            _context2.next = 128;
            return sleep(10);

          case 128:
            _iteratorAbruptCompletion6 = false;
            _context2.next = 117;
            break;

          case 131:
            _context2.next = 137;
            break;

          case 133:
            _context2.prev = 133;
            _context2.t3 = _context2["catch"](115);
            _didIteratorError6 = true;
            _iteratorError6 = _context2.t3;

          case 137:
            _context2.prev = 137;
            _context2.prev = 138;

            if (!(_iteratorAbruptCompletion6 && _iterator6.return != null)) {
              _context2.next = 142;
              break;
            }

            _context2.next = 142;
            return _iterator6.return();

          case 142:
            _context2.prev = 142;

            if (!_didIteratorError6) {
              _context2.next = 145;
              break;
            }

            throw _iteratorError6;

          case 145:
            return _context2.finish(142);

          case 146:
            return _context2.finish(137);

          case 147:
            _iteratorAbruptCompletion3 = false;
            _context2.next = 105;
            break;

          case 150:
            _context2.next = 156;
            break;

          case 152:
            _context2.prev = 152;
            _context2.t4 = _context2["catch"](103);
            _didIteratorError3 = true;
            _iteratorError3 = _context2.t4;

          case 156:
            _context2.prev = 156;
            _context2.prev = 157;

            if (!(_iteratorAbruptCompletion3 && _iterator3.return != null)) {
              _context2.next = 161;
              break;
            }

            _context2.next = 161;
            return _iterator3.return();

          case 161:
            _context2.prev = 161;

            if (!_didIteratorError3) {
              _context2.next = 164;
              break;
            }

            throw _iteratorError3;

          case 164:
            return _context2.finish(161);

          case 165:
            return _context2.finish(156);

          case 166:
            _iteratorAbruptCompletion4 = false;
            _didIteratorError4 = false;
            _context2.prev = 168;
            _iterator4 = _asyncIterator([0, -1, 1, -2, 2, -3, 3, -4]);

          case 170:
            _context2.next = 172;
            return _iterator4.next();

          case 172:
            if (!(_iteratorAbruptCompletion4 = !(_step4 = _context2.sent).done)) {
              _context2.next = 215;
              break;
            }

            _i4 = _step4.value;
            ctx1.beginPath();
            ctx1.arc((_i4 + 1 / 2) * unitSize, -7 / 2 * unitSize, unitSize / 2, 0, Math.PI * 2);
            ctx1.stroke();
            ctx1.beginPath();
            _iteratorAbruptCompletion7 = false;
            _didIteratorError7 = false;
            _context2.prev = 180;
            _iterator7 = _asyncIterator(forGen(0, Math.PI * 2, 0.1));

          case 182:
            _context2.next = 184;
            return _iterator7.next();

          case 184:
            if (!(_iteratorAbruptCompletion7 = !(_step7 = _context2.sent).done)) {
              _context2.next = 196;
              break;
            }

            _r2 = _step7.value;
            _x6 = Math.sin(_r2) * unitSize / 2 + (_i4 + 1 / 2) * unitSize;
            _y3 = Math.cos(_r2) * unitSize / 2 + -7 / 2 * unitSize;
            _point3 = drawRectangle({
              x: _x6,
              y: _y3
            });
            ctx1.lineTo(_point3.x, _point3.y);
            ctx1.stroke();
            _context2.next = 193;
            return sleep(10);

          case 193:
            _iteratorAbruptCompletion7 = false;
            _context2.next = 182;
            break;

          case 196:
            _context2.next = 202;
            break;

          case 198:
            _context2.prev = 198;
            _context2.t5 = _context2["catch"](180);
            _didIteratorError7 = true;
            _iteratorError7 = _context2.t5;

          case 202:
            _context2.prev = 202;
            _context2.prev = 203;

            if (!(_iteratorAbruptCompletion7 && _iterator7.return != null)) {
              _context2.next = 207;
              break;
            }

            _context2.next = 207;
            return _iterator7.return();

          case 207:
            _context2.prev = 207;

            if (!_didIteratorError7) {
              _context2.next = 210;
              break;
            }

            throw _iteratorError7;

          case 210:
            return _context2.finish(207);

          case 211:
            return _context2.finish(202);

          case 212:
            _iteratorAbruptCompletion4 = false;
            _context2.next = 170;
            break;

          case 215:
            _context2.next = 221;
            break;

          case 217:
            _context2.prev = 217;
            _context2.t6 = _context2["catch"](168);
            _didIteratorError4 = true;
            _iteratorError4 = _context2.t6;

          case 221:
            _context2.prev = 221;
            _context2.prev = 222;

            if (!(_iteratorAbruptCompletion4 && _iterator4.return != null)) {
              _context2.next = 226;
              break;
            }

            _context2.next = 226;
            return _iterator4.return();

          case 226:
            _context2.prev = 226;

            if (!_didIteratorError4) {
              _context2.next = 229;
              break;
            }

            throw _iteratorError4;

          case 229:
            return _context2.finish(226);

          case 230:
            return _context2.finish(221);

          case 231:
            addEventListener("mousemove", function (event) {
              drawRectangle({
                x: event.x + bounds.left,
                y: event.y + bounds.top
              });
            });

          case 232:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 22, 26, 36], [27,, 31, 35], [38, 87, 91, 101], [50, 68, 72, 82], [73,, 77, 81], [92,, 96, 100], [103, 152, 156, 166], [115, 133, 137, 147], [138,, 142, 146], [157,, 161, 165], [168, 217, 221, 231], [180, 198, 202, 212], [203,, 207, 211], [222,, 226, 230]]);
  }));
  return _draw.apply(this, arguments);
}

draw();
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58245" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map