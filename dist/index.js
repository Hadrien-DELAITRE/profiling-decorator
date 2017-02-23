'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _v8Natives = require('v8-natives');

var _v8Natives2 = _interopRequireDefault(_v8Natives);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var __BROWSER__ = typeof window === 'object';
var profiler = !__BROWSER__ ? require('@risingstack/v8-profiler') : null;

_bluebird2['default'].promisifyAll(_fs2['default']);

var natives = !__BROWSER__ ? _v8Natives2['default'] : _v8Natives2['default'].v8;
var profilings = {};
var NB_MAX_OPTIMIZING_CALL = 2;

function printStatus(fn, className, functionName) {
  console.log('class:', className, 'function:', functionName);
  natives.helpers.printStatus(fn);
}

function wrapNodeProfiling(fn, name) {
  return function wrapped() {
    var className = '' + (this ? this.constructor.name : 'ClassNotFound');
    var functionName = '' + (name || fn.name || 'anonymous');
    var profilerPath = className + '/' + functionName;
    if (profilings[profilerPath] === void 0) {
      profilings[profilerPath] = 0;
    }
    var profilerFile = className + '-' + functionName + '-' + profilings[profilerPath];
    var profilerFolder = './profiling/' + className + '/' + functionName;
    profiler.startProfiling(profilerFile, true);
    profilings[profilerPath] = profilings[profilerPath] + 1;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var resultFn = fn.apply(this, args);
    if (resultFn !== void 0 && resultFn !== null && resultFn.then) {
      return _bluebird2['default'].resolve(resultFn)['finally'](function (value) {
        var profilerStream = profiler.stopProfiling();
        profilerStream['export'](function (error, result) {
          (0, _mkdirp2['default'])('' + profilerFolder, function () {
            _fs2['default'].writeFileAsync(profilerFolder + '/' + profilerFile + '.cpuprofile', result).then(function () {
              return profilerStream['delete']();
            });
          });
        });
        return value;
      });
    }
    var profilerStream = profiler.stopProfiling();
    profilerStream['export'](function (error, result) {
      (0, _mkdirp2['default'])('' + profilerFolder, function () {
        _fs2['default'].writeFileAsync(profilerFolder + '/' + profilerFile + '.cpuprofile', result).then(function () {
          return profilerStream['delete']();
        });
      });
    });
    return resultFn;
  };
}

function wrapOptimize(fn, name) {
  var cptExecutedFunction = 0;
  return function wrapped() {
    var className = '' + (this ? this.constructor.name : 'ClassNotFound');
    var functionName = '' + (name || fn.name || 'anonymous');

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (cptExecutedFunction >= NB_MAX_OPTIMIZING_CALL) {
      natives.optimizeFunctionOnNextCall(fn);
      var resultFn = fn.apply(this, args);
      printStatus(fn, className, functionName);
      return resultFn;
    }
    cptExecutedFunction = cptExecutedFunction + 1;
    return fn.apply(this, args);
  };
}

function profiling(argsFn, name) {
  var _this = this;

  if (argsFn !== void 0 && typeof argsFn === 'function') {
    return !__BROWSER__ ? wrapNodeProfiling(argsFn, name) : function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return argsFn.apply(_this, args);
    };
  }
  return function (target, key, desc) {
    return _extends({}, desc, {
      value: !__BROWSER__ ? wrapNodeProfiling(desc.value, argsFn) : desc.value
    });
  };
}

function optimize(argsFn, name) {
  if (argsFn !== void 0 && typeof argsFn === 'function') {
    return wrapOptimize(argsFn, name);
  }
  return function (target, key, desc) {
    return _extends({}, desc, {
      value: wrapOptimize(desc.value, argsFn)
    });
  };
}

