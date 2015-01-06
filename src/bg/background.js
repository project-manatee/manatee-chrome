// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

function RememberedGrades() { }

// TODO: how do I know if they are in progress of getting new grades?
// TODO: consistent names for grades, courses, cycleObj, cycleClass, cycleClassGrades, etc.
// TODO: way to refresh the fetch in case of failure

RememberedGrades.prototype.login = function(successful, error) {
	// TODO: what if already logged in?
	var thisinstance = this;
	chrome.storage.local.get(['username', 'password'], function (item) {
		if ('username' in item && 'password' in item) {
			thisinstance.manaTEAMS = new ManaTEAMS(item.username, item.password);
			successful();
		} else {
			error({message: 'no credentials'});
		}
	});
};

RememberedGrades.prototype.updateCredentials = function(username, password, callback) {
	thisinstance = this;
	chrome.storage.local.set({
		'password': password,
		'username': username
	}, function () {
		thisinstance.manaTEAMS = new ManaTEAMS(username, password);
		callback();
	});
	// TODO: what do if login fail
};

RememberedGrades.prototype.updateGrades = function(callback) {
	// what if manateams fail
	var thisinstance = this;
	this.manaTEAMS.login(function(selectInfo) {
		thisinstance.manaTEAMS.getAllCourses(function(averagesHtml, courses) {
			// TODO: delete unused/duplicated properties
			for (var i = 0; i < courses.length; ++i) {
				// console.log('course ' + (i + 1) + ' of ' + courses.length);
				courses[i].allCycles = [];
				courseId = courses[i].courseId;
				for (var j = 0; j < courses[i].semesters.length; ++j) {
					// console.log('semester ' + (j + 1) + ' of ' + courses[i].semesters.length);
					for (var k = 0; k < courses[i].semesters[j].cycles.length; ++k) {
						// console.log('cycle ' + (k + 1) + ' of ' + courses[i].semesters[j].cycles.length);
						courses[i].semesters[j].cycles[k].courseId = courseId;
						courses[i].semesters[j].cycles[k].semesterId = j;
						courses[i].semesters[j].cycles[k].cycleId = k;
						// the following stores a copy of courses[i].semesters[j].cycles[k] and puts in allCycles array
						courses[i].allCycles.push($.extend(true, {}, courses[i].semesters[j].cycles[k]));
						courses[i].time = Date.now();
					}
				}
			}
			chrome.storage.local.set({
				'averagesHtml': averagesHtml,
				'courses': courses
			});
			callback(courses);
		});
	});
};

RememberedGrades.prototype.updateAll = function (callback) {
	var thisinstance = this;
	this.updateGrades(function (courses) {
			for (var i = 0; i < courses.length; ++i) {
				for (var j = 0; j < courses[i].semesters.length; ++j) {
					for (var k = 0; k < courses[i].semesters[j].cycles.length; ++k) {
						thisinstance.updateCycleGrades(courses[i].courseId, j, k, function (f) { callback(); });
					}
				}
			}
	});
};

RememberedGrades.prototype.updateCycleGrades = function(course, semester, cycle, callback) {
	var thisinstance = this;
	// TODO: used cached averages html
	this.manaTEAMS.login(function(selectInfo) {
		thisinstance.manaTEAMS.getAllCourses(function(html, courses) {
			thisinstance.manaTEAMS.getCycleClassGrades(course, cycle, semester, html, function (cycleGrades) {
				chrome.storage.local.get(['cycleObj'], function(item) {
					var newCycleObj = {};
					newCycleObj[course] = {};
					newCycleObj[course][semester] = {};
					newCycleObj[course][semester][cycle] = cycleGrades;
					newCycleObj[course][semester][cycle].time = (new Date()).toTimeString();
					$.extend(true, newCycleObj, item.cycleObj, newCycleObj);
					// TODO: when RememberedGrades.updateCycleGrades is called from
					//       loop (as in RememberedGrades.updateAll), do this once at the
					//       end, rather than every iteration
					chrome.storage.local.set({
						'cycleObj': newCycleObj
					});
					// TODO: make this add to courses.allcycles instead of cycleObj
					callback(cycleGrades);
				});
			});
		});
	});
};

RememberedGrades.prototype.getGrades = function(callback) {
	var thisinstance = this;
	chrome.storage.local.get('courses', function(item) {
		grades = item.courses;
		if (grades) {
			callback(grades, false); // callback immediately with old data, if possible
		}
	});
	thisinstance.updateGrades(function (grades) {
		callback(grades, true); // callback later with new data
	});
};

RememberedGrades.prototype.getCycleGrades = function (course, semester, cycle, callback) {
	chrome.storage.local.get(['cycleObj'], function(item) {
		cycleGrades = item.cycleObj[course][semester][cycle];
		if (cycleGrades) {
			callback(cycleGrades); // callback immediately with old data, if possible
		}
	});
	this.updateCycleGrades(course, semester, cycle, function (cycleGrades) {
		callback(cycleGrades);
	}); // callback later with new data
};

RememberedGrades.prototype.logout = function (callback) {
	// TODO: clear cookies
	chrome.storage.local.clear(function() {
		updateCredentials('', '');
		callback();
	});
};

RememberedGrades.prototype.isLoggedIn = function (callback) {
	callback(this.manaTEAMS.isLoggedIn);
	// TODO: what if login fails
};

rememberedGrades = new RememberedGrades();
rememberedGrades.login(function () {
	// rememberedGrades.updateGrades(function () {
	// 	console.log('hi');
	// });
	// rememberedGrades.updateCycleGrades("6914.R140.X", 0, 0, function (data) {
	// 	console.log(data);
	// });

	// rememberedGrades.getGrades(function(data) {
	// 	console.log(data);
	// });
	// rememberedGrades.getCycleGrades("6914.R140.X", 0, 0, function (data) {
	// 	console.log(data);
	// });
	
	rememberedGrades.updateAll(function(){});
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
