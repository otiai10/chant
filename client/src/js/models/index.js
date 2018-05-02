/**
 * This directory should be used for defining access to Session/LocalStorage,
 * via chomex.Model.
 * Thus, this is comletely independent with "models" of "server".
 * Take care and don't mix up them.
 */
import {Model} from 'chomex';
import { extend } from '@firebase/util';
Model.useStorage(window.sessionStorage);

export class TextHistory extends Model {
  static getByIndex(index) {
    const list = this.list().sort((p,n) => p.lastused < n.lastused ? 1 : -1);
    if (list.length == 0) return;
    return list[index % list.length].text;
  }
  static push(text) {
    const exists = this.list().filter(th => th.text == text).pop();
    if (exists) exists.update({lastused: Date.now()});
    else this.create({lastused:Date.now(), text});
  }
}

export class LocalIdentity extends Model {
  static me() {
    return this.find("me");
  }
  static default = {
    me: {},
  }
}