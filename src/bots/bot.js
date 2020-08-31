// imports class-specific resources
let rootDir = "./../..";
let bot_resources = rootDir + "/src/resources/Bot";

let Speaker = require(bot_resources + "/Speaker.js");
let Command = require(bot_resources + "/Command.js");
let CommandHandler = require(bot_resources + "/CommandHandler.js");

module.exports = class Bot {

  constructor(client, logger) {

    this.client = client;
    this.logger = logger;

    // creating a Speaker to handle output
    this.speaker = new Speaker(this.client, this.logger);

    // binds
    this.onBotLogin = this.onBotLogin.bind(this);
    this.respond = this.respond.bind(this);

    // initialize commands, for respond() function
    this.commands = this.initCommands();

    // adds ability to run test command
    this.addTestCommand();

    this.client.on('ready', this.onBotLogin);
    this.client.on('message', this.respond);
  }

  // run once client logs in
  onBotLogin(evt) {
    this.speaker.log('Connected');
    this.speaker.log('Logged in as: ');

    let user = this.client.user;
    this.speaker.log(user.username + " (ID: "+user.id+")");
  }

  initCommands() {
    // creates a json object to store commands
    // commands: key (string) --> Command (Obj)
    this.CommandHandler = new CommandHandler(this);

    // outdated, to be phased out
    let commands = {};
    this.commands_help = { };
    this.commands_example = { };

    // CONVERT ALL THESE TO COMMAND CLASS
    this.CommandHandler.addCommand(new Command('ping',
      'pongs',
      '!ping',
      (args, message) => {
        this.speaker.say(':B:ong!');
      }));

    // test command: 'ping' --> say('pong')
    // this.commands_help['ping'] = "pongs";
    // this.commands_example['ping'] = "!ping";
    // commands['ping'] = (args, message) => {
    //   this.speaker.say(':B:ong!');
    // }

    this.commands_help['info'] = "gives info about the user/message";
    this.commands_example['info'] = "!info"
    commands['info'] = (args, message) => {

      let info = JSON.stringify(message, null, 2);
      this.speaker.shout(info);
    }

    this.commands_help['identity'] = "gives the type of bot processing commands";
    this.commands_example['identity'] = "!info"
    commands['identity'] = (args, message) => {
      this.speaker.say('I am the following class of bot:\t'+ this.identity());
    }

    this.commands_help['help'] = "gives information about all commands";
    commands['help'] = (args, message) => {
      let content = "Here's a list of all keyword-command pairs:\n";

      content += JSON.stringify(this.commands_help, null, 2);

      content += `\nto use a command, use the '!' character followed by the command keyword.
      \nfor more information on a specific command, add ' help' to the end of that command.`
      this.speaker.say(content);
    }

    // commands['error'] = (args, message) => {
    //   this.speaker.say('error: command not found');
    // }

    return commands;

  }

  // returns identity of Bot
  // used to test subclass method overwriting
  identity() {
    return "Bot (the default class of bot)";
  }

  // test method for respond functionality
  testRespond(message) {
    let content = message.content;

    // default response, for testing
    if (content.substring(0, 1) == '!') {
      this.speaker.say(message.channel, "beep!");
    }
  }

  respond(message) {

    let content = message.content;

    if (content.substring(0, 1) == '!') {

        // takes the entire non-cmd string as argt
        let split = content.indexOf(' ');
        if (split == -1) {
          split = content.length;
        }
        let cmd = content.substring(1, split);
        let args = content.substring(split + 1);
        // this.log(cmd + " ~~ then ~~ " + args);

        // hacky default for speaker.say
        // might mistakenly send messages to wrong channel
        this.speaker.setDefaultChannel(message.channel);

        this.CommandHandler.execute_cmd(cmd, args, message)
        //
        // if (! (cmd in this.commands)) {
        //   cmd = 'error'
        // }
        //
        // let cmd_fn = this.commands[cmd];
        // cmd_fn = cmd_fn.bind(this);
        //
        // // try/catch to handle command fn errors
        // try {
        //   if (! this.cmd_help(cmd, args)) {
        //     cmd_fn(args, message);
        //   }
        // } catch (e) {
        //   // console.error(e);
        //   this.speaker.throwError(e);
        //   this.speaker.say("error: command failed to execute");
        // }

     }
  }

  // if args == "help", gives help msg and returns true
  // cmd_help(cmd, args) {
  //
  //   // if help cmd
  //   if (args.trim().toLowerCase() == "help") {
  //
  //     let content = `**${cmd}**: ${this.commands_help[cmd]}
  //     *Example Command:* ${this.commands_example[cmd]}`;
  //
  //     // return message
  //     this.speaker.say(content);
  //     return true;
  //   }
  //
  //   return false;
  // }

  // used for testing
  addTestCommand() {

    this.commands['test'] = (args, message) => {

      this.speaker.say("*this should be italicized*");
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

}
