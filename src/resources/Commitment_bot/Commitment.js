// imports ScheduledEvent.js class as a superclass
var ScheduledEvent = require("./ScheduledEvent.js");

module.exports = class Commitment extends ScheduledEvent{

  constructor(bot, schedule, schedule_info, base_message) {
    // defines a ScheduledEvemt to evaluate the cmt
    super(schedule, schedule_info, bot.speaker);

    // info about bot, to return messages
    this.bot = bot;
    this.speaker = this.bot.speaker;

    // this.extract_message_info(message_info);
    this.extract_base_message(base_message);

  }

  extract_base_message(base_message) {

    this.base_message = base_message

    // encodes info about who/where the commitment is for
    this.channel = base_message.channel;
    this.author = base_message.author;

    // this.speaker.shout("author: "+this.speaker.tag(this.author));
  }


  // checks whether the commitment was fulfilled
  // triggered by ScheduledEvent call
  event() {

    // logs that the fn is called
    // this.speaker.log("\nscheduled event: checking cmt fulfillment\n");

    if (! this.fulfilled) {
      this.onFailure();
    }

    this.reset_cmt();
  }

  // resets the commitment
  // to be run upon the time interval carrying over
  reset_cmt() {

    // resets commitment fulfillment status
    this.fulfulled = false;
  }



  // determines reaction based on whether commitment is fulfilled
  onSuccess() {
    let message = `${this.speaker.tag(this.author)} Nice job! You fulfilled the following commitment:
    ${this.getInfo_pretty()}`
    this.speaker.say(message);
  }
  onFailure() {
    let message = `${this.speaker.tag(this.author)} Tsk tsk >:( you failed to fulfill the following commitment:
    ${this.getInfo_pretty()}`
    this.speaker.say(message);
  }

  // test method
  getInfo() {

    let content = super.getInfo();

    // let misc_info = {
    //   'bot': this.bot,
    //   // 'user': this.user,
    //   // 'channelID': this.channelID,
    //   'etc': ''
    // }
    // content += JSON.stringify(misc_info, null, 2);

    content += "\n\n" + JSON.stringify(this.base_message, null, 2);

    return content;
  }

  // called by UI-side commitment rendering methods
  getInfo_pretty() {
    let content = `**${this.name}**
    ${this.description}`;

    return content;
  }

}
