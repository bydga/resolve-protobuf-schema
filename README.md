# resolve-protobuf-schema

Read a protobuf schema from the disk, parse it and resolve all imports

```
npm install resolve-protobuf-schema
```

## Usage

Store the following example protobuf schema in `test.proto`

```
message Test {
  optional string test = 1;
}
```

Then run

``` js
var resolve = require('resolve-protobuf-schema')
console.log(resolve('test.proto')) // prints the parsed schema
```

Schema imports will resolved as well

```
import "./test.proto"

message AnotherTest {
  optional string test = 1;
}
```

``` js
console.log(resolve('./another-test.proto')) // will print a combined parsed schema
```

## License

MIT