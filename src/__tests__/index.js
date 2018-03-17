const { Readable } = require('readable-stream')
const StreamAccumulator = require('..')

class NumbersStream extends Readable {
  constructor (options = {}) {
    super(options)
    this.max = options.max || 2
    this.delay = options.dalay || 50
    this.current = 0
    this.raiseError = options.raiseError || false
  }

  _read () {
    if (this.raiseError) {
      return this.emit('error', new Error('something bad happened'))
    }

    if (this.current > this.max) {
      return this.push(null)
    }

    setTimeout(() => {
      this.push(String(this.current++))
    }, this.delay)
  }
}

describe('🥒  stream-accumulator test suite', () => {
  test('It should be initializable with new StreamAccumulator()', (endTest) => {
    expect(new StreamAccumulator()).toBeInstanceOf(StreamAccumulator)
    endTest()
  })

  test('It should be initializable with StreamAccumulator.new()', (endTest) => {
    expect(StreamAccumulator.new()).toBeInstanceOf(StreamAccumulator)
    endTest()
  })

  test('It should accumulate all the data using a stream interface', (endTest) => {
    const source = new NumbersStream()
    const dest = source.pipe(new StreamAccumulator())

    dest.on('data', (data) => {
      expect(data.toString()).toEqual('012')
      endTest()
    })
  })

  test('It should accumulate all the data using a promise interface', (endTest) => {
    const source = new NumbersStream()
    StreamAccumulator.promise(source)
      .then((data) => {
        expect(data.toString()).toEqual('012')
        endTest()
      })
  })

  test('It should fail if the source stream triggers an error using the promise interface', (endTest) => {
    const source = new NumbersStream({raiseError: true})
    StreamAccumulator.promise(source)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual('something bad happened')
        endTest()
      })
  })
})
