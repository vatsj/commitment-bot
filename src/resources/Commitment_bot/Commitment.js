module.exports = class Commitment {

  constructor(bot, user, channelID, JSON) {
    // TODO: fill in

    // info about bot, to return messages
    this.bot = bot;
    this.channelID = channelID;

    // info about commitment
    this.user = user;
    // this.extractJSON(JSON)
  }

  extractJSON(comJSON) {

    this.name = comJSON['name'];
    this.period = time2hours(comJSON['period']);
  }

  // test method
  getInfo() {
    let content = JSON.stringify({
      'bot': this.bot,
      'user': this.user,
      'channelID': this.channelID,
      'etc': ''
    });

    return content;
  }

  // checks whether the commitment was fulfilled
  checkFulfillment() {
    if (! this.fulfilled) {
      onFailure();
    }
    // resets commitment fulfillment status
    this.fulfulled = false;
  }

  // say(content) method, similar to Bot.js say()
  // piggybacks off of Bot.say() using default channelID
  say(content) {
    this.bot.say(content, this.channelID);
  }

  // determines reaction based on whether commitment is fulfilled
  onSuccess() {
    this.say("good job m8");
  }
  onFailure() {
    this.say("B A d DO THE THING");
  }

}
