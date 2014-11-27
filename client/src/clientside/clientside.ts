/// <reference path="../../definitions/jquery.d.ts" />

module Chant.Client.MuteList {
  var key = "chant.mutelist";
  function store(list: Object) {
    window.localStorage.setItem(key, JSON.stringify(list));
  }
  function restore(def: Object = {}): Object {
    $.extend(def, JSON.parse(window.localStorage.getItem(key)) || {});
    return def;
  }
  export function set(val: string) {
    var list = restore();
    list[val] = true;
    store(list);
  }
  export function del(val: string) {
    var list = restore();
    delete list[val];
    store(list);
  }
  export function has(val: string): boolean {
    return (val in restore());
  }
}

module Chant.Client {
  var cmd: RegExp = /{@([a-z]+):(.*)}/i;
  var processors: Object = {
    "mute": function(val: string) {
      MuteList.set(val);
    },
    "unmute": function(val: string) {
      MuteList.del(val);
    }
  };
  export function process(message: string) {
    var m = cmd.exec(message);
    if (! m || m.length < 3) return;
    if (! processors[m[1]]) return;
    processors[m[1]](m[2]);
  }
}
