function Clock(delay, callback, name) {
	this.callback = callback;
	this.delay = delay;
	this.id = name;

	chrome.alarms.onAlarm.addListener(function(alarm) {
		if (alarm.name === this.id) {
			this.callback();
		}
	});
	
	chrome.alarms.create(this.id, {
		"when": 0, // fire immediately at first
		"periodInMinutes": this.delay // then periodically
	});
}

function RememberedGrades() {
	this.updateCredentials = function (username, password) {
		this.username = username;
		this.password = password;
		chrome.storage.local.set({'password': password});
		chrome.storage.local.set({'username': username});
	};
	
	this.updateGrades = function (callback) {
		chrome.storage.local.get(['username', 'password'], function (item) {
			if (!('username' in item && 'password' in item)) {
				return;
			}
			var manaTEAMS = new ManaTEAMS(item.username, item.password);
			manaTEAMS.login(function(selectInfo) {
				manaTEAMS.getAllCourses(function(html, courses) {
					chrome.storage.local.set({'courses': courses});
					callback(courses);
				});
			});
		});
	};

	this.getGrades = function (callback) {
		chrome.storage.local.get('courses', function (item) {
			if (! ('courses' in item)) {
				return;
			}
			callback(item.courses);
		});
	};
}
var rememberedGrades = new RememberedGrades();
