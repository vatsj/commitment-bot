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
      this.commitment_test();
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

    return commands;
  }

  addSchedule(schedule) {

    this.schedule = schedule;
    this.log("schedule added!");
  }

  commitment_test() {

    // 'etc''s added in for ease of commenting out lines
    let cmtInfo_test = {
      'name': "test commitment!",
      'cron': "* * * * * *",
      'etc': ""
    }
    let cmt = new Commitment(this, this.schedule, messageInfo_test, {});

    this.commands['CT'] = () => {

      // this.log(""+cmt.getInfo());

      cmt.onSuccess();
    }
  }

}
