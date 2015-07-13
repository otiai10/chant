var chant = chant || {};
chant.Totsuzen = function(str) {
  this.value = str;
  this.length = chant.Totsuzen.checkLength(str);
  this.head = "＿";
  this.foot = "￣";
  this.hat = "人";
  this.shoe1 = "^";
  this.shoe2 = "Y";
  this.left = "＞";
  this.right = "＜";
};
chant.Totsuzen.prototype.getTopLine = function() {
  var caps = [this.head];
  for (var i = 0; i < this.length; i++) {
    caps.push(this.hat);
  }
  caps.push(this.head);
  return caps.join('');
};
chant.Totsuzen.prototype.getMiddleLine = function() {
  var middle = [this.left, " ", this.value, " ", this.right];
  return middle.join('');
};
chant.Totsuzen.prototype.getBottomLine = function() {
  var bottom = [];
  for (var i = 0; i < this.length; i++) {
    bottom.push(this.shoe1, this.shoe2);
  }
  bottom = bottom.slice(1);
  bottom.unshift(this.foot);
  bottom.push(this.foot);
  return bottom.join('');
};
chant.Totsuzen.prototype.toText = function() {
  return [
  this.getTopLine(),
  this.getMiddleLine(),
  this.getBottomLine()
  ].join("\n");
};
chant.Totsuzen.checkLength = function(value) {
  var length = 0;
  // うわ、こんなところにjQuery!!
  $.map(value.split(''), function(ch) {
    if (chant.Totsuzen.isMultiByte(ch)) length += 2;
    else length += 3;
  });
  return Math.floor(length / 3);
};
chant.Totsuzen.isMultiByte = function(ch) /* bool */ {
  // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
  // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
  var code =  ch.charCodeAt(0);
  if ((code >= 0x0 && code < 0x81) ||
    (code == 0xf8f0) ||
    (code >= 0xff61 && code < 0xffa0) ||
    (code >= 0xf8f1 && code < 0xf8f4)) {
    return true;
  }
  return false;
};
chant.Totsuzen.text = function(str) {
    var t = new chant.Totsuzen(str);
    return t.toText();
};
