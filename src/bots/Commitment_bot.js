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

  // returns true iff the command succeeds
  createCommitment(args_info, base_message) {
    let user = base_message.author;
    let name = args_info['name'];

    if (this.get_cmt(user, name)) {
      this.speaker.say("error: commitment already exists with the same name");
    } else {
      let cmt = new Commitment(this, args_info, base_message);
      this.set_cmt(user, name, cmt);

      this.speaker.say("commitment successfully created");
    }
  }

  deleteCommitment(name, base_message) {
    let user = base_message.author;

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

  initCommands() {

    super.initCommands();

    // setting up an example commitment
    let commit_genericExample = {
      "name": "[COMMITMENT NAME]",
      "description": "[BRIEF DESCRIPTION OF THE COMMITMENT]",
      "recurring": "[`true` IF THE COMMITMENT IS RECURRING, `false` OTHERWISE]",
      "time": "[TIME INTERVAL FOR COMPLETION]",
      "etc": ""
    };
    this.commit_genericExample = commit_genericExample;
    let commit_genericExample_pretty = JSON.stringify(commit_genericExample, null, 2);

    let commit_realExample = {
      "name": "example",
      "description": "an example of the commitment command syntax",
      "recurring": "true",
      "time": "2 days",
      "etc": ""
    };
    this.commit_realExample = commit_realExample;
    let commit_realExample_pretty = JSON.stringify(commit_realExample, null, 2);

    this.commandHandler.addCommand({
      'keyword': 'commit-list',
      'description': 'lists all commitments you\'ve set',
      'examples': '!commit-list',
      'fn': (args, message) => {
        // return message
        let content = "Here's a list of all commitments you have active:\n";

        // adds in each commitment
        let user = message.author;
        for (let key in this.commitments[user]) {
          content += this.commitments[user][key].getInfo_pretty();
        }

        this.speaker.say(content);
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-create',
      'description': 'creates a commitment',
      'examples': [
        `!commit-create ${commit_genericExample_pretty}`,
        `!commit-create ${commit_realExample_pretty}`
      ],
      'fn': (args, message) => {
        // parsing JSON arg
        // this.speaker.log(args);
        let args_info = JSON.parse(args);
        let base_message = message;

        this.createCommitment(args_info, base_message);
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-delete',
      'description': 'deletes an already existing commitment',
      'examples': [
        `!commit-delete ${commit_genericExample['name']}`,
        `!commit-delete ${commit_realExample['name']}`
      ],
      'fn': (args, message) => {
        let name = args;
        this.deleteCommitment(name, message);
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-fulfill',
      'description': 'fulfills the inputted commitment',
      'examples': [
        `!commit-fulfill ${commit_genericExample['name']}`,
        `!commit-fulfill ${commit_realExample['name']}`
      ],
      'fn': (args, message) => {
        let user = message.author;
        let name = args;

        // getting the cmt from this.commitments
        let cmt = this.get_cmt(user, name);
        // let cmt = this.commitments[name];

        // substitute with more general delete() fn?
        if (cmt) {
          // will display its own message, don't need a confirmation
          cmt.fulfill();
        } else {
          this.speaker.say("error: commitment name not found!");
        }
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-edit',
      'description': 'edits an already existing commitment',
      'examples': [
        `!commit-edit ${commit_genericExample_pretty}`,
        `!commit-edit ${commit_realExample_pretty}`
      ],
      'fn': (args, message) => {
        let args_info = JSON.parse(args);
        let base_message = message;

        let user = base_message.author;
        let name = args_info['name'];

        let cmt = this.get_cmt(user, name);

        if (cmt) {
          cmt.extract_edit(args_info);

          this.speaker.say("commitment successfully edited");
        } else {
          this.speaker.say("error: commitment name not found!");
        }
      }
    });

    this.commandHandler.addCommand({
      'keyword': 'commit-info',
      'description': 'gives info about an already existing commitment',
      'examples': [
        `!commit-info ${commit_genericExample['name']}`,
        `!commit-info ${commit_realExample['name']}`
      ],
      'fn': (args, message) => {
        let user = message.author;
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

  setSchedule(schedule) {
    Commitment.setSchedule(schedule)
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

    // otherwise, return null
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
    let argsInfo_test = this.commit_realExample;

    let args_info = JSON.stringify(argsInfo_test);
    // base_message should be a message object, not a JSON
    // let base_message = message_test;

    this.channel = message_test.channel;

    // let cmt = new Commitment(this, args_info, message_test);

    this.commandHandler.addCommand({
      'keyword': 'CT',
      'description': 'auto-tests all the commit-[] commands',
      'examples': '!CT',
      'fn': (args, message) => {
        let base_message = message;

        let fns = [];

        fns.push(() => {this.commandHandler.execute_cmd('commit-create', args_info, base_message)});
        fns.push(() => {this.commandHandler.execute_cmd('commit-list', "", base_message)});
        fns.push(() => {this.commandHandler.execute_cmd('commit-info', argsInfo_test['name'], base_message)});
        fns.push(() => {this.commandHandler.execute_cmd('commit-edit', args_info, base_message)});
        fns.push(() => {this.commandHandler.execute_cmd('commit-fulfill', argsInfo_test['name'], base_message)});
        fns.push(() => {this.commandHandler.execute_cmd('commit-delete', argsInfo_test['name'], base_message)});

        // this.speaker.log("commands: "+commands);
        this.stutter_exec(fns);
      }
    });
  }

}
