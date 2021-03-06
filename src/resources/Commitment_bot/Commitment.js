// imports ScheduledEvent, CronEvent
let cmt_resources = ".";
var OneOffEvent = require(cmt_resources + "/OneOffEvent.js");
var CronEvent = require(cmt_resources + "/CronEvent.js");

module.exports = class Commitment {

  constructor(bot, args_info, base_message) {

    // info about bot, to return messages
    this.bot = bot;
    this.speaker = this.bot.speaker;

    this.extract_args_info(args_info);
    this.scheduledEvent = this.create_event();

    // gets info specific to the commitment
    this.extract_message_info(base_message);

    // defaults to not fulfilled
    this.fulfilled = false

  }

  // CronEvent class uses a shared schedule
  static setSchedule(schedule) {
    CronEvent.setSchedule(schedule);
  }

  // extracts info needed to schedule event
  extract_args_info(args_info) {

    this.args_info = args_info;

    this.name = args_info['name'];
    this.description = args_info['description'] ? args_info['description'] : "";
    this.time = args_info['time'];

    // binary var representing whether the event is recurring
    // maunally mapped from string --> boolean
    this.recurring = args_info['recurring'] ? (args_info['recurring'].toLowerCase() == 'true') : false;

    // checks for essential arguments
    if (! (this.name && this.time)) {
      this.speaker.say("commitment 'name' and 'time' arguments are required!");
      throw "commitment - missing name/time argument";
    }
  }

  create_event(time = this.time) {

    let scheduledEvent;

    if (this.recurring) {
      let cron = CronEvent.time2cron(this.time);
      scheduledEvent = new CronEvent(() => {
        this.checkFulfillment();
      }, cron);
    } else {
      let milliseconds = OneOffEvent.time2ms(this.time);
      scheduledEvent = new OneOffEvent(() => {
        this.checkFulfillment();
      }, milliseconds);
    }

    // adds a delete event (for OneOffEvents)
    scheduledEvent.addListener('delete', () => {
      // deletes the commitment and removes it from C_bot dictionary
      this.bot.deleteCommitment(this.name, this.base_message);
    })

    return scheduledEvent;
  }

  // UNUSED FN
  // needed to convert different types of time args
  extract_cron(args_info) {

    // handles time/cron conversion and scheduling
    // priority order: time, cron
    let crons = [];

    if ("time" in this.args_info) {

      this.time = this.args_info["time"];
      crons.push(this.time2cron(this.time));

      // deletes time from args_info
      delete this.args_info["time"];
    }

    if ("cron" in this.args_info) {
      crons.push(this.args_info["cron"]);
    }

    // sets cron to be first registered cron
    // if no cron, throw error
    if (crons.length == 0) {
      throw "error: no time information given!"
    }
    this.cron = crons[0];
    this.args_info['cron'] = this.cron;
  }

  extract_edit(edit_info) {

    let args_info = this.args_info;

    // checks if recurring status changed
    let recurring_changeFlag = (args_info['time'] != edit_info['time']);

    // overwriting object info with edit info
    for (let key in args_info) {
      if (key in edit_info) {
        args_info[key] = edit_info[key];
      }
    }

    this.extract_args_info(args_info);

    if (recurring_changeFlag) {
      this.scheduledEvent.listener_off();
      this.scheduledEvent = this.create_event(this.time);
    } else {
      // reschedule event
      if (this.recurring) {
        let cron = CronEvent.time2cron(this.time);
        this.scheduledEvent.reschedule_event(cron);
      } else {
        let milliseconds = OneOffEvent.time2ms(this.time);
        this.scheduledEvent.reschedule_event(milliseconds);
      }
    }
  }

  extract_message_info(base_message) {

    this.base_message = base_message

    // encodes info about who/where the commitment is for
    this.channel = base_message.channel;
    this.author = base_message.author;

    // this.speaker.shout("author: "+this.speaker.tag(this.author));
  }

  // fulfills the commitment
  fulfill() {
    this.fulfilled = true;
    this.onSuccess();
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
    this.fulfilled = false;
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

    let content = "";
    content += JSON.stringify(this.scheduledEvent, null, 2);
    content += this.base_message;

    return content;
  }

  // called by UI-side commitment rendering methods
  getInfo_pretty() {
    let content = `**${this.name}**
    ${this.description}
    recurring: ${this.recurring}
    time interval: ${this.time} \n`;

    return content;
  }

}
