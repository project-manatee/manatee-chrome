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
var manaTEAMS;

function RememberedGrades() {}

RememberedGrades.prototype.updateCredentials = function(username, password) {
    this.username = username;
    this.password = password;
    chrome.storage.local.set({
        'password': password
    });
    chrome.storage.local.set({
        'username': username
    });
};

RememberedGrades.prototype.updateGrades = function(callback) {
    chrome.storage.local.get(['username', 'password'], function(item) {
        if (!('username' in item && 'password' in item)) {
            return;
        }
        manaTEAMS = new ManaTEAMS(item.username, item.password);
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
                chrome.storage.local.set({
                    'averagesHtml': html
                });
                chrome.storage.local.set({
                    'courses': courses
                });
                callback(courses);
            });
        });
    });
};



RememberedGrades.prototype.getCycleGrades = function(course, semester, cycle, callback) {
    chrome.storage.local.get(['username', 'password', 'averagesHtml'], function(item) {
        if (!('username' in item && 'password' in item)) {
            return;
        }
        if (!manaTEAMS) {
            manaTEAMS = new ManaTEAMS(item.username, item.password);
        }
        if (manaTEAMS.isLoggedIn) {
            manaTEAMS.getAllCourses(function(html, courses) {
                console.log('2');
                manaTEAMS.getCycleClassGrades(course, cycle, semester, item.averagesHtml, function(cycleGrades) {
                    console.log('1');
                    RememberedGrades.updateLocalCycleGrades(cycleGrades, course, semester, cycle, function(cycleGrades) {
                        callback(cycleGrades);
                        console.log(cycleGrades);
                    });
                });
            });
        } else {
            manaTEAMS.login(function(selectInfo) {
                manaTEAMS.getAllCourses(function(html, courses) {
                    console.log('2');
                    manaTEAMS.getCycleClassGrades(course, cycle, semester, item.averagesHtml, function(cycleGrades) {
                        console.log('1');
                        RememberedGrades.updateLocalCycleGrades(cycleGrades, course, semester, cycle, function(cycleGrades) {
                            console.log(cycleGrades);
                            callback(cycleGrades);
                        });
                    });
                });
            })
        }
    });
};


RememberedGrades.prototype.getGrades = function(callback) {
    chrome.storage.local.get('courses', function(item) {
        if (!('courses' in item)) {
            return;
        }
        callback(item.courses);
    });
};

RememberedGrades.updateLocalCycleGrades = function(cycleGrades, course, semester, cycle, callback) {
    chrome.storage.local.get(['cycleObj'], function(item) {
        var newCycleObj = {};
        if ('cycleObj' in item) {
            newCycleObj = item.cycleObj;
        }
        newCycleObj[course] = {};
        newCycleObj[course][semester] = {};
        newCycleObj[course][semester][cycle] = cycleGrades;
        chrome.storage.local.set({
            'cycleObj': newCycleObj
        });
        callback(cycleGrades);
    });
};

var rememberedGrades = new RememberedGrades();