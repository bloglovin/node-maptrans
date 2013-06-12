Map / Transform
---------------

Map values in a source object, optionally transform it using your own function,
put it in a new object.

## Installation

`$ npm install maptrans`

## Usage

The first thing you do is to create a new `MapTrans` object with a "map". The
map is an array of objects that describe how you want to transform the old
object into a new one.

    var maptrans = require('maptrans');
    var map = maptrans([
      {
        source: '$.json.path.string',
        target: {
          op: 'add',
          path: '/foo'
        }
      },
      {
        source: '$.json.path.string',
        target: {
          op: 'add',
          path: '/bar'
        },
        transform: function (value, map, source) {
          return value.toUpperCase();
        }
      }
    ]);

    var mapped = map.map(yousuperobject);
    var another = map.map(anothersuperobject);

## API

The `maptrans()` function takes an array of mapping definitions. The mapping
definitions **must** contain `source` and `target`. `source` is a
[JSON Path](http://goessner.net/articles/JsonPath/) string. `target` is a
[JSON Patch](http://tools.ietf.org/html/draft-ietf-appsawg-json-patch-05)
object.

The value of `source` will be added to your `target` and is then applied to the
result object.

**Note** that `target` can also be an array of patch objects if you need to
do fancy stuff.

### Transforms

A `transform` property may also be added to your mapping definition. The
property must contain a function. An example transform function might look
like this:

    function (value, map, source, result) {
      return value.toUpperCase();
    }

The `this` context for the transformation function is set to the mapping
definition the function is attached to. It's arguments will be:

* The current value being mapped.
* The original map.
* The source, the entire object being mapped.
* The result object as it looks "so far".

## License

MIT

