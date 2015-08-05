var chant = chant || {};
chant.local = {};
chant.local.storageAccessor = function(name, _def, _rootNS){
  this.ns = _rootNS || 'chant';
  this.ns += '.' + name;
  var _old = window.localStorage.getItem(this.ns);
  if (_old === undefined || _old === null) {
    window.localStorage.setItem(this.ns, JSON.stringify(_def || {}));
  } else {
    try {
      var merged = JSON.parse(_old);
      for (var key in (_def || {})) {
        merged[key] = (merged[key] === undefined) ? _def[key] : merged[key];
      }
      window.localStorage.setItem(this.ns, JSON.stringify(merged));
    } catch (e) {
      console.error('chant.local.storageAccessor', name, e);
    }
  }
  this.get = function(key, def) {
    var values = JSON.parse(window.localStorage.getItem(this.ns)) || {};
    return (typeof values[key] !== 'undefined') ? values[key] : def;
  };
  this.getAll = function() {
    var values = JSON.parse(window.localStorage.getItem(this.ns));
    return values;
  };
  this.set = function(key, value) {
    var values = this.getAll() || {};
    values[key] = value;
    this.setAll(values);
  };
  this.setAll = function(values) {
    window.localStorage.setItem(this.ns, JSON.stringify(values));
  };
};

chant.local.config = (function(){
  return new chant.local.storageAccessor('config', {
    notification: false,
    mute: {}
  });
})();

chant.local.history = {
  index: -1,
  pool: [],
  push: function(text) {
    chant.local.history.pool.push(text);
    chant.local.history.index = chant.local.history.pool.length;
  },
  append: function(text) {// indexはうごかさない
    chant.local.history.pool.push(text);
  },
  prev: function() {
    if (chant.local.history.pool.length === 0) return;
    var i = chant.local.history.index -= 1;
    if (i < 0)
      chant.local.history.index = i = chant.local.history.pool.length - 1;
    // console.log(i, chant.local.history.pool);
    return chant.local.history.pool[i];
  },
  next: function() {
    if (chant.local.history.pool.length === 0) return;
    var i = chant.local.history.index += 1;
    if (i >= chant.local.history.pool.length)
      chant.local.history.index = i = chant.local.history.pool.length - 1;
    // console.log(i, chant.local.history.pool);
    return chant.local.history.pool[i];
  }
};
