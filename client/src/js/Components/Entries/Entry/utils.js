export const _prettyTime = (unix) => {
  const d = new Date(unix);
  return [
    d.getFullYear(),
    _zeropadding(d.getMonth()+1),
    _zeropadding(d.getDate())
  ].join('/') + ' ' + [
    _zeropadding(d.getHours()),
    _zeropadding(d.getMinutes()),
    _zeropadding(d.getSeconds())
  ].join(':');
};

export const _zeropadding = (src, digit = 2, padding = '0') => {
  for (let i = 0; i < digit; i++) {
    src = padding + src;
  }
  return src.slice(-1 * digit);
};
