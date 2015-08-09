var chant = chant || {};
chant.interface = {
    impl: null,
    setImplement: function(impl) {
      chant.interface.impl = impl;
    },
    open: function(url) {
      return chant.interface.impl.open(url);
    },
    defaultImplement: {
      open: function(url) {
        console.log('defaultImplement.open');
        return window.open(url, "_blank");
      }
    }
};
chant.interface.impl = chant.interface.defaultImplement;
