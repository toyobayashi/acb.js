# acb.js

[![Build status](https://travis-ci.com/toyobayashi/acb.js.svg?branch=master)](https://travis-ci.com/toyobayashi/acb.js/)

For all your ACB extracting needs. Based on [acb.py](https://github.com/summertriangle-dev/acb.py).

## Usage

### CLI

``` bash
npm install acb -g
acb somefile.acb [-o [outputdir]] [-l] [-t] [-c] [-n] [-w] [-s]
```

### Programing

``` js
const Acb = require('acb')
let acb = new Acb('path/to/somefile.acb')

// Async
acb.extract() // => Promise
acb.extract('path/to/out') // => Promise
acb.extract(() => console.log('Extract done.')) // => void
acb.extract('path/to/out', () => console.log('Extract done.')) // => void

// Sync
acb.extractSync() // => void
acb.extractSync('path/to/out') // => void
```
