// imports ScheduledEvent.js class as a superclass
var ScheduledEvent = require("./ScheduledEvent.js");

module.exports = class Commitment extends ScheduledEvent{

  constructor(bot, schedule, schedule_info, cmt_info) {
    // defines a ScheduledEvemt to evaluate the cmt
    super(schedule, schedule_info, bot.speaker);

    // info about bot, to return messages
    this.bot = bot;
    this.speaker = this.bot.speaker;

    // this.extract_message_info(message_info);
    this.extract_cmt_info(cmt_info);

  }

  extract_cmt_info(cmt_info) {

    this.cmt_info = cmt_info

    // encodes info about who/where the commitment is for
    this.channelID = cmt_info['channelID'];
    this.user = cmt_info['user'];
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
    this.speaker.say("good job m8");
  }
  onFailure() {
    this.speaker.say("B A d DO THE THING");
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

    content += "\n\n" + JSON.stringify(this.cmt_info, null, 2);

    return content;
  }

  // say(content) method, similar to Bot.js say()
  // piggybacks off of Bot.say() using default channelID
  // say(content) {
  //   this.bot.say(content, this.channelID);
  // }
  // log(content) {
  //   this.bot.log(content);
  // }

}
