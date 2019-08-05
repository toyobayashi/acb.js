const Acb = require('..')
const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')

describe('Acb', function () {
  it('#extractSync', function () {
    const acb = new Acb(path.join(__dirname, '100071.acb'))
    acb.extractSync()
    assert.ok(fs.existsSync(path.join(__dirname, '_acb_100071.acb')))
    const names = fs.readdirSync(path.join(__dirname, '_acb_100071.acb'))
    for (let i = 0; i < names.length; i++) {
      const file = path.join(__dirname, '_acb_100071.acb', names[i])
      const fd = fs.openSync(file, 'r')
      const buf = Buffer.alloc(4)
      fs.readSync(fd, buf, 0, 4, 0)
      fs.closeSync(fd)
      assert.ok(buf.readUInt32BE() === 0xc8c3c100)
    }
  })
})
