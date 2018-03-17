# 🥒 stream-accumulator

[![npm version](https://badge.fury.io/js/stream-accumulator.svg)](http://badge.fury.io/js/stream-accumulator)
[![CircleCI](https://circleci.com/gh/lmammino/stream-accumulator.svg?style=shield)](https://circleci.com/gh/lmammino/stream-accumulator)
[![codecov.io](https://codecov.io/gh/lmammino/stream-accumulator/coverage.svg?branch=master)](https://codecov.io/gh/lmammino/stream-accumulator)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Accumulate all the data flowing through a stream and emit it as a single chunk or as a promise.

⚠️ **Warning**: This module will buffer all the data from the source stream in memory, so watch out for infinite (or very large) streams. Using this library might not be ideal in such cases!


## 💽 Install & quick usage

**Requirements**: this library is written for Node.js >= 6.0

As usual, this happens through NPM:

```bash
npm install --save stream-accumulator
```

Then, in your code:

```javascript
const StreamAccumulator = require('stream-accumulator')

// sourceStream is some readable stream

// ... inside an async function
const streamContent = await StreamAccumulator.promise(sourceStream)

// do stuff with streamContent (which would be a buffer)
```


## 🤔 Rationale

Oftentimes you are receiving data through a stream, but you have to accumulate all the data (waiting the stream to end) before you can use it. For instance, when you have to apply a transformation that requires the full data to be loaded in memory for the transformation to be possible.

This library allows you to accumulate the data of a stream into a single Buffer and allows you to consume the resulting Buffer through a stream or a promise based interface.


## 😲 An example

Let's say you are receiving some JavaScript source code through a streaming interface and you want to minify the code using [UglifyJS](https://www.npmjs.com/package/uglify-js). This is how you generally solve the problem:

```javascript
const { createReadStream } = require('fs')
const { minify } = require('uglify-js')

let data = ''
createReadStream('source.js')
  .on('data', (d) => data += d.toString())
  .on('error', (e) => {
    console.error(e)
    process.exit(1)
  })
  .on('end', () => {
    const { code: minifiedCode } = minify(data)
    console.log('Minified code', minifiedCode)
  })
```

While this implementation is fine and it's not particularly complicated, it might not be the most composable one it's a bit verbose to read.

Using `StreamAccumulator` you can solve the same problem as follows:

```javascript
const { createReadStream } = require('fs')
const StreamAccumulator = require('stream-accumulator')

const source = createReadStream('source.js')
source
  .pipe(new StreamAccumulator())
  .on('end', (data) => {
    const { code: minifiedCode } = minify(data)
    console.log('Minified code', minifiedCode)
  })
```

And, if you use the promise based interface you can even use `async/await` and have a more streamlined and easy to read implementation:

```javascript
const { createReadStream } = require('fs')
const StreamAccumulator = require('stream-accumulator')

// ... inside an async function
const source = createReadStream('source.js')
const code = await StreamAccumulator.promise(source)
const { code: minifiedCode } = minify(data)
console.log('Minified code', minifiedCode)
```


## 🕹 Usage

This library offers 2 APIs, a stream based one (transform stream) and a promise based one.


### 🌊 Stream based API

The stream based API allows you to pipe a `Readable` stream into `StreamAccumulator`. `StreamAccumulator` will buffer the entire readable stream and will emit a single chunk when the source stream is ended.


#### Example:

```javascript
const StreamAccumulator = require('stream-accumulator')

// initialize someReadableStream

someReadableStream
  .pipe(new StreamAccumulator())
  .on('end', (data) => {
    // data is a buffer
  })
```


### 🤞Promise based API

The promise based API allows you to wait for the source stream to finish (or emit an error.


#### Example:

```javascript
const StreamAccumulator = require('stream-accumulator')

// initialize someSourceStream

// ... inside an async function
const data = await StreamAccumulator.promise(someSourceStream)
// data is a buffer
```


## 👯‍ Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/stream-accumulator/issues).


## 🤦‍ License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
