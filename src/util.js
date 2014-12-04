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
					for (var i = 0; i < courses.length; ++i) {
						console.log(courses);
						courses[i].allCycles = [];
						courseId = courses[i].courseId;
						for (var j = 0; j < courses[i].semesters.length; ++j) {
							for (var k = 0; k < courses[i].semesters[j].cycles.length; ++k) {
								courses[i].semesters[j].cycles[k].courseId = courseId;
								courses[i].semesters[j].cycles[k].semesterId = j;
								courses[i].semesters[j].cycles[k].cycleId = k;

								// the following stores a copy of courses[i].semesters[j].cycles[k] and puts in allCycles array
								courses[i].allCycles.push($.extend(true, {}, courses[i].semesters[j].cycles[k]));
							}
						}
					}
					chrome.storage.local.set({'courses': courses});
					callback(courses);
				});
			});
		});
	};

	this.getCycleGrades = function (course, semester, cycle, callback) {
		chrome.storage.local.get(['username', 'password'], function (item) {
			if (!('username' in item && 'password' in item)) {
				return;
			}
			var manaTEAMS = new ManaTEAMS(item.username, item.password);
			manaTEAMS.login(function(selectInfo) {
				manaTEAMS.getAllCourses(function(html, courses) {
					cycleGrades = manaTEAMS.getCycleClassGrades(couse, cycle, semester, html);
					callback(cycleGrades);
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
