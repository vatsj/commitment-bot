// imports winston, for log() method
const winston = require('winston');

// for newline characters (not working)
const os = require('os');

const fs = require('fs');

// constant determining what logging methods to use
const LOCAL_TESTING = false;

module.exports = class Speaker {

  constructor(client, logPath) {

    this.client = client;

    // determines log and error transports based on LOCAL_TESTING
    let log_transport;
    let error_transport;
    if (LOCAL_TESTING) {
      log_transport = new winston.transports.Console();
      error_transport = log_transport;
    } else {
      // let log_path = "log.txt";
      // let error_path = "error.txt";

      let log_path = logPath + "/log.txt";
      let error_path = logPath + "/error.txt";

      // console.log("log path: "+log_path);

      // clear files
      fs.writeFile(log_path, '', () => {});
      fs.writeFile(error_path, '', () => {});

      // build transports to those files
      log_transport = new winston.transports.File({
        filename: log_path
      });
      error_transport = new winston.transports.File({
        filename: error_path
      });
    }

    // creates loggers
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [log_transport]
    });
      this.error_logger = winston.createLogger({
      level: 'error',
      format: winston.format.json(),
      transports: [error_transport, log_transport]
    });
  }

  setDefaultChannel(channel) {
    this.channel_default = channel;
  }

  // speaker methods
  say(content, channel = this.channel_default) {
    channel.send(content);
  }

  log(content) {
    this.logger.log({
      level: 'info',
      message: content
    });
  }

  // test method; logs and says content
  shout(content) {
    this.log(content);
    this.say(content);
  }

  throwError(e) {

    let errorMsg = `${e.toString()}
    stackTrace: ${e.stack}
    `;
    // errorMsg = errorMsg.replace(/\n/g, os.EOL);

    this.error_logger.log({
      level: 'error',
      message: errorMsg
    });
  }

  // might be easy in Discord.js, which would render this fn unnecessary
  tag(user) {
    let tag = user.toString();
    return tag;
  }

}
