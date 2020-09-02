// imports class-specific resources
let rootDir = "./../..";
let bot_resources = rootDir + "/src/resources/Bot";

// var Speaker = require(bot_resources + "/Speaker.js");
// var Command = require(bot_resources + "/Command.js");
var CommandHandler = require(bot_resources + "/CommandHandler.js");

module.exports = class Bot {

  constructor(client, speaker) {

    this.client = client;
    this.speaker = speaker;

    // binds
    this.onBotLogin = this.onBotLogin.bind(this);
    this.respond = this.respond.bind(this);

    // creates a json object to store commands
    // commands: key (string) --> Command (Obj)
    this.commandHandler = new CommandHandler(this);
    // initialize commands, for respond() function
    this.initCommands();

    // adds ability to run test command
    this.addTestCommands();

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

    // outdated, to be phased out
    // let commands = {};
    // this.commands_help = { };
    // this.commands_example = { };

    // CONVERT ALL THESE TO COMMAND CLASS
    this.commandHandler.addCommand({
      'keyword': 'ping',
      'description': 'pongs',
      'examples': '!ping',
      'fn': (args, message) => {
        this.speaker.say(':B:ong!', message.channel);
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'info',
      'description': 'gives info about the user/message',
      'examples': '!info',
      'fn': (args, message) => {
        let info = JSON.stringify(message, null, 2);
        this.speaker.shout(info);
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'identity',
      'description': 'gives the type of bot processing commands',
      'examples': '!identity',
      'fn': (args, message) => {
        this.speaker.say('I am the following class of bot:\t'+ this.identity(), message.channel);
      }
    });
    //
    // return commands;

  }

  // returns identity of Bot
  // used to test subclass method overwriting
  identity() {
    return "Bot (the default class of bot)";
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

        this.commandHandler.execute_cmd(cmd, args, message)
     }
  }

  // // used for testing
  addTestCommands() {

    this.commandHandler.addCommand({
      'keyword': 'test',
      'description': 'test command (for development)',
      'examples': '!test',
      'fn': (args, message) => {
        // command code goes here
        let x = 3;
      }
    });
  }

  // test method
  // runs a sequence of fns with a time interval between each
  stutter_exec(fns, dt = 1000) {

    let count = 0;

    fns.forEach((fn) => {
      count++;

      fn = fn.bind(this);
      // this.log("fn: "+fn);
      setTimeout(() => {
        fn();
      }, count*dt);
    })
  }

}