exports['default'] = { profiling: profiling, optimize: optimize };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,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LFVBQVUsRUFBRTtBQUNwRCxXQUFPLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRzt5Q0FBSSxJQUFJO0FBQUosWUFBSTs7O2FBQU0sTUFBTSxDQUFDLEtBQUssUUFBTyxJQUFJLENBQUM7S0FBQyxDQUFDO0dBQ2pHO0FBQ0QsU0FBTyxVQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSTt3QkFDcEIsSUFBSTtBQUNQLFdBQUssRUFBRSxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLOztHQUN4RSxDQUFDO0NBQ0o7O0FBRUQsU0FBUyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUM5QixNQUFHLE1BQU0sS0FBSyxLQUFLLENBQUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDcEQsV0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ25DO0FBQ0QsU0FBTyxVQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSTt3QkFDcEIsSUFBSTtBQUNQLFdBQUssRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7O0dBQ3ZDLENBQUM7Q0FDSjs7cUJBRWMsRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBfX0JST1dTRVJfXyA9ICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jyk7XHJcbmNvbnN0IHByb2ZpbGVyID0gIV9fQlJPV1NFUl9fID8gcmVxdWlyZSgnQHJpc2luZ3N0YWNrL3Y4LXByb2ZpbGVyJykgOiBudWxsO1xyXG5pbXBvcnQgdjhuYXRpdmVzIGZyb20gJ3Y4LW5hdGl2ZXMnO1xyXG5pbXBvcnQgbWtkaXIgZnJvbSAnbWtkaXJwJztcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5Qcm9taXNlLnByb21pc2lmeUFsbChmcyk7XHJcblxyXG5jb25zdCBuYXRpdmVzID0gIV9fQlJPV1NFUl9fID8gdjhuYXRpdmVzIDogdjhuYXRpdmVzLnY4O1xyXG5jb25zdCBwcm9maWxpbmdzID0ge307XHJcbmNvbnN0IE5CX01BWF9PUFRJTUlaSU5HX0NBTEwgPSAyO1xyXG5cclxuZnVuY3Rpb24gcHJpbnRTdGF0dXMoZm4sIGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKSB7XHJcbiAgY29uc29sZS5sb2coJ2NsYXNzOicsIGNsYXNzTmFtZSwgJ2Z1bmN0aW9uOicsIGZ1bmN0aW9uTmFtZSk7XHJcbiAgbmF0aXZlcy5oZWxwZXJzLnByaW50U3RhdHVzKGZuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JhcE5vZGVQcm9maWxpbmcoZm4sIG5hbWUpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZCguLi5hcmdzKSB7XHJcbiAgICBjb25zdCBjbGFzc05hbWUgPSBgJHt0aGlzID8gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lIDogJ0NsYXNzTm90Rm91bmQnfWA7XHJcbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBgJHtuYW1lIHx8IGZuLm5hbWUgfHwgJ2Fub255bW91cyd9YDtcclxuICAgIGNvbnN0IHByb2ZpbGVyUGF0aCA9IGAke2NsYXNzTmFtZX0vJHtmdW5jdGlvbk5hbWV9YDtcclxuICAgIGlmKHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSA9IDA7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcm9maWxlckZpbGUgPSBgJHtjbGFzc05hbWV9LSR7ZnVuY3Rpb25OYW1lfS0ke3Byb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXX1gO1xyXG4gICAgY29uc3QgcHJvZmlsZXJGb2xkZXIgPSBgLi9wcm9maWxpbmcvJHtjbGFzc05hbWV9LyR7ZnVuY3Rpb25OYW1lfWA7XHJcbiAgICBwcm9maWxlci5zdGFydFByb2ZpbGluZyhwcm9maWxlckZpbGUsIHRydWUpO1xyXG4gICAgcHJvZmlsaW5nc1twcm9maWxlclBhdGhdID0gcHJvZmlsaW5nc1twcm9maWxlclBhdGhdICsgMTtcclxuICAgIGNvbnN0IHJlc3VsdEZuID0gZm4uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICBpZihyZXN1bHRGbiAhPT0gdm9pZCAwICYmIHJlc3VsdEZuICE9PSBudWxsICYmIHJlc3VsdEZuLnRoZW4pIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHRGbikuZmluYWxseSgodmFsdWUpID0+IHtcclxuICAgICAgICBjb25zdCBwcm9maWxlclN0cmVhbSA9IHByb2ZpbGVyLnN0b3BQcm9maWxpbmcoKTtcclxuICAgICAgICBwcm9maWxlclN0cmVhbS5leHBvcnQoKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIG1rZGlyKGAke3Byb2ZpbGVyRm9sZGVyfWAsICgpID0+IHtcclxuICAgICAgICAgICAgZnMud3JpdGVGaWxlQXN5bmMoYCR7cHJvZmlsZXJGb2xkZXJ9LyR7cHJvZmlsZXJGaWxlfS5jcHVwcm9maWxlYCwgcmVzdWx0KS50aGVuKCgpID0+XHJcbiAgICAgICAgICAgICAgcHJvZmlsZXJTdHJlYW0uZGVsZXRlKClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcm9maWxlclN0cmVhbSA9IHByb2ZpbGVyLnN0b3BQcm9maWxpbmcoKTtcclxuICAgIHByb2ZpbGVyU3RyZWFtLmV4cG9ydCgoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBta2RpcihgJHtwcm9maWxlckZvbGRlcn1gLCAoKSA9PiB7XHJcbiAgICAgICAgZnMud3JpdGVGaWxlQXN5bmMoYCR7cHJvZmlsZXJGb2xkZXJ9LyR7cHJvZmlsZXJGaWxlfS5jcHVwcm9maWxlYCwgcmVzdWx0KS50aGVuKCgpID0+XHJcbiAgICAgICAgICBwcm9maWxlclN0cmVhbS5kZWxldGUoKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0Rm47XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JhcE9wdGltaXplKGZuLCBuYW1lKSB7XHJcbiAgbGV0IGNwdEV4ZWN1dGVkRnVuY3Rpb24gPSAwO1xyXG4gIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkKC4uLmFyZ3MpIHtcclxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGAke3RoaXMgPyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgOiAnQ2xhc3NOb3RGb3VuZCd9YDtcclxuICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGAke25hbWUgfHwgZm4ubmFtZSB8fCAnYW5vbnltb3VzJ31gO1xyXG4gICAgaWYoY3B0RXhlY3V0ZWRGdW5jdGlvbiA+PSBOQl9NQVhfT1BUSU1JWklOR19DQUxMKSB7XHJcbiAgICAgIG5hdGl2ZXMub3B0aW1pemVGdW5jdGlvbk9uTmV4dENhbGwoZm4pO1xyXG4gICAgICBjb25zdCByZXN1bHRGbiA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICBwcmludFN0YXR1cyhmbiwgY2xhc3NOYW1lLCBmdW5jdGlvbk5hbWUpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0Rm47XHJcbiAgICB9XHJcbiAgICBjcHRFeGVjdXRlZEZ1bmN0aW9uID0gY3B0RXhlY3V0ZWRGdW5jdGlvbiArIDE7XHJcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvZmlsaW5nKGFyZ3NGbiwgbmFtZSkge1xyXG4gIGlmKGFyZ3NGbiAhPT0gdm9pZCAwICYmIHR5cGVvZiBhcmdzRm4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiAhX19CUk9XU0VSX18gPyB3cmFwTm9kZVByb2ZpbGluZyhhcmdzRm4sIG5hbWUpIDogKC4uLmFyZ3MpID0+IChhcmdzRm4uYXBwbHkodGhpcywgYXJncykpO1xyXG4gIH1cclxuICByZXR1cm4gKHRhcmdldCwga2V5LCBkZXNjKSA9PiAoe1xyXG4gICAgLi4uZGVzYyxcclxuICAgIHZhbHVlOiAhX19CUk9XU0VSX18gPyB3cmFwTm9kZVByb2ZpbGluZyhkZXNjLnZhbHVlLCBhcmdzRm4pIDogZGVzYy52YWx1ZSxcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gb3B0aW1pemUoYXJnc0ZuLCBuYW1lKSB7XHJcbiAgaWYoYXJnc0ZuICE9PSB2b2lkIDAgJiYgdHlwZW9mIGFyZ3NGbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIHdyYXBPcHRpbWl6ZShhcmdzRm4sIG5hbWUpO1xyXG4gIH1cclxuICByZXR1cm4gKHRhcmdldCwga2V5LCBkZXNjKSA9PiAoe1xyXG4gICAgLi4uZGVzYyxcclxuICAgIHZhbHVlOiB3cmFwT3B0aW1pemUoZGVzYy52YWx1ZSwgYXJnc0ZuKSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgeyBwcm9maWxpbmcsIG9wdGltaXplIH07XHJcbiJdfQ==
