'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _v8Profiler = require('v8-profiler');

var _v8Profiler2 = _interopRequireDefault(_v8Profiler);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

_bluebird2['default'].promisifyAll(_fs2['default']);

var profilings = {};

function wrap(fn, name) {
  return function wrapped() {
    var className = '' + (this ? this.constructor.name : 'ClassNotFound');
    var functionName = '' + (name || fn.name || 'anonymous');
    var profilerPath = className + '/' + functionName;
    if (profilings[profilerPath] === void 0) {
      profilings[profilerPath] = 0;
    }
    var profilerFile = className + '-' + functionName + '-' + profilings[profilerPath];
    var profilerFolder = './profiling/' + className + '/' + functionName;
    _v8Profiler2['default'].startProfiling(profilerFile, true);
    profilings[profilerPath] = profilings[profilerPath] + 1;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _bluebird2['default'].resolve(fn.apply(this, args))['finally'](function (value) {
      var profilerStream = _v8Profiler2['default'].stopProfiling();
      profilerStream['export'](function (error, result) {
        (0, _mkdirp2['default'])('' + profilerFolder, function () {
          _fs2['default'].writeFileAsync(profilerFolder + '/' + profilerFile + '.cpuprofile', result).then(function () {
            return profilerStream['delete']();
          });
        });
      });
      return value;
    });
  };
}

function profiling(argsFn, name) {
  if (argsFn !== void 0) {
    return wrap(argsFn, name);
  }
  return function (target, key, desc) {
    return _extends({}, desc, {
      value: wrap(desc.value, name)
    });
  };
}

exports['default'] = profiling;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzBCQUFxQixhQUFhOzs7O3NCQUNoQixRQUFROzs7O3dCQUNOLFVBQVU7Ozs7a0JBQ2YsSUFBSTs7OztBQUNuQixzQkFBUSxZQUFZLGlCQUFJLENBQUM7O0FBRXpCLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUN0QixTQUFPLFNBQVMsT0FBTyxHQUFVO0FBQy9CLFFBQU0sU0FBUyxTQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxlQUFlLENBQUEsQUFBRSxDQUFDO0FBQ3RFLFFBQU0sWUFBWSxTQUFNLElBQUksSUFBSSxFQUFFLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQSxBQUFFLENBQUM7QUFDekQsUUFBTSxZQUFZLEdBQU0sU0FBUyxTQUFJLFlBQVksQUFBRSxDQUFDO0FBQ3BELFFBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ3RDLGdCQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzlCO0FBQ0QsUUFBTSxZQUFZLEdBQU0sU0FBUyxTQUFJLFlBQVksU0FBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEFBQUUsQ0FBQztBQUNoRixRQUFNLGNBQWMsb0JBQWtCLFNBQVMsU0FBSSxZQUFZLEFBQUUsQ0FBQztBQUNsRSw0QkFBUyxjQUFjLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVDLGNBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztzQ0FWL0IsSUFBSTtBQUFKLFVBQUk7OztBQVc3QixXQUFPLHNCQUFRLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxXQUFRLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDOUQsVUFBTSxjQUFjLEdBQUcsd0JBQVMsYUFBYSxFQUFFLENBQUM7QUFDaEQsb0JBQWMsVUFBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBSztBQUN2QyxzQ0FBUyxjQUFjLEVBQUksWUFBTTtBQUMvQiwwQkFBRyxjQUFjLENBQUksY0FBYyxTQUFJLFlBQVksa0JBQWUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO21CQUM3RSxjQUFjLFVBQU8sRUFBRTtXQUFBLENBQ3hCLENBQUM7U0FDSCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7QUFDSCxhQUFPLEtBQUssQ0FBQztLQUNkLENBQUMsQ0FBQztHQUNKLENBQUM7Q0FDSDs7QUFFRCxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQy9CLE1BQUcsTUFBTSxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ3BCLFdBQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztHQUMzQjtBQUNELFNBQU8sVUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7d0JBQ3BCLElBQUk7QUFDUCxXQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDOztHQUM3QixDQUFDO0NBQ0o7O3FCQUVjLFNBQVMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJvZmlsZXIgZnJvbSAndjgtcHJvZmlsZXInO1xyXG5pbXBvcnQgbWtkaXIgZnJvbSAnbWtkaXJwJztcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5Qcm9taXNlLnByb21pc2lmeUFsbChmcyk7XHJcblxyXG5jb25zdCBwcm9maWxpbmdzID0ge307XHJcblxyXG5mdW5jdGlvbiB3cmFwKGZuLCBuYW1lKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWQoLi4uYXJncykge1xyXG4gICAgY29uc3QgY2xhc3NOYW1lID0gYCR7dGhpcyA/IHRoaXMuY29uc3RydWN0b3IubmFtZSA6ICdDbGFzc05vdEZvdW5kJ31gO1xyXG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gYCR7bmFtZSB8fCBmbi5uYW1lIHx8ICdhbm9ueW1vdXMnfWA7XHJcbiAgICBjb25zdCBwcm9maWxlclBhdGggPSBgJHtjbGFzc05hbWV9LyR7ZnVuY3Rpb25OYW1lfWA7XHJcbiAgICBpZihwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF0gPT09IHZvaWQgMCkge1xyXG4gICAgICBwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF0gPSAwO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcHJvZmlsZXJGaWxlID0gYCR7Y2xhc3NOYW1lfS0ke2Z1bmN0aW9uTmFtZX0tJHtwcm9maWxpbmdzW3Byb2ZpbGVyUGF0aF19YDtcclxuICAgIGNvbnN0IHByb2ZpbGVyRm9sZGVyID0gYC4vcHJvZmlsaW5nLyR7Y2xhc3NOYW1lfS8ke2Z1bmN0aW9uTmFtZX1gO1xyXG4gICAgcHJvZmlsZXIuc3RhcnRQcm9maWxpbmcocHJvZmlsZXJGaWxlLCB0cnVlKTtcclxuICAgIHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSA9IHByb2ZpbGluZ3NbcHJvZmlsZXJQYXRoXSArIDE7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZuLmFwcGx5KHRoaXMsIGFyZ3MpKS5maW5hbGx5KCh2YWx1ZSkgPT4ge1xyXG4gICAgICBjb25zdCBwcm9maWxlclN0cmVhbSA9IHByb2ZpbGVyLnN0b3BQcm9maWxpbmcoKTtcclxuICAgICAgcHJvZmlsZXJTdHJlYW0uZXhwb3J0KChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgbWtkaXIoYCR7cHJvZmlsZXJGb2xkZXJ9YCwgKCkgPT4ge1xyXG4gICAgICAgICAgZnMud3JpdGVGaWxlQXN5bmMoYCR7cHJvZmlsZXJGb2xkZXJ9LyR7cHJvZmlsZXJGaWxlfS5jcHVwcm9maWxlYCwgcmVzdWx0KS50aGVuKCgpID0+XHJcbiAgICAgICAgICAgIHByb2ZpbGVyU3RyZWFtLmRlbGV0ZSgpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvZmlsaW5nKGFyZ3NGbiwgbmFtZSkge1xyXG4gIGlmKGFyZ3NGbiAhPT0gdm9pZCAwKSB7XHJcbiAgICByZXR1cm4gd3JhcChhcmdzRm4sIG5hbWUpO1xyXG4gIH1cclxuICByZXR1cm4gKHRhcmdldCwga2V5LCBkZXNjKSA9PiAoe1xyXG4gICAgLi4uZGVzYyxcclxuICAgIHZhbHVlOiB3cmFwKGRlc2MudmFsdWUsIG5hbWUpLFxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwcm9maWxpbmc7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
