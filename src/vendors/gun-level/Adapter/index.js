"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _gun = require("gun/gun");

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var writing = (0, _symbol2.default)(
  "In-process writes"
); /* eslint-disable id-length*/

var notFound = /(NotFound|not found|not find)/i;
var options = {
  valueEncoding: "json"
};

// Gun merge algorithm, authored by Mark Nadal.
var union = function union(vertex, node, opt) {
  if (!node || !node._) {
    return;
  }
  vertex = vertex || _gun2.default.state.to(node);
  if (!vertex || !vertex._) {
    return;
  }
  opt = _gun2.default.num.is(opt)
    ? { machine: opt }
    : { machine: _gun2.default.state() };
  opt.union = _gun2.default.obj.copy(vertex);
  if (
    !_gun2.default.node.is(node, function(val, key) {
      var HAM = _gun2.default.HAM(
        opt.machine,
        _gun2.default.state.is(node, key),
        _gun2.default.state.is(vertex, key, true),
        val,
        vertex[key]
      );
      if (!HAM.incoming) {
        return;
      }
      _gun2.default.state.to(node, key, opt.union);
    })
  ) {
    return;
  }

  return opt.union; // eslint-disable-line
};

/**
 * Read/write hooks for Gun.
 *
 * @private
 * @param {LevelUP} level - A LevelUP interface.
 * @class
 */

var Adapter = (function() {
  (0, _createClass3.default)(Adapter, null, [
    {
      key: "from",
      value: function from(level, context) {
        return new Adapter(level, context);
      }
    }
  ]);

  function Adapter(level, ctx) {
    (0, _classCallCheck3.default)(this, Adapter);

    // Save a reference to level and the gun instance
    this.level = level;
    this.ctx = ctx;

    // Preserve the `this` context for read/write calls.
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);

    // In-process writes.
    level[writing] = level[writing] || {};
  }

  /**
   * Read a key from LevelDB.
   *
   * @param  {Object} context - A gun request context.
   * @returns {undefined}
   */

  (0, _createClass3.default)(Adapter, [
    {
      key: "read",
      value: function read(context) {
        var _this = this;

        var get = context.get;
        var level = this.level;
        var key = get["#"];

        var value = level[writing][key];
        if (value) {
          return this.afterRead(context, null, value);
        }

        // Read from level.
        return level.get(key, options, function(err, result) {
          // Error handling.
          if (err) {
            if (notFound.test(err.message)) {
              // Tell gun nothing was found.
              _this.afterRead(context, null);
              return;
            }

            _this.afterRead(context, err);
            return;
          }

          // Pass gun the result.
          _this.afterRead(context, null, result);
        });
      }

      /**
       * Return data to Gun
       *
       * @param  {Object} context - A gun request context.
       * @param  {Error|null} err - An Error object, if any
       * @param  {Object|null|undefined} data - The node retrieved, if found
       * @returns {undefined}
       */
    },
    {
      key: "afterRead",
      value: function afterRead(context, err, data) {
        this.ctx.on("in", {
          "@": context["#"],
          put: _gun2.default.graph.node(data),
          err: err
        });
      }

      /**
       * Write a every node in a graph to level.
       *
       * @param  {Object} context - A gun write context.
       * @returns {undefined}
       */
    },
    {
      key: "write",
      value: function write(context) {
        var self = this;
        var level = this.level;
        var graph = context.put;

        // Create a new batch write.

        var batch = level.batch();

        var keys = (0, _keys2.default)(graph);
        var merged = 0;

        /**
         * Report errors and clear out the in-process write cache.
         *
         * @param  {Error} [err] - An error given by level.
         * @returns {undefined}
         */
        function writeHandler() {
          var err =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : null;

          // Remove the in-process writes.
          keys.forEach(function(key) {
            delete level[writing][key];
          });

          // Report whether it succeeded.
          self.ctx.on("in", {
            "@": context["#"],
            ok: !err,
            err: err
          });
        }

        /**
         * Determine whether a write should happen and invoke it,
         * passing the handler.
         *
         * @param  {Number} counted - The number of keys merged.
         * @returns {undefined}
         */
        function writeWhenReady(counted) {
          // Wait until we've checked all the nodes before
          // submitting the batch.
          if (counted < keys.length) {
            return;
          }

          // Write all the nodes to level.
          batch.write(writeHandler);
        }

        // Each node in the graph...
        keys.forEach(function(uid) {
          var node = graph[uid];
          var value = level[writing][uid];

          // Check to see if it's in the process of writing.
          if (value) {
            node = union(node, value);
            merged += 1;
            batch.put(uid, node, options);

            writeWhenReady(merged);
            return;
          }

          level[writing][uid] = node;

          // Check to see if it exists.
          level.get(uid, options, function(error, result) {
            // If we already have data...
            if (!error) {
              // Merge with the write.
              node = union(node, result);
            }

            // Add the node to our write batch.
            batch.put(uid, node, options);

            writeWhenReady((merged += 1));
          });
        });
      }
    }
  ]);
  return Adapter;
})();

exports.default = Adapter;
