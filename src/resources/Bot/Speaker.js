module.exports = class Speaker {

  constructor(client, logger) {

    this.client = client;
    this.logger = logger;
  }

  setDefaultChannel(channel) {
    this.channel_default = channel;
  }

  // speaker methods
  say(content, channel = this.channel_default) {
    channel.send(content);
  }

  log(content) {
    this.logger.log({
      level: 'info',
      message: content
    });
  }

  // test method; logs and says content
  shout(content) {
    this.log(content);
    this.say(content);
  }

  throwError(e) {
    let errorMsg = e.toString() + "\n\n" + e.stack;

    // this.logger.log({
    //   level: 'error',
    //   message: errorMsg
    // });

    console.error(e);
  }

  // might be easy in Discord.js, which would render this fn unnecessary
  tag(user) {
    let tag = user.toString();
    return tag;
  }

}
