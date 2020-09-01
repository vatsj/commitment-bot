var events = require('events');
var EventEmitter = events.EventEmitter;

module.exports = class ScheduledEvent extends EventEmitter {

  // what goes in constructor --> what info is passed in?
  constructor(listener) {
    super();

    // records listener fn
    this.listener = listener;

    // schedules event
    this.listener_on(listener);

  }


  // does # of args matter?

  // since we don't know the scheduling format
  listener_on(listener = this.listener) {
    this.addListener('scheduled_evt', listener);
  }

  listener_off(listener = this.listener) {
    this.removeListener('scheduled_evt', listener);
  }

  // reschedule_event(arg) {
  //   this.unschedule_event();
  //   this.schedule_event(arg);
  // }

  // delete() {
  //   // should this be here or in both subclasses?
  //   this.listener_off();
  //   // call finalize (destructor) method?
  // }

  // test method
  getInfo() {

    let content = this.listener.toString();
    return content;
  }

}
