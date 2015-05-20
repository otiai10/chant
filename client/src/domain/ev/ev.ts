
module Chant {
  var Type = {
    Join:      "join",
    Leave:     "leave",
    StampAdd:  "stamp.add",
    StampUse:  "stamp.user",
    Message:   "message",
    Keepalive: "keepalive"
  };
  export class Ev {
    public text: string;
    constructor(public type: string,
              public value: any) {}
    public ToString(): string {
      this.text = String(this.value);
      return JSON.stringify(this);
    }
  }
}
