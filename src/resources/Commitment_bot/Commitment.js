class Commitment {

  constructor(bot, user, channelID, comJSON) {
    // TODO: fill in

    // info about bot, to return messages
    this.bot = bot;
    this.channelID = channelID;

    // info about commitment
    this.user = user;
    this.extractJSON(comJSON)
  }

  extractJSON(comJSON) {

    this.name = comJSON['name'];
    this.period = time2hours(comJSON['period']);
  }

  // checks whether the commitment was fulfilled
  checkFulfillment() {
    if (! this.fulfilled) {
      onFailure();
    }
    // resets commitment fulfillment status
    this.fulfulled = false;
  }

  // determines reaction based on whether commitment is fulfilled
  onSuccess() {
    bot.say(channelID, "good job m8");
  }
  onFailure() {
    boy.say(channelID, "B A d DO THE THING");
  }

}
