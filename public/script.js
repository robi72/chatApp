$(function() {
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $messageArea = $('#messageArea');
    var $userFormArea = $('#userFormArea');
    var $sendMessageArea = $('#sendMessageArea');
    var $users = $('#users');
    var $username = $('#username');
    var $typingOut = $('#typingOut')
    var $scrollArea = $('#scrollArea')

    $messageForm.submit(function(e){
        e.preventDefault();
        console.log('Submitted')
        socket.emit('send message', $message.val()
        );
        $message.val('')

    });

    socket.on("new message", function (data) {
      
      $scrollArea.animate({scrollTop: $scrollArea.prop("scrollHeight")}, 500);

      if (data.msg === "/happy") {
        console.log("Happy");
        $chat.append(
          '<div class="well"><strong>' +
            data.user +
            '</strong>:<img src="' +
            "https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif" +
            '" width=50 height=50/>' +
            "</div>"
        );
      } else if (data.msg === "/sad") {
        $chat.append(
          '<div class="well"><strong>' +
            data.user +
            '</strong>:<img src="' +
            "https://media.giphy.com/media/KyGGoxa3eTCWW0lOkU/giphy.gif" +
            '" width=50 height=50/>' +
            "</div>"
        );
      } else if (data.msg === "/angry") {
        $chat.append(
          '<div class="well"><strong>' +
            data.user +
            '</strong>:<img src="' +
            "https://media.giphy.com/media/11tTNkNy1SdXGg/giphy.gif" +
            '" width=50 height=50/>' +
            "</div>"
        );
      } else {
        $chat.append('<div class="well well-sm"><strong>' +data.user +"</strong>:" +data.msg +"</div>");
      }
    });
    
    $userFormArea.submit(function (e) {
        e.preventDefault();
        socket.emit('new user', $username.val(), function (data) {
    
          if (data) {
    
            $userFormArea.hide();
            $messageArea.show();
            $sendMessageArea.show();
          }
        });
    
        $username.val('');
      });


    
      socket.on('get users', function (data) {
        var html = '';
        for (i = 0; i < data.length; i++) {
          html += '<li class="list-group-item list-group-item-success">' + data[i] + '</li>';
          $users.html(html);
        }
      });
     
      $message.on('keypress', function() {
        socket.emit('typing', {
          user: socket.$username
        })
      })

      socket.on('typing', function (data) {
        $typingOut.html('<strong>' + data.user + '</strong>:' + ' is typing...');
        setTimeout(function() {
          $typingOut.html('');
        }, 3000)
      })
});