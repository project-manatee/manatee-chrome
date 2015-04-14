
roundx = function(number, digits) {
    // how many digits to the right of the decimal point do you want
    powerten = Math.pow(10, digits);
    return Math.round(number * powerten) / powerten;
};


DEFAULT_GPA_PRECISION = 4;
function gradePoints(grade, code) {
    if (isNaN(grade))
        return 4;
    if (grade < 70)
        return 0;
    if (code === 'weighted') {
        return Math.min((grade - 60) / 10, 4) + 1;
    }
    if (code === 'passfail') {
        return NaN;
    }
    return Math.min((grade - 60) / 10, 4);
}

function totalGPA(courses, weighted, weightedCourses,excludedCourses) {
    sum = 0;
    count = 0;
    for (var i = 0; i < courses.length; i++) {
        var x = courses[i];
        for (var j = 0; j < courses[i].semesters.length; j++) {
            var y = x.semesters[j];
            if (!excludedCourses[x.courseId] == true){
                if (weighted) {
                    if(!isNaN(y.average)) {
                        sum += gradePoints(y.average, (weightedCourses[x.courseId]) ? 'weighted' : '');
                        count++;
                    }
                } else {
                    if(!isNaN(y.average)) {
                        count++;
                        sum += gradePoints(y.average, '');
                    }
                }
            }
        }
    }
    return roundx(sum / count,5);

}
