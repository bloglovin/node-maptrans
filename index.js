var path  = require('JSONPath');
var patch = require('jsonpatch');

var MapTrans = function (map) {
  this._map = map || [];
};

MapTrans.prototype.map = function (source) {
  var self = this;
  var result = {};
  this._map.forEach(function (itm) {
    var p = Array.isArray(itm.target) ? itm.target : [itm.target];
    p.forEach(function (i) {
      self._handlePatch(i, itm, source);
    });

    try {
      result = patch.apply_patch(result, p);
    }
    catch (err) {
      console.log(err);
    }
  });

  return result;
};

MapTrans.prototype._handlePatch = function (p, item, source) {
  if (!p.value) {
    p.value = path.eval(source, item.source)[0];
  }

  if (typeof item.transform === 'function') {
    p.value = item.transform.apply(item, [p.value, this._map, source]);
  }
};

module.exports = function (map) {
  return new MapTrans(map);
};

