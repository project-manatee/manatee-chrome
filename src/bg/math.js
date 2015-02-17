roundx = function(number, digits) {
	// how many digits to the right of the decimal point do you want
	powerten = Math.pow(10, digits);
	return Math.round(number * powerten) / powerten;
};


DEFAULT_GPA_PRECISION = 4;
function courseGPA(grade, code) {
	grade = parseInt(grade);
	if (isNaN(grade))
		return grade;
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

function totalGPA(courses, weighted, special) {
	sum = 0;
	count = 0;
    for (var i = 0; i < courses.length; ++i) {
        for (var j = 0; j < courses[i].semesters.length; ++j) {
			var gradePoints;
			if (weighted) {
				gradePoints = courseGPA(courses[i].semesters[j].average, special[i]);


			} else {
				gradePoints = courseGPA(courses[i].semesters[j].average, '');
			}
			if (! isNaN(gradePoints)) {
				sum += gradePoints;
				count++;
			}

		}
		console.log(count);
	}
	return roundx(sum / count, 3);
}
