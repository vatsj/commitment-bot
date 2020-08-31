// stores commands, referenced by keywords in the bot
module.exports = class Command {

  constructor(keyword, description, example, fn) {

    this.keyword = keyword;
    this.description = description;
    this.example = example;

    // fn(keyword, args)
    this.fn = fn;

  }

  help(example = true) {
    let content = `**${cmd}**: ${this.commands_help[cmd]}`

    if (example) {
      content += `*Example Command:* ${this.commands_example[cmd]}`;
    }

    // return help message
    return content;
  }

  // if args == "help", gives help msg and returns true
  help_check(args) {

    // if help cmd, then
    if (args.trim().toLowerCase() == "help") {
      return help(true);
    }

    return false;
  }

}
