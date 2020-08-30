module.exports = class Speaker {

  constructor(discordBot, logger) {

    this.discordBot = discordBot;
    this.logger = logger;
  }

  setDefaultChannel(channelID) {
    this.channelID_default = channelID;
  }

  // speaker methods
  say(content, channelID = this.channelID_default) {
    this.discordBot.sendMessage({
        to: channelID,
        message: content
    });
  }

  log(content) {
    this.logger.info(content);
  }

  // test method; logs and says content
  shout(content) {
    this.log(content);
    this.say(content);
  }

  tag(user) {
    let tag = "<" + user.username + "#" + user.discriminator + ">";
    return tag;
  }

}
