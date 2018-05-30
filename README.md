# acb.js

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
acb.extract(/* outputdir */)
```
