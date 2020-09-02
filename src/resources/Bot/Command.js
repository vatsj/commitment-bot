// stores commands, referenced by keywords in the bot
module.exports = class Command {

  constructor(keyword, description, examples, fn) {

    this.keyword = keyword;
    this.description = description;

    // this.examples = [];
    // this.examples.push(examples);

    // handles multiple examples
    if (Array.isArray(examples)) {
      this.examples = examples;
    } else {
      // converts to a 1-element array
      this.examples = [];
      this.examples.push(examples);
    }

    // fn(keyword, args)
    this.fn = fn;

  }

  help(examples = true) {
    let content = `**${this.keyword}**: ${this.description} \n`

    if (examples) {
      content += "Example commands: \n";
      for (let i = 0; i < this.examples.length; i++) {
        let example = this.examples[i];
        content += `\`${example}\` \n`;

        // for spacing
        content += `~ \n`
      }
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
