requirejs.config({
    baseUrl: '../../manatee-scraper-js/ManaTEAMS',
});

require(['sha1', 'jquery-2.1.1.min', 'TEAMSParser'],
    function(Sha1, $, TEAMSParser) {
        require(['classes/Assignment',
            'classes/Category',
            'classes/ClassGrades',
            'classes/Semester',
            'classes/Course',
            'classes/Cycle',
            'ManaTEAMS'
        ], function() {
            require(['../util.js']);
        });
    });