module.exports = class Bot {

  constructor(discordBot, logger) {
    this.discordBot = discordBot;
    this.logger = logger;

    // testing
    this.logger.info("Bot initialized");

    // binds
    this.onBotLogin = this.onBotLogin.bind(this);
    this.respond = this.respond.bind(this);

    this.discordBot.on('ready', this.onBotLogin);
    this.discordBot.on('message', this.respond);
  }

  // run once discordBot logs in
  onBotLogin(evt) {
    this.logger.info('Connected');
    this.logger.info('Logged in as: ');
    this.logger.info(this.discordBot.username + ' - (' + this.discordBot.id + ')');
  }

  respond(user, userID, channelID, message, evt) {
    // default response, for testing
    if (message.substring(0, 1) == '!') {
      this.say(channelID, "beep!");
    }
  }

  say(channelID, content) {
    this.discordBot.sendMessage({
        to: channelID,
        message: content
    });
  }

}
