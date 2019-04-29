Error handling self loaded instance of error.






## Install

```
$ npm install error-instance-manager
```
To use create file and for example error.init.ts use on te top o app.ts

## Usage
Example app.ts
```ts
import './error.init'
```

Example error.init.ts;
```ts
import {startErrorHandling} from './ErrorHandling/error_handling'
const ST  = startErrorHandling({errorLevel:'stack'});
```


