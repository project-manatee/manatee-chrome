requirejs.config({
    baseUrl: '../../manatee-scraper-js/ManaTEAMS',
});
//first import necessary libraries
require(['sha1',
    'jquery-2.1.1.min',
    'TEAMSParser',
    'classes/Assignment',
    'classes/Category',
    'classes/ClassGrades',
    'classes/Semester',
    'classes/Course',
    'classes/Cycle',
    'ManaTEAMS'
], function() {
    //then import util.js for beginning grades check
    require(['../util.js']);
});
