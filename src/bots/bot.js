module.exports = class Bot {

  constructor(discordBot, logger) {
    this.discordBot = discordBot;
    this.logger = logger;

    // testing
    this.logger.info("Bot initialized");

    // binds
    this.onBotLogin = this.onBotLogin.bind(this);
    this.respond = this.respond.bind(this);

    // initialize commands, for respond() function
    this.commands = this.initCommands();

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
    let commands = { }

    // test command: 'ping' --> say('pong')
    commands['ping'] = () => {
      this.say(':B:ong!');
    }

    commands['identity'] = () => {
      this.say('I am the following class of bot:\t'+ this.identity());
    }

    commands['error'] = () => {
      this.say('Command not found');
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
      this.say(channelID, "beep!");
    }
  }

  respond(user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');

        var cmd = args[0];
        args = args.splice(1);

        if (! (cmd in this.commands)) {
          cmd = 'error'
        }
        this.channelID = channelID;
        this.commands[cmd]();
     }
  }

  say(content, channelID = this.channelID) {
    this.discordBot.sendMessage({
        to: channelID,
        message: content
    });
  }

  log(content) {
    this.logger.info(content);
  }

}
