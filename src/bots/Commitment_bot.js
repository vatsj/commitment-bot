// imports Bot.js class as a superclass
var Bot = require("./Bot.js");

// imports class-specific resources
var rootDir = "./../..";
var bot_resources = rootDir + "/src/resources/Commitment_bot";

// importing resources
var Commitment = require(bot_resources + "/Commitment.js");

// imports resources specific to testing env
var message_test = require(rootDir + "/json/secure/message_test.json");

module.exports = class Commitment_bot extends Bot {

  // TODO: add test commitment handler
  // TODO: add scheduler

  constructor(client, logger) {

    // superclass (Bot.js) constructor
    super(client, logger);

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

    commands['commit-format'] = (args, message) => {

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

      this.speaker.say(content);
    }

    this.commands_help['commit-list'] = "lists all commitments you've set";
    commands['commit-list'] = (args, message) => {

      // return message
      let content = "Here all commitments you have active:\n";

      // adds in each commitment
      let user = message['user'];
      for (let key in this.commitments[user]) {
        content += this.commitments[user][key].getInfo_pretty();
      }

      this.speaker.say(content);
    }

    this.commands_help['commit-create'] = "creates a commitment";
    commands['commit-create'] = (args, message) => {

      // help arg clause
      if (args.trim().toLowerCase() == "help") {
        this.speaker.say("c'mon...");
        return null;
      }

      // parsing JSON arg
      this.speaker.log(args);
      let schedule_info = JSON.parse(args);
      let cmt_info = message;

      let user = cmt_info['user'];
      let name = schedule_info['name'];
      if (this.get_cmt(user, name)) {
        this.speaker.say("error: commitment already exists with the same name");
      } else{
        let cmt = new Commitment(this, this.schedule, schedule_info, cmt_info);
        this.set_cmt(user, name, cmt);

        this.speaker.say("commitment successfully created");
      }
    }

    this.commands_help['commit-delete'] = "deletes an already existing commitment";
    commands['commit-delete'] = (args, message) => {

      // help arg clause
      if (args.trim().toLowerCase() == "help") {
        this.speaker.say("c'mon...");
        return null;
      }

      let user = message['user'];
      let name = args;

      // getting the cmt from this.commitments
      let cmt = this.get_cmt(user, name);
      // let cmt = this.commitments[name];

      // substitute with more general delete() fn?
      if (cmt) {
        cmt.delete();
        this.set_cmt(user, name, null);

        this.speaker.say("commitment successfully deleted");
      } else {
        this.speaker.say("error: commitment name not found!");
      }

    }

    this.commands_help['commit-edit'] = "edits an already existing commitment";
    commands['commit-edit'] = (args, message) => {

      // help arg clause
      if (args.trim().toLowerCase() == "help") {
        this.speaker.say("c'mon...");
        return null;
      }

      let schedule_info = JSON.parse(args);
      let cmt_info = message;

      let user = cmt_info['user'];
      let name = schedule_info['name'];

      let cmt = this.get_cmt(user, name);

      if (cmt) {
        cmt.extract_edit(schedule_info);

        this.speaker.say("commitment successfully edited");
      } else {
        this.speaker.say("error: commitment name not found!");
      }

    }

    this.commands_help['commit-info'] = "gives info about an already existing commitment";
    commands['commit-info'] = (args, message) => {

      // help arg clause
      if (args.trim().toLowerCase() == "help") {
        this.speaker.say("c'mon...");
        return null;
      }

      let user = message['user'];
      let name = args;

      // getting the cmt from this.commitments
      let cmt = this.get_cmt(user, name);

      if (cmt) {
        this.speaker.say(cmt.getInfo());
      } else {
        this.speaker.say("error: commitment name not found!");
      }
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
    this.speaker.log("cmt not found");
    return null;
  }

  set_cmt(user, name, cmt) {

    // initializes the cmt dict for that person
    if (! (user in this.commitments)) {
      this.commitments[user] = {};
    }

    if (cmt) {
      this.commitments[user][name] = cmt;
    } else {
      // deletes cmt property if being set to null
      delete this.commitments[user][name];
    }

  }

  commitment_test() {

    // 'etc''s added in for ease of commenting out lines
    let scheduleInfo_test = {
      "name": "test",
      "cron": "*/5 * * * * *",
      "etc": ""
    }

    let schedule_info = JSON.stringify(scheduleInfo_test);
    // cmt_info should be a message object, not a JSON
    // let cmt_info = message_test;

    this.channel = message_test.channel;

    // let cmt = new Commitment(this, this.schedule, schedule_info, message_test);

    this.commands['CT'] = (args, message) => {

      let cmt_info = message;

      let commands = [];

      commands.push(() => {this.commands['commit-create'](schedule_info, cmt_info)});
      commands.push(() => {this.commands['commit-info']("test", cmt_info)});
      commands.push(() => {this.commands['commit-edit'](schedule_info, cmt_info)});
      commands.push(() => {this.commands['commit-delete']("test", cmt_info)});

      // this.speaker.log("commands: "+commands);
      this.stutter_exec(commands);
    }

    // auto-runs the function
    // this.commands['CT'](null, null);
  }

}
