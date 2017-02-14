const __BROWSER__ = (typeof window === 'object');
const profiler = !__BROWSER__ ? require('@risingstack/v8-profiler') : null;
import v8natives from 'v8-natives';
import mkdir from 'mkdirp';
import Promise from 'bluebird';
import fs from 'fs';
Promise.promisifyAll(fs);

const natives = !__BROWSER__ ? v8natives : v8natives.v8;
const profilings = {};
const NB_MAX_OPTIMIZING_CALL = 2;

function printStatus(fn, className, functionName) {
  console.log('class:', className, 'function:', functionName);
  natives.helpers.printStatus(fn);
}

function wrapNodeProfiling(fn, name) {
  return function wrapped(...args) {
    const className = `${this ? this.constructor.name : 'ClassNotFound'}`;
    const functionName = `${name || fn.name || 'anonymous'}`;
    const profilerPath = `${className}/${functionName}`;
    if(profilings[profilerPath] === void 0) {
      profilings[profilerPath] = 0;
    }
    const profilerFile = `${className}-${functionName}-${profilings[profilerPath]}`;
    const profilerFolder = `./profiling/${className}/${functionName}`;
    profiler.startProfiling(profilerFile, true);
    profilings[profilerPath] = profilings[profilerPath] + 1;
    const resultFn = fn.apply(this, args);
    if(resultFn !== void 0 && resultFn.then) {
      return Promise.resolve(resultFn).finally((value) => {
        const profilerStream = profiler.stopProfiling();
        profilerStream.export((error, result) => {
          mkdir(`${profilerFolder}`, () => {
            fs.writeFileAsync(`${profilerFolder}/${profilerFile}.cpuprofile`, result).then(() =>
              profilerStream.delete()
            );
          });
        });
        return value;
      });
    }
    const profilerStream = profiler.stopProfiling();
    profilerStream.export((error, result) => {
      mkdir(`${profilerFolder}`, () => {
        fs.writeFileAsync(`${profilerFolder}/${profilerFile}.cpuprofile`, result).then(() =>
          profilerStream.delete()
        );
      });
    });
    return resultFn;
  };
}

function wrapOptimize(fn, name) {
  let cptExecutedFunction = 0;
  return function wrapped(...args) {
    const className = `${this ? this.constructor.name : 'ClassNotFound'}`;
    const functionName = `${name || fn.name || 'anonymous'}`;
    if(cptExecutedFunction >= NB_MAX_OPTIMIZING_CALL) {
      natives.optimizeFunctionOnNextCall(fn);
      const resultFn = fn.apply(this, args);
      printStatus(fn, className, functionName);
      return resultFn;
    }
    cptExecutedFunction = cptExecutedFunction + 1;
    return fn.apply(this, args);
  };
}

function profiling(argsFn, name) {
  if(argsFn !== void 0 && typeof argsFn === 'function') {
    return !__BROWSER__ ? wrapNodeProfiling(argsFn, name) : (...args) => (argsFn.apply(this, args));
  }
  return (target, key, desc) => ({
    ...desc,
    value: !__BROWSER__ ? wrapNodeProfiling(desc.value, argsFn) : desc.value,
  });
}

function optimize(argsFn, name) {
  if(argsFn !== void 0 && typeof argsFn === 'function') {
    return wrapOptimize(argsFn, name);
  }
  return (target, key, desc) => ({
    ...desc,
    value: wrapOptimize(desc.value, argsFn),
  });
}

export default { profiling, optimize };
