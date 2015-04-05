// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
function sleep (seconds) {
    var start = new Date().getTime();
    while (new Date() < start + seconds*1000) {}
    return 0;
}
rememberedGrades = new RememberedGrades();
console.log(rememberedGrades);
//rememberedGrades.loginCache(function() { console.log('success'); }, function(msg) { console.log(msg); });
rememberedGrades.loginCache(function() { }, function(msg) { });
chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Got an alarm!", alarm);
   rememberedGrades.updateGrades(true,function(courses) {
    });
});





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
