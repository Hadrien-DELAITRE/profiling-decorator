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
    if (resultFn !== void 0 && resultFn.then) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,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TyxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7eUNBQUksSUFBSTtBQUFKLFlBQUk7OzthQUFNLE1BQU0sQ0FBQyxLQUFLLFFBQU8sSUFBSSxDQUFDO0tBQUMsQ0FBQztHQUNqRztBQUNELFNBQU8sVUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7d0JBQ3BCLElBQUk7QUFDUCxXQUFLLEVBQUUsQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSzs7R0FDeEUsQ0FBQztDQUNKOztBQUVELFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDOUIsTUFBRyxNQUFNLEtBQUssS0FBSyxDQUFDLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQ3BELFdBQU8sWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztHQUNuQztBQUNELFNBQU8sVUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7d0JBQ3BCLElBQUk7QUFDUCxXQUFLLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDOztHQUN2QyxDQUFDO0NBQ0o7O3FCQUVjLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgX19CUk9XU0VSX18gPSAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpO1xyXG5jb25zdCBwcm9maWxlciA9ICFfX0JST1dTRVJfXyA/IHJlcXVpcmUoJ0ByaXNpbmdzdGFjay92OC1wcm9maWxlcicpIDogbnVsbDtcclxuaW1wb3J0IHY4bmF0aXZlcyBmcm9tICd2OC1uYXRpdmVzJztcclxuaW1wb3J0IG1rZGlyIGZyb20gJ21rZGlycCc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpO1xyXG5cclxuY29uc3QgbmF0aXZlcyA9ICFfX0JST1dTRVJfXyA/IHY4bmF0aXZlcyA6IHY4bmF0aXZlcy52ODtcclxuY29uc3QgcHJvZmlsaW5ncyA9IHt9O1xyXG5jb25zdCBOQl9NQVhfT1BUSU1JWklOR19DQUxMID0gMjtcclxuXHJcbmZ1bmN0aW9uIHByaW50U3RhdHVzKGZuLCBjbGFzc05hbWUsIGZ1bmN0aW9uTmFtZSkge1xyXG4gIGNvbnNvbGUubG9nKCdjbGFzczonLCBjbGFzc05hbWUsICdmdW5jdGlvbjonLCBmdW5jdGlvbk5hbWUpO1xyXG4gIG5hdGl2ZXMuaGVscGVycy5wcmludFN0YXR1cyhmbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyYXBOb2RlUHJvZmlsaW5nKGZuLCBuYW1lKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWQoLi4uYXJncykge1xyXG4gICAgY29uc3QgY2xhc3NOYW1lID0gYCR7dGhpcyA/IHRoaXMuY29uc3RydWN0b3IubmFtZSA6ICdDbGFzc05vdEZvdW5kJ31gO1xyXG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gYCR7bmFtZSB8fCBmbi5uYW1lIHx8ICdhbm9ueW1vdXMnfWA7XHJcbiAgICBjb25zdCBwcm9maWxlclBhdGggPSBgJHtjbGFzc05hbWV9LyR7ZnVuY3Rpb25OYW1lfWA7XHJcbiAgICBpZihwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF0gPT09IHZvaWQgMCkge1xyXG4gICAgICBwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF0gPSAwO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcHJvZmlsZXJGaWxlID0gYCR7Y2xhc3NOYW1lfS0ke2Z1bmN0aW9uTmFtZX0tJHtwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF19YDtcclxuICAgIGNvbnN0IHByb2ZpbGVyRm9sZGVyID0gYC4vcHJvZmlsaW5nLyR7Y2xhc3NOYW1lfS8ke2Z1bmN0aW9uTmFtZX1gO1xyXG4gICAgcHJvZmlsZXIuc3RhcnRQcm9maWxpbmcocHJvZmlsZXJGaWxlLCB0cnVlKTtcclxuICAgIHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSA9IHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSArIDE7XHJcbiAgICBjb25zdCByZXN1bHRGbiA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgaWYocmVzdWx0Rm4gIT09IHZvaWQgMCAmJiByZXN1bHRGbi50aGVuKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0Rm4pLmZpbmFsbHkoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcHJvZmlsZXJTdHJlYW0gPSBwcm9maWxlci5zdG9wUHJvZmlsaW5nKCk7XHJcbiAgICAgICAgcHJvZmlsZXJTdHJlYW0uZXhwb3J0KChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBta2RpcihgJHtwcm9maWxlckZvbGRlcn1gLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZUFzeW5jKGAke3Byb2ZpbGVyRm9sZGVyfS8ke3Byb2ZpbGVyRmlsZX0uY3B1cHJvZmlsZWAsIHJlc3VsdCkudGhlbigoKSA9PlxyXG4gICAgICAgICAgICAgIHByb2ZpbGVyU3RyZWFtLmRlbGV0ZSgpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcHJvZmlsZXJTdHJlYW0gPSBwcm9maWxlci5zdG9wUHJvZmlsaW5nKCk7XHJcbiAgICBwcm9maWxlclN0cmVhbS5leHBvcnQoKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbWtkaXIoYCR7cHJvZmlsZXJGb2xkZXJ9YCwgKCkgPT4ge1xyXG4gICAgICAgIGZzLndyaXRlRmlsZUFzeW5jKGAke3Byb2ZpbGVyRm9sZGVyfS8ke3Byb2ZpbGVyRmlsZX0uY3B1cHJvZmlsZWAsIHJlc3VsdCkudGhlbigoKSA9PlxyXG4gICAgICAgICAgcHJvZmlsZXJTdHJlYW0uZGVsZXRlKClcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdEZuO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyYXBPcHRpbWl6ZShmbiwgbmFtZSkge1xyXG4gIGxldCBjcHRFeGVjdXRlZEZ1bmN0aW9uID0gMDtcclxuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZCguLi5hcmdzKSB7XHJcbiAgICBjb25zdCBjbGFzc05hbWUgPSBgJHt0aGlzID8gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lIDogJ0NsYXNzTm90Rm91bmQnfWA7XHJcbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBgJHtuYW1lIHx8IGZuLm5hbWUgfHwgJ2Fub255bW91cyd9YDtcclxuICAgIGlmKGNwdEV4ZWN1dGVkRnVuY3Rpb24gPj0gTkJfTUFYX09QVElNSVpJTkdfQ0FMTCkge1xyXG4gICAgICBuYXRpdmVzLm9wdGltaXplRnVuY3Rpb25Pbk5leHRDYWxsKGZuKTtcclxuICAgICAgY29uc3QgcmVzdWx0Rm4gPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgcHJpbnRTdGF0dXMoZm4sIGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdEZuO1xyXG4gICAgfVxyXG4gICAgY3B0RXhlY3V0ZWRGdW5jdGlvbiA9IGNwdEV4ZWN1dGVkRnVuY3Rpb24gKyAxO1xyXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGluZyhhcmdzRm4sIG5hbWUpIHtcclxuICBpZihhcmdzRm4gIT09IHZvaWQgMCAmJiB0eXBlb2YgYXJnc0ZuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gIV9fQlJPV1NFUl9fID8gd3JhcE5vZGVQcm9maWxpbmcoYXJnc0ZuLCBuYW1lKSA6ICguLi5hcmdzKSA9PiAoYXJnc0ZuLmFwcGx5KHRoaXMsIGFyZ3MpKTtcclxuICB9XHJcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgZGVzYykgPT4gKHtcclxuICAgIC4uLmRlc2MsXHJcbiAgICB2YWx1ZTogIV9fQlJPV1NFUl9fID8gd3JhcE5vZGVQcm9maWxpbmcoZGVzYy52YWx1ZSwgYXJnc0ZuKSA6IGRlc2MudmFsdWUsXHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9wdGltaXplKGFyZ3NGbiwgbmFtZSkge1xyXG4gIGlmKGFyZ3NGbiAhPT0gdm9pZCAwICYmIHR5cGVvZiBhcmdzRm4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiB3cmFwT3B0aW1pemUoYXJnc0ZuLCBuYW1lKTtcclxuICB9XHJcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgZGVzYykgPT4gKHtcclxuICAgIC4uLmRlc2MsXHJcbiAgICB2YWx1ZTogd3JhcE9wdGltaXplKGRlc2MudmFsdWUsIGFyZ3NGbiksXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgcHJvZmlsaW5nLCBvcHRpbWl6ZSB9O1xyXG4iXX0=
