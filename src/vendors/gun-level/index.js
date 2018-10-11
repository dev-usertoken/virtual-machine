"use strict";

var _Adapter = require("./Adapter");

var _Adapter2 = _interopRequireDefault(_Adapter);

var _gun = require("gun/gun");

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

_gun2.default.on("opt", function(context) {
  // Pass to subsequent opt handlers
  this.to.next(context);

  var level = context.opt.level;

  // Filter out instances without the level option.

  if (!(level instanceof Object)) {
    return;
  }

  var adapter = _Adapter2.default.from(level, context);

  // Allows other plugins to respond concurrently.
  var pluginInterop = function pluginInterop(middleware) {
    return function(ctx) {
      this.to.next(ctx);

      return middleware(ctx);
    };
  };

  // Register the driver.
  context.on("get", pluginInterop(adapter.read));
  context.on("put", pluginInterop(adapter.write));
});

module.exports = _gun2.default;
