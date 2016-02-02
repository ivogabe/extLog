var color = {
	"reset": "\u001b[0m",
	"bold": "\u001b[1m",

	"foreground": {
		"black": "\u001b[30m",
		"red": "\u001b[31m",
		"green": "\u001b[32m",
		"yellow": "\u001b[33m",
		"blue": "\u001b[34m",
		"magenta": "\u001b[35m",
		"cyan": "\u001b[36m",
		"white": "\u001b[37m",
		"default": "\u001b[39m"
	},
	"background": {
		"black": "\u001b[40m",
		"red": "\u001b[41m",
		"green": "\u001b[42m",
		"yellow": "\u001b[43m",
		"blue": "\u001b[44m",
		"magenta": "\u001b[45m",
		"cyan": "\u001b[46m",
		"white": "\u001b[47m",
		"default": "\u001b[49m"
	}
}

var levels = {
	debug: {
		short: "DBUG",
		color: color.foreground.cyan,
		order: 0
	},
	info: {
		short: "INFO",
		color: color.foreground.green,
		order: 1
	},
	counter: {
		short: "#CNT",
		color: color.foreground.yellow,
		order: 2
	},
	warning: {
		short: "WARN",
		color: color.foreground.magenta,
		order: 3
	},
	error: {
		short: "ERR!",
		color: color.foreground.red,
		order: 4
	},
	fatal: {
		short: "####",
		color: color.foreground.red,
		order: 5
	}
};

var lastTime = null;

var month = [
	"Jan.",
	"Feb.",
	"Mar.",
	"Apr.",
	"May ",
	"Jun.",
	"Jul.",
	"Aug.",
	"Sep.",
	"Oct.",
	"Nov.",
	"Dec."
];

function log(logger, level, message_args) {
	if (typeof level == "string") {
		level = levels[level];
	}

	if (level.order < (logger.minLevel != null ? logger.minLevel : ExtLog.minLevel)) {
		return false;
	}

	var time = new Date();

	message_args.forEach(function(msg, idx){
		if (typeof msg == "string") {
			if(idx == 0){
				consoleLine(logger, level, msg, time, false);
			}
			else{
				consoleLine(logger, level, msg, time, true);
			}

		}
		else if (typeof msg == "function") {
			consoleLine(logger, level, msg.toString(), time, true);
		}
		else {

			// JSON
			var json = ""
			try{
				json = JSON.stringify(msg, undefined, 4);
				json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
					var clr = color.foreground.green; // number
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							clr = color.foreground.magenta; // key
						} else {
							clr = color.foreground.green; // string
						}
					} else if (/true|false/.test(match)) {
						clr = color.foreground.blue; // boolean
					} else if (/null/.test(match)) {
						clr = color.foreground.blue; // null
					}
					return clr+match+color.reset;
				});
			}
			catch(e){
				if (require != null){
					var util = require("util")
					json = util.inspect(msg, false, null, true)
				}
				else{
					consoleLine(logger, level, util.inspect(e), time, true);
					return;
				}
			}
			consoleLine(logger, level, json, time, true);
		}
	})
}

function consoleLine(logger, level, str, time, isMsg) {
	if (str.match(/\r\n|\r|\n/)) {
		var arr = str.split(/\r\n|\r|\n/g);
		for (var i in arr) {
			consoleLine(logger, level, arr[i], time, isMsg);
		}
		return true;
	}

	var day = ("0" + time.getDate()).substr(-2);
	var hour = ("0" + time.getHours()).substr(-2);
	var minutes = ("0" + time.getMinutes()).substr(-2);
	var seconds = ("0" + time.getSeconds()).substr(-2);

	(logger.nativeFunction || ExtLog.nativeFunction || console.log)(
		color.reset + month[time.getMonth()] + day + " " + time.getFullYear() + " " + hour + ":" + minutes + ":" + seconds + " "
		+ color.reset + color.background[logger.color] + color.foreground.white + " "
		+ color.reset + color.background.black + color.foreground.white
		+ logger.nameLog
		+ color.reset + " "
		+ color.background.black + level.color + (isMsg ? '····' : level.short)
		+ color.reset + " " + str
		);
}




// EXTLOG
var ExtLog = function(name, color) {
	this.name = name;
	this.color = color;
	this.nativeFunction = null;
	this.nameLog = this.name.substring(0,8);
	this.nameLog = (new Array(9 - this.nameLog.length)).join(" ") + this.nameLog;
	this.minLevel = null;
}

ExtLog.minLevel = 0;
ExtLog.color = color;
ExtLog.levels = levels;

ExtLog.prototype.debug = function() {
	var message_args = Array.prototype.slice.call(arguments, 0);
	log(this, "debug", message_args);
}

ExtLog.prototype.info = function() {
	var message_args = Array.prototype.slice.call(arguments, 0);
	log(this, "info", message_args);
}

ExtLog.prototype.warning = function() {
	var message_args = Array.prototype.slice.call(arguments, 0);
	log(this, "warning", message_args);
}

ExtLog.prototype.error = function() {
	var message_args = Array.prototype.slice.call(arguments, 0);
	log(this, "error", message_args);
}

ExtLog.prototype.fatal = function() {
	var message_args = Array.prototype.slice.call(arguments, 0);
	log(this, "fatal", message_args);
}

ExtLog.prototype.counter = function() {
	var message_args = Array.prototype.slice.call(arguments, 0);
	log(this, "counter", message_args);
}

ExtLog.prototype.setMinLevel = function(level) {
	if (level == null) {
		this.minLevel = null;
		return true;
	}
	switch (typeof level) {
		case "string":
			level = levels[level];
		case "object":
			level = level.order;
		case "number":
			this.minLevel = level;
	}
}

ExtLog.prototype.getCounter = function(title, time) {
	return new Counter(this, title, time);
}

// STATIC
ExtLog.setMinLevel = function(level) {
	if (level == null) {
		ExtLog.minLevel = 0;
		return true;
	}
	switch (typeof level) {
		case "string":
			level = levels[level];
		case "Object":
			level = level.order;
		case "number":
			ExtLog.minLevel = level;
	}
}




// COUNTER
var Counter = function(logger, title, time) {
	this.logger = logger;
	this.title = title;
	this.count = 0;
	this.time = time;

	this.interval = null;

	this.startTime = new Date().getTime();
}

Counter.prototype.setInterval = function() {
	if (this.interval) clearTimeout(this.interval);

	var intervalTime = this.time - (new Date().getTime() - this.startTime) % this.time;

	var _this = this;
	this.interval = setTimeout(function() {
		if (_this.count != 0) {
			_this.logger.counter(_this.title + " " + color.bold + color.foreground.cyan + _this.count + color.reset);
		}
		_this.count = 0;
		_this.interval = null;
	}, intervalTime);
}

Counter.prototype.add = function() {
	this.count++;

	if (!this.interval) {
		this.setInterval();
	}
}

module.exports = ExtLog;
