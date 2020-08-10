module.exports = class ScheduledEvent {

  constructor (schedule, schedule_info) {

    this.schedule = schedule;

    // binds
    // idk if this works with subclasses overwriting methods?
    this.event = this.event.bind(this);

    this.extract_schedule_info(schedule_info);

    this.schedule_event();

  }

  extract_schedule_info(schedule_info) {

    this.schedule_info = schedule_info;

    this.name = schedule_info['name'];
    this.cron = schedule_info['cron'];
  }

  delete() {

    this.unschedule_event();
    // call finalize (destructor) method?
  }

  schedule_event() {
    this.job = this.schedule.scheduleJob(this.cron, this.event);
  }

  unschedule_event() {
    this.job.cancel();
  }

  event() {
    // the thing the schedule calls
    // to be filled in based on the class
  }

  getInfo() {

    let content = "";

    content += JSON.stringify({
      'schedule': this.schedule,
      'etc': ''
    }, null, 2);

    content += "\n" + JSON.stringify(this.schedule_info, null, 2);

    return content;
  }

}
