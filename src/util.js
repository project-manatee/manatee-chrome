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
		updated = false;
		chrome.storage.local.get(['username', 'password'], function (item) {
			if (!('username' in item && 'password' in item)) {
				return;
			}
			console.log('1');
			var manaTEAMS = new ManaTEAMS(item.username, item.password);
			console.log('2');
			manaTEAMS.login(function(selectInfo) {
				manaTEAMS.getAllCourses(function(html, courses) {
					chrome.storage.local.set('courses', courses);
					callback(courses);
					updated = true;
				});
			});
		});
		return updated;
	};

	this.getGrades = function (callback) {
		success = false;
		chrome.storage.local.get('courses', function (item) {
			if (! ('courses' in item)) {
				return;
			}
			callback(item.courses);
			success = true;
		});
		return success;
	};
}

a = new RememberedGrades();

a.updateGrades(function (courses) {
	console.log('courses?');
	console.log(courses);
});
