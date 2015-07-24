var chant = chant || {};
chant.local = {};
chant.local.storageAccessor = function(name, _def, _rootNS){
  this.ns = _rootNS || 'chant';
  this.ns += '.' + name;
  if (window.localStorage.getItem(this.ns) === undefined) {
    window.localStorage.setItem(this.ns, JSON.stringify(_def || {}));
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
    notification: false
  });
})();

chant.local.history = {
  index: -1,
  pool: []
};
