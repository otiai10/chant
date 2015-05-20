module Chant {
    export class Time {
        constructor(private timestamp: number) {}
        format(): string {
            var d = new Date(this.timestamp / 1000000);
            return d.toLocaleString();
        }
    }
}
