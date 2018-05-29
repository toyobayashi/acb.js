# acb.js

For all your ACB extracting needs. Based on [acb.py](https://github.com/summertriangle-dev/acb.py).

## Usage

### CLI

``` bash
npm install acb -g
acb somefile.acb [outputdir]
```

### Programing

``` js
const extractACB = require('acb')
extractACB('path/to/somefile.acb', outputdir /* = 'path/to/_acb_somefile.acb' */)
```
