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

    commands['test-create'] = (args, messageInfo) => {

      // test value
      let schedule_info = {
        'name': "test commitment!",
        'cron': "* * * * * *",
        'etc': ""
      };
      let cmt_info = messageInfo;

      let cmt = new Commitment(this, this.schedule, schedule_info, cmt_info);
      this.commitments[schedule_info['name']] = cmt;
    }

    commands['commit-create'] = (args, messageInfo) => {

      // parsing JSON arg
      this.log(args);
      let schedule_info = JSON.parse(args);
      let cmt_info = messageInfo;

      let cmt = new Commitment(this, this.schedule, schedule_info, cmt_info);
      this.commitments[schedule_info['name']] = cmt;
    }

    commands['commit-delete'] = (args, messageInfo) => {

      // test value
      // real value will be included in args
      let name = "test commitment!";

      // getting the cmt from args
      let cmt = this.commitments[name];
      // substitute with more general delete() fn?
      cmt.delete();
      delete this.commitments[name];
    }

    return commands;
  }

  addSchedule(schedule) {

    this.schedule = schedule;
    this.log("schedule added!");
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
