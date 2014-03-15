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
  Chant.Socket().onmessage = function(event) {
    display(JSON.parse(event.data))
    Chant.Notifier.onmessage(JSON.parse(event.data));
  };

  Chant.Socket().onerror = function(event) {
    var connectForce = true;
    Chant.Socket(connectForce);
  };

  Chant.Socket().onclose = function(event) {
    var connectForce = true;
    Chant.Socket(connectForce);
  };

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
    $('#message').val('').focus();
    Chant.Socket().send(message)
  });

  $('#message').keypress(function(e) {
    if(e.charCode == 13 || e.keyCode == 13) {
      $('#send').click();
      e.preventDefault()
    }
  })

  $('#hey').on('click',function(){
    var message = 'ﾍｲｯ!ﾍｲｯ!ﾍｲｯ!';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $('#start-dash').on('click',function(){
    var message = 'ｽﾀｰﾀﾞｯｼｭ!!!';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $('#odayaka').on('click',function(){
    var message = '{@img:odayakajanai}';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $('#plus1').on('click',function(){
    var message = '{@emo:+1}';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  document.getElementById('enable-notification').addEventListener('change', function(){
    Chant.Notifier.init();
  });
  $('#zawameku').on('click',function(){
    var message = '{@img:zawameku}';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $('#chunchun').on('click',function(){
    var message = '{@img:chunchun}';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $(document).on('click','button.btn-stamp', function(){
    var message = $(this).find('img').attr('src');
    Chant.Socket().send(message);
    $('#message').focus();
  });

  $(document).on('click','.user-icon',function(){
    var message = '@' + $(this).attr('user-name') + ' ';
    $('#message').val(message).focus();
  });

  $(document).on('click','.message-unique',function(){
    var $form = $('form#' + $(this).attr('data-time'));
    var name = $form.find('[name=screenName]').val();
    var icon = $form.find('[name=profileImageUrl]').val();
    var text = $form.find('[name=originalText]').val();
    var message = '{@quote:{' + name + '}{' + icon + '}{' + text + '}}';
    Chant.Socket().send(message);
    $('#message').focus();
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
 
});
