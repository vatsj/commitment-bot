// code heavily based on the following source:
// https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

var rootDir = "./..";
var node_modules_dir = rootDir + "/node_modules"
var bots_dir = rootDir + "/src/bots";

var Discord = require(node_modules_dir + '/discord.io');
var logger = require(node_modules_dir + '/winston');
var auth = require(rootDir + '/json/secure/auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// requires my Bot class
// var Bot = require(bots_dir + "/Bot.js");
var C_bot = require(bots_dir + "/Commitment_bot.js");

// Initialize Discord Bot
var discordBot = new Discord.Client({
   token: auth.token,
   autorun: true
});

// uses Bot class, to eventually be moved to Commitment-bot
// var bot = new Bot(discordBot, logger);
var c_bot = new C_bot(discordBot, logger);
