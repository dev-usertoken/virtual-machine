"use strict";

var _mocha = require("mocha");

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _memdown = require("memdown");

var _memdown2 = _interopRequireDefault(_memdown);

var _levelup = require("levelup");

var _levelup2 = _interopRequireDefault(_levelup);

var _encodingDown = require("encoding-down");

var _encodingDown2 = _interopRequireDefault(_encodingDown);

var _gun = require("gun/gun");

var _gun2 = _interopRequireDefault(_gun);

require("./index");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var gun = void 0,
  level = void 0,
  key = void 0;

/**
 * Refresh the level instance, effectively clearing out
 * any data stored in memory
 *
 * @returns {undefined}
 */
/* eslint-disable require-jsdoc, id-length */
var makeLevel = function makeLevel() {
  level = (0, _levelup2.default)(
    (0, _encodingDown2.default)((0, _memdown2.default)("test"), {
      valueEncoding: "json"
    })
  );
};

/**
 * Make a new instance of Gun but do not refresh the level instance
 *
 * This means that any part of the Graph stored in Gun is wiped
 * out but that it is still in level (as long as makeLevel isn't also called)
 *
 * @returns {Gun} A gun instance
 */
var makeGun = function makeGun() {
  gun = (0, _gun2.default)({ level: level });
  return gun;
};

/**
 * Integration tests between Level, Gun, and Gun-Level adapter
 */
(0, _mocha.describe)("Gun using level", function() {
  this.timeout(2000);

  (0, _mocha.beforeEach)(function() {
    key = Math.random()
      .toString(36)
      .slice(2);

    // Refresh level and Gun's state
    makeLevel();
    makeGun();
  });

  (0, _mocha.it)("should report not found data", function(done) {
    gun.get("no such key").val(function(notFound) {
      (0, _expect2.default)(notFound).toBe(undefined);
      done();
    });
  });

  (0, _mocha.it)("should successfully write data", function(done) {
    gun.get(key).put({ success: true }, function(ctx) {
      (0, _expect2.default)(ctx.err).toBeFalsy();
      done();
    });
  });

  (0, _mocha.it)("should be able to read existing data", function(done) {
    gun.get(key).put({ success: true });
    makeGun()
      .get(key)
      .val(function(data) {
        (0, _expect2.default)(data).toContain({ success: true });
        done();
      });
  });

  (0, _mocha.it)("should merge with existing data", function(done) {
    var g = makeGun();

    // write initial data
    g.get(key).put({ data: true }, function(res1) {
      if (res1.err) {
        throw res1.err;
      }

      // add to it
      g.get(key).put({ success: true }, function(res2) {
        if (res2.err) {
          throw res2.err;
        }

        // verify data merge
        makeGun()
          .get(key)
          .val(function(value) {
            (0, _expect2.default)(value).toContain({
              success: true,
              data: true
            });
            done();
          });
      });
    });
  });

  (0, _mocha.it)("should resolve circular references", function(done) {
    var bob = gun.get("bob").put({ name: "Bob" });
    var dave = gun.get("dave").put({ name: "Dave" });

    bob.get("friend").put(dave);
    dave.get("friend").put(bob);

    bob
      .get("friend")
      .get("friend")
      .val(function(value) {
        (0, _expect2.default)(value.name).toBe("Bob");
        done();
      });
  });

  (0, _mocha.it)("should handle sets", function(done) {
    var g = makeGun();
    var profiles = g.get("profiles");
    var bob = g.get("bob").put({ name: "Bob" });
    var dave = g.get("dave").put({ name: "Dave" });

    profiles.set(bob).set(dave);

    var count = 0;
    makeGun()
      .get("profiles")
      .map()
      .on(function(profile) {
        // Check nodes for proper form
        if (profile.name === "Bob") {
          (0, _expect2.default)(profile).toContain({ name: "Bob" });
        } else if (profile.name === "Dave") {
          (0, _expect2.default)(profile).toContain({ name: "Dave" });
        }

        // ensure all profiles are found before completing
        count += 1;
        if (count === 2) {
          done();
        }
      });
  });
});
