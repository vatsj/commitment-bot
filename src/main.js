// code heavily based on the following source:
// https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

let rootDir = "./..";
let resources_dir = rootDir + "/src/resources/main";
let node_modules_dir = rootDir + "/node_modules";
let bots_dir = rootDir + "/src/bots";

// import npm resources
let Discord = require('discord.js');
let Speaker = require(resources_dir + "/Speaker.js");
let schedule = require('node-schedule');

// import json files
let auth = require(rootDir + '/json/secure/auth.json');

// Importing bot classes
let Bot = require(bots_dir + "/Bot.js");
let C_bot = require(bots_dir + "/Commitment_bot.js");

// Initialize Discord Bot
let client = new Discord.Client();
client.login(auth.token);

// defines speaker using logger
let logPath = "./logs";
let speaker = new Speaker(client, logPath);

// uses Bot class, to eventually be moved to Commitment-bot
// let bot = new Bot(client, logger);
let c_bot = new C_bot(client, speaker);
c_bot.setSchedule(schedule);
