var debug = (function(){
    return function(message) {
        if (window.silent) return;
        var txt = "[" + new Date().toLocaleString() + "] " + message;
        var style = "color:orange";
        console.log("%c" + txt, style);
    };
})();
$(function(){
  // Display a message
  var display = function(event) {
    //$(tmpl('message_tmpl', {event: event})).hide().prependTo('#thread').fadeIn(80);
    $(Chant.Render.Event[event.Type](event)).hide().prependTo('#thread').fadeIn(100);
    if (event.RoomInfo && event.RoomInfo.Updated) {
        $('#room-info').html(Chant.Render.RoomInfo['default'](event));
    }
  }

  // Message received on the socket
  var onmessage = function(event) {
    display(JSON.parse(event.data))
    Chant.Notifier.onmessage(JSON.parse(event.data));
  };
  var onerror = function(event) {
  };
  var onclose = function(event) { };
  var onreconnect = function() {
    window.alert("hoge");
  };
  Chant.Socket.init({
    onmessage: onmessage,
    onerror: onerror,
    onclose: onclose
  });

  window.onfocus = function(){
    Chant.Notifier.isActive = true;
    Chant.Notifier.onread();
  };
  window.onblur = function(){
    Chant.Notifier.isActive = false;
  };

  $('#send').on('click',function(e) {
    var message = $('#message').val()
    if (message === '') return;
    Chant.Client.process(message);
    $('#message').val('').focus();
    Chant.Socket.send(message)
  });

  $('#message').keypress(function(e) {
    if(e.charCode == 13 || e.keyCode == 13) {
      $('#send').click();
      e.preventDefault()
    }
  })

  $('#hey').on('click',function(){
    var message = 'ﾍｲｯ!ﾍｲｯ!ﾍｲｯ!';
    Chant.Socket.send(message);
    $('#message').focus();
  });
  $('#start-dash').on('click',function(){
    var message = 'ｽﾀｰﾀﾞｯｼｭ!!!';
    Chant.Socket.send(message);
    $('#message').focus();
  });
  $('#odayaka').on('click',function(){
    var message = '{@img:odayakajanai}';
    Chant.Socket.send(message);
    $('#message').focus();
  });
  $('#plus1').on('click',function(){
    var message = '{@emo:+1}';
    Chant.Socket.send(message);
    $('#message').focus();
  });
  // affect settings
  if (localStorage.getItem('enable-notification') === 'true') {
    $('#enable-notification').attr('checked', true);
  }
  $(document).on('change','#enable-notification',function(){
    Chant.Notifier.init();
    var isEnabled = $('#enable-notification').is(':checked');
    localStorage.setItem('enable-notification', isEnabled);
  });
  $('#zawameku').on('click',function(){
    var message = '{@img:zawameku}';
    Chant.Socket.send(message);
    $('#message').focus();
  });
  $('#chunchun').on('click',function(){
    var message = '{@img:chunchun}';
    Chant.Socket.send(message);
    $('#message').focus();
  });
  $(document).on('click','button.btn-stamp', function(){
    var message = $(this).attr('data-raw');
    // Chant.Socket.send(message);
    $('#message').focus();
    // LRU
    var dummyStamprizeMessage = '{@stamp:' + message + '@use}';
    Chant.Socket.send(dummyStamprizeMessage);
  });

  $(document).on('click','.user-icon',function(){
    var $mess = $('#message');
    var existingMessage = ($mess.val()) ? $mess.val() + ' ' : '';
    var message = '@' + $(this).attr('user-name') + ' ';
    $mess.val(existingMessage + message).focus();
  });

  $(document).on('click','.message-unique',function(){
    var $form = $('form#' + $(this).attr('data-time'));
    var name = $form.find('[name=screenName]').val();
    var icon = $form.find('[name=profileImageURL]').val();
    var text = $form.find('[name=originalText]').val();
    var message = ' {@quote:' + name + '||' + icon + '||' + text + '}';
    var current = $('#message').val();
    $('#message').val(current + message).focus();
    $('#message')[0].setSelectionRange(0, 0);
  });
  $(document).on('click','.to-stamp',function(){
    var $form = $('form#' + $(this).attr('data-time'));
    var text = $form.find('[name=originalText]').val();
    var message = '{@stamp:' + text + '}';
    Chant.Socket.send(message);
    $('#message').focus();
  });
  $(document).on('click','.to-mute',function(){
    var $form = $('form#' + $(this).attr('data-time'));
    var text = $form.find('[name=originalText]').val();
    var message = '{@mute:' + text + '}';
    $('#message').val(message).focus();
  });

  $('#playlist-start').on('click',function(){
    Chant.Playlist().play(0);
    $(this).remove();
  });
  $(document).on('click','.sound-title',function(){
    var playlistIndex = $(this).attr('data-sound-index');
    Chant.Playlist().play(playlistIndex);
  });

  $(document).on('click','.show-tips',function(){
    var view = new Chant.TipsModalView();
    $('body').append(view.render().$el.show());
  });

  $(document).on('click','.unmute',function(){
    var message = '{@unmute:' + $(this).attr('data-unmute') + '}';
    $('#message').val(message).focus();
  });

  $(document).on('click','.danger-hidden',function() {
    $(this).replaceWith(Chant.Anchorize($(this).attr('data-dangerous')));
      var $preview = $("#" + $(this).attr('id') + "-preview");
      $preview.remove();
  });
  $(document).on({
    'mouseenter': function() {
      $("#" + $(this).attr('id') + "-preview").remove();
      var coords = $(this).offset();
      var id = $(this).attr('id') + "-preview";
      var text = $(this).attr('data-dangerous');
      var $preview = $('<div></div>');
      $preview.attr({id: id}).css({
        "zIndex": 2,
        "position": "absolute",
        "top": coords.top,
        "left": coords.left + 50,
        // "width": "200px",
        // "height": "100px",
        "opacity": "0.5",
        "overflow": "scroll"
      }).html(Chant.Anchorize(text));
      $preview.hide().appendTo('body').fadeIn(50);
    },
    'mouseleave': function() {
      var $preview = $("#" + $(this).attr('id') + "-preview");
      $preview.fadeOut(50, function() {
        $preview.remove();
      });
    }
  }, '.danger-hidden');
});
