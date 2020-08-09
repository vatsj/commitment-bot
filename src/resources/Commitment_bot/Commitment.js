module.exports = class Commitment {

  constructor(bot, schedule, message_info, cmt_info) {
    // TODO: fill in

    // binds
    this.checkFulfillment = this.checkFulfillment.bind(this);

    // info about bot, to return messages
    this.bot = bot;
    this.schedule = schedule;

    this.extract_message_info(message_info);
    this.extract_cmt_info(cmt_info);

    // sets the schedule event to evaluate the cmt
    this.schedule_cmt();
  }

  extract_message_info(message_info) {

    // keep this general storage trick, for now
    this.message_info = message_info;

    // encodes info about who/where the commitment is for
    this.channelID = message_info['channelID'];
    this.user = message_info['user'];
  }

  extract_cmt_info(cmt_info) {

    this.cmt_info = cmt_info

    this.name = cmt_info['name'];
    this.cron = cmt_info['cron'];

    // this.period = time2hours(comJSON['period']);
  }

  schedule_cmt() {

    this.log("scheduling cmt!!!!! \n\n\n\n");
    this.log(this.schedule);
    this.job = this.schedule.scheduleJob(this.cron, this.checkFulfillment);
    this.log(this.schedule);
  }

  // checks whether the commitment was fulfilled
  checkFulfillment() {

    // logs that the fn is called
    this.log("scheduled event: checking cmt fulfillment\n");

    if (! this.fulfilled) {
      onFailure();
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

    this.say("good job m8");
  }
  onFailure() {
    this.say("B A d DO THE THING");
  }

  // test method
  getInfo() {

    let content = "";

    content += JSON.stringify({
      'bot': this.bot,
      'schedule': this.schedule,
      // 'user': this.user,
      // 'channelID': this.channelID,
      'etc': ''
    });

    content += "\n\n" + JSON.stringify(this.message_info);
    content += "\n\n" + JSON.stringify(this.cmt_info);

    return content;
  }

  // say(content) method, similar to Bot.js say()
  // piggybacks off of Bot.say() using default channelID
  say(content) {
    this.bot.say(content, this.channelID);
  }
  log(content) {
    this.bot.log(content);
  }

}
