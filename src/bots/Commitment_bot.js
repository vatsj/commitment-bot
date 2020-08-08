// imports Bot.js class as a superclass
var Bot = require("./Bot.js");

module.exports = class Commitment_bot extends Bot {

  // TODO: add test commitment handler
  // TODO: add scheduler

  constructor(discordBot, logger) {

    // superclass (Bot.js) constructor
    super(discordBot, logger);

    // TODO: add stuff for commitments/scheduling?
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

}
