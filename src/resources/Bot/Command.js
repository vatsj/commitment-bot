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
    let content = `**${this.keyword}**: ${this.description} \n`

    if (example) {
      content += `*Example Command:* \`${this.example}\` \n`;
    }

    // return help message
    return content;
  }

  // if args == "help", gives help msg and returns true
  help_check(args) {

    // if help is first arg, then
    if (args.trim().toLowerCase() == "help") {
      return this.help(true);
    }

    return false;
  }

}
