function showCommands() {
    var $message = $("#message");
    var $commands = $("#commands");
    if ($message.val().charAt(0) === "/") {
      $commands.removeAttr("hidden");
    } else {
      $commands.attr("hidden", true);
    }
  }