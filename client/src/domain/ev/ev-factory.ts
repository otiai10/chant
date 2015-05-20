module Chant {
  export class EvFactory {
    public static Create(type: string, value: any): Ev {
      return new Ev(type, value);
    }
    public static Decode(raw: string): Ev {
      var type: string;
      var value: any;
      try {
        var ev = JSON.parse(raw);
        type = ev["type"];
        value = ev["value"];
      } catch (e) {
        type = "message";
        value = raw;
      }
      return new Ev(type, value);
    }
    public static Encode(ev: Ev): string {
      return ev.ToString();
    }
  }
}
