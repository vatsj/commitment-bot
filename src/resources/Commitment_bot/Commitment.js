// imports ScheduledEvent, CronEvent
let cmt_resources = ".";
var ScheduledEvent = require(cmt_resources + "/ScheduledEvent.js");
var CronEvent = require(cmt_resources + "/CronEvent.js");

module.exports = class Commitment {

  constructor(bot, args_info, base_message) {

    // info about bot, to return messages
    this.bot = bot;
    this.speaker = this.bot.speaker;

    this.extract_args_info(args_info);

    // gets info specific to the commitment
    this.extract_message_info(base_message);

  }

  // CronEvent class uses a shared schedule
  static setSchedule(schedule) {
    CronEvent.setSchedule(schedule);
  }

  // extracts info needed to schedule event
  extract_args_info(args_info) {

    this.args_info = args_info;

    this.name = args_info['name'];
    this.description = args_info['description'];
    this.time = args_info['time'];

    // binary var representing whether it
    this.recurring = args_info['recurring'];

    if (this.recurring) {
      let cron = CronEvent.time2cron(this.time);
      this.scheduledEvent = new CronEvent(() => {
        this.checkFulfillment();
      }, cron);
    } else {
      let milliseconds = OneOffEvent.time2ms(this.time);
      this.scheduledEvent = new OneOffEvent(() => {
        this.checkFulfillment();
      }, milliseconds);
    }

  }

  // extract_cron(args_info) {
  //
  //   // ASSUMING ONLY TIME IS INPUTTED
  //   // handles time/cron conversion and scheduling
  //   // priority order: time, cron
  //   let crons = [];
  //
  //   if ("time" in this.args_info) {
  //
  //     this.time = this.args_info["time"];
  //     crons.push(this.time2cron(this.time));
  //
  //     // deletes time from args_info
  //     delete this.args_info["time"];
  //   }
  //
  //   if ("cron" in this.args_info) {
  //     crons.push(this.args_info["cron"]);
  //   }
  //
  //   // sets cron to be first registered cron
  //   // if no cron, throw error
  //   if (crons.length == 0) {
  //     throw("error: no time information given!")
  //   }
  //   this.cron = crons[0];
  //   this.args_info['cron'] = this.cron;
  // }

  extract_edit(edit_info) {

    let args_info = this.args_info;

    // overwriting object info with edit info
    for (let key in args_info) {
      if (key in edit_info) {
        args_info[key] = edit_info[key];
      }
    }

    this.extract_args_info(args_info);
    this.reschedule_event();
  }

  extract_message_info(base_message) {

    this.base_message = base_message

    // encodes info about who/where the commitment is for
    this.channel = base_message.channel;
    this.author = base_message.author;

    // this.speaker.shout("author: "+this.speaker.tag(this.author));
  }


  // checks whether the commitment was fulfilled
  // triggered by ScheduledEvent call
  checkFulfillment() {

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
    this.speaker.say(message, this.channel);
  }
  onFailure() {
    let message = `${this.speaker.tag(this.author)} Tsk tsk >:( you failed to fulfill the following commitment:
    ${this.getInfo_pretty()}`
    this.speaker.say(message, this.channel);
  }

  // schedule_event(arg) {
  //   // handled by subclasses
  // }
  //
  // unschedule_event() {
  //   // handled by subclasses
  // }
  //
  // reschedule_event(arg) {
  //   this.unschedule_event();
  //   this.schedule_event(arg);
  // }

  delete() {
    this.scheduledEvent.listener_off();
    // call finalize (destructor) method?
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
