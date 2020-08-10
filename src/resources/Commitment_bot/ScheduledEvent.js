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

  extract_edit(edit_info) {

    let schedule_info = this.schedule_info;

    // overwriting object info with edit info
    for (let key in schedule_info) {
      if (key in edit_info) {
        schedule_info[key] = edit_info[key];
      }
    }

    this.extract_schedule_info(schedule_info);
    this.reschedule_event();
  }

  // add time2cron method!

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

  reschedule_event() {
    this.unschedule_event();
    this.schedule_event();
  }

  event() {
    // the thing the schedule calls
    // to be filled in based on the class
  }

  getInfo() {

    let content = "";

    let misc_info = {
      'schedule': this.schedule,
      'etc': ''
    }
    content += JSON.stringify(misc_info, null, 2);

    content += "\n" + JSON.stringify(this.schedule_info, null, 2);

    return content;
  }

}
