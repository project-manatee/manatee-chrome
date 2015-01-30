// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

rememberedGrades = new RememberedGrades();
rememberedGrades.loginCache(function() { }, function(msg) { });

// TODO: this
// function Clock(delay, callback, name) {
// 	this.callback = callback;
// 	this.delay = delay;
// 	this.id = name;

// 	chrome.alarms.onAlarm.addListener(function(alarm) {
// 		if (alarm.name === this.id) {
// 			this.callback();
// 		}
// 	});

// 	chrome.alarms.create(this.id, {
// 		"when": 0, // fire immediately at first
// 		"periodInMinutes": this.delay // then periodically
// 	});
// }
