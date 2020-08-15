// imports class-specific resources
var rootDir = "./../..";
var bot_resources = rootDir + "/src/resources/Bot";

var Speaker = require(bot_resources + "/Speaker.js");

module.exports = class Bot {

  constructor(discordBot, logger) {

    this.discordBot = discordBot;
    this.logger = logger;

    // creating a Speaker to handle output
    this.speaker = new Speaker(this.discordBot, this.logger);

    // testing
    this.logger.info("Bot initialized");

    // binds
    this.onBotLogin = this.onBotLogin.bind(this);
    this.respond = this.respond.bind(this);

    // initialize commands, for respond() function
    this.commands = this.initCommands();

    // adds ability to run test command
    this.addTestCommand();

    this.discordBot.on('ready', this.onBotLogin);
    this.discordBot.on('message', this.respond);
  }

  // run once discordBot logs in
  onBotLogin(evt) {
    this.logger.info('Connected');
    this.logger.info('Logged in as: ');
    this.logger.info(this.discordBot.username + ' - (' + this.discordBot.id + ')');
  }

  initCommands() {
    // creates a json object to store commands
    let commands = { };
    this.commands_help = { };

    // test command: 'ping' --> say('pong')
    this.commands_help['ping'] = "pongs";
    commands['ping'] = (args, messageInfo) => {
      // help arg clause
      if (args.trim().toLowerCase() == "help") {
        this.speaker.say("c'mon...");
        return null;
      }

      this.speaker.say(':B:ong!');
    }

    this.commands_help['info'] = "gives info about the user/message";
    commands['info'] = (args, messageInfo) => {

      let info = JSON.stringify(messageInfo, null, 2);

      this.speaker.shout(info);
    }

    this.commands_help['indentity'] = "gives the type of bot processing commands";
    commands['identity'] = (args, messageInfo) => {
      this.speaker.say('I am the following class of bot:\t'+ this.identity());
    }

    this.commands_help['help'] = "gives information about all commands";
    commands['help'] = (args, messageInfo) => {
      let content = "Here's a list of all keyword-command pairs:\n";

      content += JSON.stringify(this.commands_help, null, 2);

      content += `\nto use a command, use the '!' character followed by the command keyword.
      \nfor more information on a specific command, add ' help' to the end of that command.`
      this.speaker.say(content);
    }

    commands['error'] = (args, messageInfo) => {
      this.speaker.say('error: command not found');
    }

    return commands;

  }

  // returns identity of Bot
  // used to test subclass method overwriting
  identity() {
    return "Bot (the default class of bot)";
  }

  // test method for respond functionality
  testRespond(user, userID, channelID, message, evt) {
    // default response, for testing
    if (message.substring(0, 1) == '!') {
      this.speaker.say(channelID, "beep!");
    }
  }

  respond(user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var messageInfo = {
          'user': user,
          'userID': userID,
          'channelID': channelID,
          'message': message,
          'evt': evt
        };

        // splits up args by spaces
        // var args = message.substring(1).split(' ');
        //
        // var cmd = args[0];
        // args = args.splice(1);

        // takes the entire non-cmd string as argt
        let split = message.indexOf(' ');
        if (split == -1) {
          split = message.length;
        }
        var cmd = message.substring(1, split);
        var args = message.substring(split + 1);
        // this.log(cmd + " ~~ then ~~ " + args);

        if (! (cmd in this.commands)) {
          cmd = 'error'
        }

        // hacky default for speaker.say
        // might mistakenly send messages to wrong channel
        // this.channelID = channelID;
        this.speaker.setDefaultChannel(channelID);

        let cmd_fn = this.commands[cmd];
        cmd_fn = cmd_fn.bind(this);

        // try/catch to handle command fn errors
        try {
          cmd_fn(args, messageInfo);
        } catch (e) {
          console.error(e);
          this.speaker.say("error: command failed to execute");
        }

     }
  }

  // used for testing
  addTestCommand() {

    this.commands['test'] = (args, messageInfo) => {

      this.speaker.shout("speaker -- shout")
    }
  }

  // test method
  // runs a sequence of fns with a time interval between each
  stutter_exec(commands, dt = 1000) {

    let count = 0;

    commands.forEach((fn) => {
      count++;

      fn = fn.bind(this);
      // this.log("fn: "+fn);
      setTimeout(() => {
        fn();
      }, count*dt);
    })
  }

  // speaker methods
  // TO BE MOVED TO SPEAKER.JS
  // say(content, channelID = this.channelID) {
  //   this.discordBot.sendMessage({
  //       to: channelID,
  //       message: content
  //   });
  // }
  //
  // log(content) {
  //   this.logger.info(content);
  // }
  //
  // // test method; logs and says content
  // shout(content) {
  //   this.log(content);
  //   this.say(content);
  // }
}
