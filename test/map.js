var fixture = {
  foo: 'bar',
  abc: 'baz',
  list: ['foo', 'bar'],
  obj: {
    bar: 'baz',
    boo: 'boo'
  }
};

var assert   = require('assert');
var maptrans = require('../index');

suite('Map Transform', function () {
  test('Should correctly map to new object.', function () {
    var expected = {
      foo: 'bar',
      li1: 'foo',
      li2: 'bar',
      obj: { boo: 'boo' },
      bartender: undefined
    };

    var mapped = maptrans([
      {
        source: '$.foo',
        target: { op: 'add', path: '/foo' }
      },
      {
        source: '$.list[0]',
        target: { op: 'add', path: '/li1' }
      },
      {
        source: '$.list[1]',
        target: { op: 'add', path: '/li2' }
      },
      {
        source: '$.obj.boo',
        target: [
          { op: 'add', path: '/obj', value: {} },
          { op: 'add', path: '/obj/boo' },
        ]
      },
      {
        source: '$.bartender',
        target: { 'op': 'add', 'path': '/bartender' }
      }
    ]).map(fixture);

    assert.deepEqual(expected, mapped);
  });

  test('Should correctly apply transformation.', function () {
    var expected = {
      foo: 'RAB',
    };

    var mapped = maptrans([
      {
        source: '$.foo',
        target: { op: 'add', path: '/foo' },
        transform: function (value) {
          value = value.split('').reverse().join('').toUpperCase();
          return value;
        }
      }
    ]).map(fixture);

    assert.deepEqual(expected, mapped);
  });
});

