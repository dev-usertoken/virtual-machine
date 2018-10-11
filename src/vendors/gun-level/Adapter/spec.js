"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _ = require("./");

var _2 = _interopRequireDefault(_);

var _levelup = require("levelup");

var _levelup2 = _interopRequireDefault(_levelup);

var _memdown = require("memdown");

var _memdown2 = _interopRequireDefault(_memdown);

var _encodingDown = require("encoding-down");

var _encodingDown2 = _interopRequireDefault(_encodingDown);

var _gun = require("gun/gun");

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* eslint-env mocha */
/* eslint-disable require-jsdoc, id-length */
var node = function node(obj) {
  return _gun2.default.node.ify(obj, _gun2.default.state.map());
};

describe("An adapter", function() {
  this.timeout(100);

  var adapter = void 0,
    lex = void 0,
    gun = void 0,
    ctx = void 0;
  var level = (0, _levelup2.default)(
    (0, _encodingDown2.default)((0, _memdown2.default)("test"), {
      valueEncoding: "json"
    })
  );
  var context = new _gun2.default({ level: level });

  beforeEach(function() {
    adapter = new _2.default(level, context);
    var key = _gun2.default.text.random();
    lex = { "#": key };
    gun = context;
  });

  describe("read", function() {
    beforeEach(function() {
      ctx = {
        "#": _gun2.default.text.random(),
        get: lex,
        gun: gun
      };
    });

    var read = (0, _expect.spyOn)(level, "get");
    afterEach(function() {
      return read.reset();
    });
    after(function() {
      return read.restore();
    });

    it("should call `level.get`", function() {
      adapter.read(ctx);

      (0, _expect2.default)(read).toHaveBeenCalled();
    });

    it("should use the `#` property as the key", function() {
      adapter.read(ctx);

      var uid = read.calls[0].arguments[0];
      (0, _expect2.default)(uid).toBe(lex["#"]);
    });

    it("should always use json encoding", function() {
      adapter.read(ctx);

      var _read$calls$0$argumen = (0, _slicedToArray3.default)(
          read.calls[0].arguments,
          2
        ),
        options = _read$calls$0$argumen[1];

      (0, _expect2.default)(options.valueEncoding).toBe("json");
    });

    it("should respond when it finds data", function(done) {
      var value = node({ value: true });

      adapter.ctx.on("put", function(result) {
        (0, _expect2.default)(result["@"]).toBe(ctx["#"]);
        (0, _expect2.default)(result.put).toEqual(
          _gun2.default.graph.node(value)
        );
        done();
      });

      // Setup a Level response.
      read.andCall(function(key, opt, cb) {
        return cb(null, value);
      });

      // Initialize read request
      adapter.read(ctx);
    });

    it("should not error out on NotFound results", function() {
      // Spy on the after read method
      var afterRead = (0, _expect.spyOn)(adapter, "afterRead");

      // Fake a not-found response.
      read.andCall(function(key, opt, cb) {
        var err = new Error("Key not found");
        cb(err);
      });

      // Initialize fake read request
      adapter.read(ctx);

      // Assertions
      (0, _expect2.default)(afterRead).toHaveBeenCalled();

      var _afterRead$calls$0$ar = (0, _slicedToArray3.default)(
          afterRead.calls[0].arguments,
          2
        ),
        requestConect = _afterRead$calls$0$ar[0],
        error = _afterRead$calls$0$ar[1];

      (0, _expect2.default)(requestConect).toContain({
        "#": ctx["#"]
      });
      (0, _expect2.default)(error).toBe(null);

      // Reset state
      afterRead.reset();
      afterRead.restore();
    });

    it("should pass the error on unrecognized errors", function() {
      // Spy on the after read method
      var afterRead = (0, _expect.spyOn)(adapter, "afterRead");

      // Setup test
      var error = new Error("Part of the test");
      read.andCall(function(key, options, cb) {
        return cb(error);
      });

      // Run test
      adapter.read(ctx);

      // Assertions
      (0, _expect2.default)(afterRead).toHaveBeenCalled();

      var _afterRead$calls$0$ar2 = (0, _slicedToArray3.default)(
          afterRead.calls[0].arguments,
          2
        ),
        returnedErr = _afterRead$calls$0$ar2[1];

      (0, _expect2.default)(returnedErr).toBe(error);

      // Reset state
      afterRead.reset();
      afterRead.restore();
    });
  });

  describe("write", function() {
    var graph = void 0,
      write = void 0;

    before(function() {
      graph = {
        potato: _gun2.default.node.ify({
          hello: "world"
        })
      };
      write = (0, _expect.spyOn)(level, "batch").andCallThrough();
      ctx.put = graph;
    });

    afterEach(function() {
      return write.reset();
    });

    after(function() {
      return write.restore();
    });

    it("should create a level batch write", function() {
      adapter.write(ctx);

      (0, _expect2.default)(write).toHaveBeenCalled();
    });
  });
});
