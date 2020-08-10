// imports Bot.js class as a superclass
var Bot = require("./Bot.js");

// imports class-specific resources
var rootDir = "./../..";
var bot_resources = rootDir + "/src/resources/Commitment_bot";

// importing resources
var Commitment = require(bot_resources + "/Commitment.js");

// imports resources specific to testing env
var messageInfo_test = require(rootDir + "/json/secure/messageInfo_test.json");

module.exports = class Commitment_bot extends Bot {

  // TODO: add test commitment handler
  // TODO: add scheduler

  constructor(discordBot, logger) {

    // superclass (Bot.js) constructor
    super(discordBot, logger);

    // TODO: add stuff for commitments/scheduling?
    // JSON storing commitments
    // stored in form {person: {name: [Commitment]}}
    this.commitments = {};

    // TESTING: running test fn after 1 second
    setTimeout(() => {
      // this.commitment_test();
    }, 1000);
  }

  // returns identity of Bot
  // used to test subclass method overwriting
  identity() {
    return "Commitment_bot (can record and track commitments)";
  }

  initCommands() {

    let commands = super.initCommands();

    // TODO: add more commands (specific to C_bot)

    commands['commit-format'] = (args, messageInfo) => {

      // return message
      let content = "Use the following command to generate a commitment:\n";

      // adds in the example command
      content += "!commit-create ";

      let scheduleInfo_example = {
        "name": "[COMMITMENT NAME]",
        "time": "[TIME INTERVAL FOR COMPLETION]",
        "etc": ""
      };

      content += JSON.stringify(scheduleInfo_example, null, 2);

      this.say(content);
    }

    commands['commit-create'] = (args, messageInfo) => {

      // parsing JSON arg
      this.log(args);
      let schedule_info = JSON.parse(args);
      let cmt_info = messageInfo;

      let cmt = new Commitment(this, this.schedule, schedule_info, cmt_info);

      let user = cmt_info['user'];
      let name = schedule_info['name'];
      this.set_cmt(user, name, cmt);
    }

    commands['commit-delete'] = (args, messageInfo) => {

      let user = messageInfo['user'];
      let name = args;

      // getting the cmt from this.commitments
      let cmt = this.get_cmt(user, name);
      // let cmt = this.commitments[name];

      // substitute with more general delete() fn?
      cmt.delete();
      this.set_cmt(user, name, null);
    }

    commands['commit-edit'] = (args, messageInfo) => {

      let schedule_info = JSON.parse(args);
      let cmt_info = messageInfo;

      let user = cmt_info['user'];
      let name = schedule_info['name'];

      let cmt = this.get_cmt(user, name);
      cmt.extract_edit(schedule_info);
      // this.commitments[schedule_info['name']] = cmt;

    }

    // currently broken; JSON contains itself
    commands['commit-info'] = (args, messageInfo) => {

      let user = messageInfo['user'];
      let name = args;

      // getting the cmt from this.commitments
      let cmt = this.get_cmt(user, name);

      this.say(cmt.getInfo());
    }

    return commands;
  }

  addSchedule(schedule) {

    this.schedule = schedule;
  }

  get_cmt(user, name) {

    // searches for commitment, returns if found
    if (user in this.commitments) {
      if (name in this.commitments[user]) {
        let cmt = this.commitments[user][name];

        if (cmt) {
          return cmt;
        }
      }
    }

    // otherwise, throw an error
    this.log("commitment not found!");
  }

  set_cmt(user, name, cmt) {

    // initializes the cmt dict for that person
    if (! (user in this.commitments)) {
      this.commitments[user] = {};
    }

    this.commitments[user][name] = cmt;
  }

  commitment_test() {

    // 'etc''s added in for ease of commenting out lines
    let scheduleInfo_test = {
      'name': "test commitment!",
      'cron': "* * * * * *",
      'etc': ""
    }
    let cmt = new Commitment(this, this.schedule, scheduleInfo_test, messageInfo_test);

    this.commands['CT'] = () => {

      this.log(cmt.getInfo());

      cmt.onSuccess();
    }
  }

}
