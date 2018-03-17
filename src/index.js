const { Transform } = require('readable-stream')

class StreamAccumulator extends Transform {
  constructor (options = {}) {
    super(options)
    this.buffers = []
  }

  _transform (chunk, encoding, done) {
    this.buffers.push(chunk)
    done()
  }

  _flush (done) {
    this.push(Buffer.concat(this.buffers))
    done()
  }
}

StreamAccumulator.new = (options) => new StreamAccumulator(options)
StreamAccumulator.promise = (stream) => new Promise((resolve, reject) => {
  let buffers = []
  stream
    .on('data', (d) => buffers.push(d))
    .on('error', reject)
    .on('end', () => resolve(Buffer.concat(buffers)))
})

module.exports = StreamAccumulator
