import profiler from 'v8-profiler';
import mkdir from 'mkdirp';
import Promise from 'bluebird';
import fs from 'fs';
Promise.promisifyAll(fs);

const profilings = {};

function wrap(fn, name) {
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
    return Promise.resolve(fn.apply(this, args)).finally((value) => {
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
  };
}

function profiling(argsFn, name) {
  if(argsFn !== void 0) {
    return wrap(argsFn, name);
  }
  return (target, key, desc) => ({
    ...desc,
    value: wrap(desc.value, name),
  });
}

export default profiling;
