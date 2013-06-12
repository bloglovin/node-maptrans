//
// # Map Transform
//
// Object mapping and transformation using JSONPath and JSONPatch.
//
var path  = require('JSONPath');
var patch = require('jsonpatch');

//
// ## Constructor
//
// * **map**, the mapping definition.
//
var MapTrans = function (map) {
  this._map = map || [];
};

//
// ## Perform mapping
//
// Runs the map against the source and returns a new object.
//
// * **source**, object to apply mapping to.
//
// **Returns** mapped object.
//
MapTrans.prototype.map = function (source) {
  var self = this;
  var result = {};
  this._map.forEach(function (itm) {
    var p = Array.isArray(itm.target) ? itm.target : [itm.target];
    var n = [];
    p.forEach(function (i) {
      n.push(self._handlePatch(i, itm, source, self._map, result));
    });

    try {
      result = patch.apply_patch(result, n);
    }
    catch (err) {
      console.log(err);
    }
  });

  return result;
};

//
// ## Handle Patch
//
// Helper function for handling a patch and applying any transformation
// function to it's value.
//
// The `this` context within any transformation function will be the
// map entry the function is attached to. It's arguments will be:
//
// * the value
// * the map
// * the source object
// * the current result
//
// This function modifies an object in place, no return value.
//
MapTrans.prototype._handlePatch = function (o, item, source, map, result) {
  var p = this._clone(o);
  if (!p.value) {
    p.value = path.eval(source, item.source)[0];
  }

  if (typeof item.transform === 'function') {
    p.value = item.transform.apply(item, [p.value, map, source, result]);
  }

  return p;
};

//
// ## Clone Object
//
// Tiny helper to clone a patch object.
//
// * **patch**
//
// **Returns** new patch.
//
MapTrans.prototype._clone = function (o) {
  var n = {};
  Object.keys(o).forEach(function (key) {
    n[key] = o[key];
  });
  return n;
};

//
// ## Exported API
//
// Returns a new MapTrans object based on the given map.
//
// * **map**, the mapping definition.
//
module.exports = function (map) {
  return new MapTrans(map);
};

