profiling-decorator
===================

## Installation
Use the following command in order to install this module

```javascript
npm install profiling-decorator
```

This use [v8-profiler](https://www.npmjs.com/package/v8-natives) and [v8-natives](https://www.npmjs.com/package/v8-profiler) as dependencies.

### Webpack support
If you want use this module with the [webpack](https://webpack.github.io/) module bundler, you have to set the following configuration in `webpackConfig.js` file :

```javascript
plugins: [
  new webpack.IgnorePlugin(new RegExp('^(v8-profiler)$')),
],
resolve: {
  alias: {
    'v8-natives': 'v8-natives/lib/v8-browser-all',
  },
},
```

## Usage

There are several decorators available :

* `@profiling`
This feature only works server-side. It allows to decorate a function in order to generate a CPU profiling file that starts before calling function and then stops at the end of execution. The generated file will be saved in a specific folder: `profiling`.
Finally you can inspect the generated file with the amazing [DevTools](https://developer.chrome.com/devtools#javascript-performance) from google.

##### Example
```javascript
import { profiling } from 'profiling-decorator';

// Decorate your function
@profiling()
foo() {
  console.log('bar');
}

// Then run your function
foo();
```
A file will be generated :

![.cpuprofile](https://i.gyazo.com/62d8734dbe9112771d368f94fe5d6e0f.png "Profiling File")

You can also decorate regular function :

```javascript
// Decorate your regular function
const foo = profiling(() => {
  console.log('bar');
});

// Then run your function
foo();
```

You will see a file generated with default name :

![.cpuprofile](https://i.gyazo.com/1b9a480e8eab3af6538a86f35c6db6b9.png "Profiling File")

If you want set a specific name, just use :

```javascript
// Decorate your regular function
const foo = profiling(() => {
  console.log('bar');
}, 'SpecificName');

// Or ...
@profiling('SpecificName')
foo() {
  console.log('bar');
}
// Then run your function
foo();
```
You will see your specific named file :

![.cpuprofile](https://i.gyazo.com/b18e7ba8c1109cd38b27baa393e23a59.png "Profiling File")


* `@optimize`
This feature works server-side and client-side. It allows to decorate a function in order to show if this function is optimized or not using the v8 functions. I advise you to watch this [article](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers). When you will decorate a function, you have to run at least 3 times this function before you can see whether the function is optimized or not.

##### Example
You can use it like `@profiling` :

```javascript
import { optimize } from 'profiling-decorator';

// Decorate your regular function
const foo = optimize(() => {
  console.log('bar');
}, 'SpecificName');

// Or ...
@optimize('SpecificName')
foo() {
  console.log('bar');
}
// Then run several times (at least 3) your function
foo();
foo();
foo();
```
You have to run your node application or your browser with the following opts command in order to active natives v8 functions :

```javascript
// Node
node --allow-natives-syntax [path-to-app]

// Chrome (be sure to shutdown all chrome process before doing this)
chrome  --js-flags=--allow-natives-syntax
```

This will be output a log like :

![.optimize](https://i.gyazo.com/4a698d340cd9c3eff7f9e6e6fef3f5e9.png "Optimize log")

If you want more information about the optimization process, you can run the following command (only server-side) :
```javascript
node --trace_opt --trace_deopt --allow-natives-syntax [path-to-app] | grep --context=5 [regexp-function-name]
```

This will output more logs from `--trace-opt` & `--trace-deopt` options that will tell you why your function were not optimized.

```javascript
// Not optimized function (try/catch)
const foo = optimize(() => {
  try {
    console.log('bar');
  }
  catch(e) {
    console.log(e);
  }
}, 'SpecificName');
```

You can see the reason about the not optimized function :

![.optimize](https://i.gyazo.com/d06ffdbfd5994b20722844eec724f35e.png "Optimize log")
