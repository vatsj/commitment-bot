// imports Bot.js class as a superclass
let Bot = require("./Bot.js");

// imports class-specific resources
let rootDir = "./../..";
let bot_resources = rootDir + "/src/resources/Commitment_bot";

// importing resources
let Commitment = require(bot_resources + "/Commitment.js");

// imports resources specific to testing env
let message_test = require(rootDir + "/json/secure/message_test.json");

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

    super.initCommands();

    // setting up an example commitment
    let commit_example = {
      "name": "[COMMITMENT NAME]",
      "description": "[BRIEF DESCRIPTION OF THE COMMITMENT]",
      "time": "[TIME INTERVAL FOR COMPLETION]",
      "etc": ""
    };
    let commit_example_pretty = JSON.stringify(commit_example, null, 2);

    this.commandHandler.addCommand({
      'keyword': 'commit-list',
      'description': 'lists all commitments you\'ve set',
      'example': '!commit-list',
      'fn': (args, message) => {
        // return message
        let content = "Here's a list of all commitments you have active:\n";

        // adds in each commitment
        let user = message['user'];
        for (let key in this.commitments[user]) {
          content += this.commitments[user][key].getInfo_pretty();
        }

        this.speaker.say(content);
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-create',
      'description': 'creates a commitment',
      'example': `!commit-create ${commit_example_pretty}`,
      'fn': (args, message) => {
        // parsing JSON arg
        this.speaker.log(args);
        let schedule_info = JSON.parse(args);
        let base_message = message;

        let user = base_message['user'];
        let name = schedule_info['name'];
        if (this.get_cmt(user, name)) {
          this.speaker.say("error: commitment already exists with the same name");
        } else {
          let cmt = new Commitment(this, this.schedule, schedule_info, base_message);
          this.set_cmt(user, name, cmt);

          this.speaker.say("commitment successfully created");
        }
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-delete',
      'description': 'deletes an already existing commitment',
      'example': `!commit-delete ${commit_example['name']}`,
      'fn': (args, message) => {
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
    });



    this.commandHandler.addCommand({
      'keyword': 'commit-edit',
      'description': 'edits an already existing commitment',
      'example': `!commit-edit ${commit_example_pretty}`,
      'fn': (args, message) => {
        let schedule_info = JSON.parse(args);
        let base_message = message;

        let user = base_message['user'];
        let name = schedule_info['name'];

        let cmt = this.get_cmt(user, name);

        if (cmt) {
          cmt.extract_edit(schedule_info);

          this.speaker.say("commitment successfully edited");
        } else {
          this.speaker.say("error: commitment name not found!");
        }
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-info',
      'description': 'gives info about an already existing commitment',
      'example': `!commit-info ${commit_example['name']}`,
      'fn': (args, message) => {
        let user = message.user;
        let name = args;

        // getting the cmt from this.commitments
        let cmt = this.get_cmt(user, name);

        if (cmt) {
          this.speaker.say(cmt.getInfo());
        } else {
          this.speaker.say("error: commitment name not found!");
        }
      }
    });

    // return commands;
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
    // base_message should be a message object, not a JSON
    // let base_message = message_test;

    this.channel = message_test.channel;

    // let cmt = new Commitment(this, this.schedule, schedule_info, message_test);

    this.commandHandler.addCommand({
      'keyword': 'CT',
      'description': 'auto-tests all the commit-[] commands',
      'example': '!CT',
      'fn': (args, message) => {
        let base_message = message;

        let commands = [];
  
        commands.push(() => {this.commands['commit-create'](schedule_info, base_message)});
        commands.push(() => {this.commands['commit-info']("test", base_message)});
        commands.push(() => {this.commands['commit-edit'](schedule_info, base_message)});
        commands.push(() => {this.commands['commit-delete']("test", base_message)});

        // this.speaker.log("commands: "+commands);
        this.stutter_exec(commands);
      }
    });
  }

}
