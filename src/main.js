// code heavily based on the following source:
// https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

let rootDir = "./..";
let node_modules_dir = rootDir + "/node_modules"
let bots_dir = rootDir + "/src/bots";
let resources_dir

// import npm resources
let Discord = require('discord.js');
let logger = require('winston');
let schedule = require('node-schedule');

// import json files
let auth = require(rootDir + '/json/secure/auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Importing bot classes
let Bot = require(bots_dir + "/Bot.js");
let C_bot = require(bots_dir + "/Commitment_bot.js");

// Initialize Discord Bot
let client = new Discord.Client();
client.login(auth.token);

// uses Bot class, to eventually be moved to Commitment-bot
// let bot = new Bot(client, logger);
let c_bot = new C_bot(client, logger);
c_bot.addSchedule(schedule);
