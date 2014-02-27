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
    Chant.Notifier.onmessage();
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
    Chant.Notifier.onread();
  };

  $('#send').click(function(e) {
    var message = $('#message').val()
    if (message === '') return;
    $('#message').val('').focus();
    Chant.Socket().send(message)
  });

  $('#message').keypress(function(e) {
    if(e.charCode == 13 || e.keyCode == 13) {
      $('#send').click()
      e.preventDefault()
    }
  })

  $('#hey').click(function(){
    var message = 'ﾍｲｯ!ﾍｲｯ!ﾍｲｯ!';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $('#start-dash').click(function(){
    var message = 'ｽﾀｰﾀﾞｯｼｭ!!!';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $('#odayaka').click(function(){
    var message = '{@img:odayakajanai}';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  $('#plus1').click(function(){
    var message = '{@emo:+1}';
    Chant.Socket().send(message);
    $('#message').focus();
    // めんどくせーからここでいいや
    Chant.Notifier.init();
  });
  $('#zawameku').click(function(){
    var message = '{@img:zawameku}';
    Chant.Socket().send(message);
    $('#message').focus();
  });
  // jquery1.5ぇ...
  $('.btn-stamp').live('click', function(){
    var message = $(this).find('img').attr('src');
    Chant.Socket().send(message);
    $('#message').focus();
  });

  $('.user-icon').live('click',function(){
    var message = '@' + $(this).attr('user-name') + ' ';
    $('#message').val(message).focus();
  });

  $('.message-unique').live('click',function(){
    var $form = $('form#' + $(this).attr('data-time'));
    var name = $form.find('[name=screenName]').val();
    var icon = $form.find('[name=profileImageUrl]').val();
    var text = $form.find('[name=originalText]').val();
    var message = '{@quote:{' + name + '}{' + icon + '}{' + text + '}}';
    Chant.Socket().send(message);
    $('#message').focus();
  });
});
