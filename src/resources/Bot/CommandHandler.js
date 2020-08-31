let bot_resources = ".";
let Command = require(bot_resources + "/Command.js");

// stores collection of commands a given bot has access to
module.exports = class CommandHandler {

  constructor(bot) {

    this.speaker = bot.speaker;

    // JSON mapping keywords to commands
    this.commands = { };

    // adds general help command
    this.addCommand_help();
  }

  addCommand(command) {
    this.commands[command.keyword] = command;
  }

  addCommand_help() {

    let help = new Command('help',
      'gives information about all commands',
      '!help',
      () => {
        let content = "Here's a list of all keyword-command pairs:\n";

        for (keyword in this.commands) {
          content += this.commands[keyword].help(false);
        }

        content += `\nto use a command, use the '!' character followed by the command keyword.
        \nfor more information on a specific command, add ' help' to the end of that command.`

        this.speaker.say(content);
      });

      this.addCommand(help);
  }

  // tries to run command given by the keywords
  // returns true iff event is executed
  execute_cmd(keyword, args, message) {

    if (! (keyword in this.commands)) {
      this.speaker.say('error: command not found', message.channel);
      return false;
    }

    let command = this.commands[keyword];
    // idt this is necessry if all fns are anonymous?
    // cmd_fn = cmd_fn.bind(this);

    // try/catch to handle command fn errors
    try {
      // message if message exists, false otherwise
      let help_msg = command.help_check(args);
      if (help_msg) {
        this.speaker.say(help_msg, message.channel);
      } else {
        command.fn(args, message);
      }

      return true;
    } catch (e) {
      // console.error(e);
      this.speaker.throwError(e);
      this.speaker.say("error: command failed to execute", message.channel);
      return false;
    }
  }

}
