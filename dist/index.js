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
var profiler = !__BROWSER__ ? require('v8-profiler') : null;

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
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHO3lDQUFJLElBQUk7QUFBSixZQUFJOzs7YUFBTSxNQUFNLENBQUMsS0FBSyxRQUFPLElBQUksQ0FBQztLQUFDLENBQUM7R0FDakc7QUFDRCxTQUFPLFVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJO3dCQUNwQixJQUFJO0FBQ1AsV0FBSyxFQUFFLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUs7O0dBQ3hFLENBQUM7Q0FDSjs7QUFFRCxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQzlCLE1BQUcsTUFBTSxLQUFLLEtBQUssQ0FBQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUNwRCxXQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDbkM7QUFDRCxTQUFPLFVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJO3dCQUNwQixJQUFJO0FBQ1AsV0FBSyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQzs7R0FDdkMsQ0FBQztDQUNKOztxQkFFYyxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF9fQlJPV1NFUl9fID0gKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKTtcclxuY29uc3QgcHJvZmlsZXIgPSAhX19CUk9XU0VSX18gPyByZXF1aXJlKCd2OC1wcm9maWxlcicpIDogbnVsbDtcclxuaW1wb3J0IHY4bmF0aXZlcyBmcm9tICd2OC1uYXRpdmVzJztcclxuaW1wb3J0IG1rZGlyIGZyb20gJ21rZGlycCc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpO1xyXG5cclxuY29uc3QgbmF0aXZlcyA9ICFfX0JST1dTRVJfXyA/IHY4bmF0aXZlcyA6IHY4bmF0aXZlcy52ODtcclxuY29uc3QgcHJvZmlsaW5ncyA9IHt9O1xyXG5jb25zdCBOQl9NQVhfT1BUSU1JWklOR19DQUxMID0gMjtcclxuXHJcbmZ1bmN0aW9uIHByaW50U3RhdHVzKGZuLCBjbGFzc05hbWUsIGZ1bmN0aW9uTmFtZSkge1xyXG4gIGNvbnNvbGUubG9nKCdjbGFzczonLCBjbGFzc05hbWUsICdmdW5jdGlvbjonLCBmdW5jdGlvbk5hbWUpO1xyXG4gIG5hdGl2ZXMuaGVscGVycy5wcmludFN0YXR1cyhmbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyYXBOb2RlUHJvZmlsaW5nKGZuLCBuYW1lKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWQoLi4uYXJncykge1xyXG4gICAgY29uc3QgY2xhc3NOYW1lID0gYCR7dGhpcyA/IHRoaXMuY29uc3RydWN0b3IubmFtZSA6ICdDbGFzc05vdEZvdW5kJ31gO1xyXG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gYCR7bmFtZSB8fCBmbi5uYW1lIHx8ICdhbm9ueW1vdXMnfWA7XHJcbiAgICBjb25zdCBwcm9maWxlclBhdGggPSBgJHtjbGFzc05hbWV9LyR7ZnVuY3Rpb25OYW1lfWA7XHJcbiAgICBpZihwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF0gPT09IHZvaWQgMCkge1xyXG4gICAgICBwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF0gPSAwO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcHJvZmlsZXJGaWxlID0gYCR7Y2xhc3NOYW1lfS0ke2Z1bmN0aW9uTmFtZX0tJHtwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF19YDtcclxuICAgIGNvbnN0IHByb2ZpbGVyRm9sZGVyID0gYC4vcHJvZmlsaW5nLyR7Y2xhc3NOYW1lfS8ke2Z1bmN0aW9uTmFtZX1gO1xyXG4gICAgcHJvZmlsZXIuc3RhcnRQcm9maWxpbmcocHJvZmlsZXJGaWxlLCB0cnVlKTtcclxuICAgIHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSA9IHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSArIDE7XHJcbiAgICBjb25zdCByZXN1bHRGbiA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgaWYocmVzdWx0Rm4gIT09IHZvaWQgMCAmJiByZXN1bHRGbi50aGVuKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0Rm4pLmZpbmFsbHkoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcHJvZmlsZXJTdHJlYW0gPSBwcm9maWxlci5zdG9wUHJvZmlsaW5nKCk7XHJcbiAgICAgICAgcHJvZmlsZXJTdHJlYW0uZXhwb3J0KChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBta2RpcihgJHtwcm9maWxlckZvbGRlcn1gLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZUFzeW5jKGAke3Byb2ZpbGVyRm9sZGVyfS8ke3Byb2ZpbGVyRmlsZX0uY3B1cHJvZmlsZWAsIHJlc3VsdCkudGhlbigoKSA9PlxyXG4gICAgICAgICAgICAgIHByb2ZpbGVyU3RyZWFtLmRlbGV0ZSgpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcHJvZmlsZXJTdHJlYW0gPSBwcm9maWxlci5zdG9wUHJvZmlsaW5nKCk7XHJcbiAgICBwcm9maWxlclN0cmVhbS5leHBvcnQoKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbWtkaXIoYCR7cHJvZmlsZXJGb2xkZXJ9YCwgKCkgPT4ge1xyXG4gICAgICAgIGZzLndyaXRlRmlsZUFzeW5jKGAke3Byb2ZpbGVyRm9sZGVyfS8ke3Byb2ZpbGVyRmlsZX0uY3B1cHJvZmlsZWAsIHJlc3VsdCkudGhlbigoKSA9PlxyXG4gICAgICAgICAgcHJvZmlsZXJTdHJlYW0uZGVsZXRlKClcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdEZuO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyYXBPcHRpbWl6ZShmbiwgbmFtZSkge1xyXG4gIGxldCBjcHRFeGVjdXRlZEZ1bmN0aW9uID0gMDtcclxuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZCguLi5hcmdzKSB7XHJcbiAgICBjb25zdCBjbGFzc05hbWUgPSBgJHt0aGlzID8gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lIDogJ0NsYXNzTm90Rm91bmQnfWA7XHJcbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBgJHtuYW1lIHx8IGZuLm5hbWUgfHwgJ2Fub255bW91cyd9YDtcclxuICAgIGlmKGNwdEV4ZWN1dGVkRnVuY3Rpb24gPj0gTkJfTUFYX09QVElNSVpJTkdfQ0FMTCkge1xyXG4gICAgICBuYXRpdmVzLm9wdGltaXplRnVuY3Rpb25Pbk5leHRDYWxsKGZuKTtcclxuICAgICAgY29uc3QgcmVzdWx0Rm4gPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgcHJpbnRTdGF0dXMoZm4sIGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdEZuO1xyXG4gICAgfVxyXG4gICAgY3B0RXhlY3V0ZWRGdW5jdGlvbiA9IGNwdEV4ZWN1dGVkRnVuY3Rpb24gKyAxO1xyXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGluZyhhcmdzRm4sIG5hbWUpIHtcclxuICBpZihhcmdzRm4gIT09IHZvaWQgMCAmJiB0eXBlb2YgYXJnc0ZuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gIV9fQlJPV1NFUl9fID8gd3JhcE5vZGVQcm9maWxpbmcoYXJnc0ZuLCBuYW1lKSA6ICguLi5hcmdzKSA9PiAoYXJnc0ZuLmFwcGx5KHRoaXMsIGFyZ3MpKTtcclxuICB9XHJcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgZGVzYykgPT4gKHtcclxuICAgIC4uLmRlc2MsXHJcbiAgICB2YWx1ZTogIV9fQlJPV1NFUl9fID8gd3JhcE5vZGVQcm9maWxpbmcoZGVzYy52YWx1ZSwgYXJnc0ZuKSA6IGRlc2MudmFsdWUsXHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9wdGltaXplKGFyZ3NGbiwgbmFtZSkge1xyXG4gIGlmKGFyZ3NGbiAhPT0gdm9pZCAwICYmIHR5cGVvZiBhcmdzRm4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiB3cmFwT3B0aW1pemUoYXJnc0ZuLCBuYW1lKTtcclxuICB9XHJcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgZGVzYykgPT4gKHtcclxuICAgIC4uLmRlc2MsXHJcbiAgICB2YWx1ZTogd3JhcE9wdGltaXplKGRlc2MudmFsdWUsIGFyZ3NGbiksXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgcHJvZmlsaW5nLCBvcHRpbWl6ZSB9O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
