var schedule;

function loadSchedule() {
	if (currentSchedule.schedule != undefined) {
		schedule = currentSchedule.schedule;
		clearInterval(interval);
		createTable();
	}
}

var interval = setInterval(loadSchedule, 100);


function createTable() {

	for (var i = 0; i < schedule.length; i++) {
		if (schedule[i].passing) {
			i++
		}

		var tableContainer = document.createElement("tr");
		var tableRow1 = document.createElement("td");
		var tableRow2 = document.createElement("td");
		var content1 = document.createTextNode(schedule[i].periodNum);
		var content2 = document.createTextNode(convertTime(schedule[i].startTime, schedule[i].endTime));

		tableRow1.appendChild(content1);
		tableRow2.appendChild(content2);

		tableRow1.setAttribute("class", "row");
		tableRow2.setAttribute("class", "row");

		tableContainer.appendChild(tableRow1);
		tableContainer.appendChild(tableRow2);

		var element = document.getElementsByTagName("table")[0];
		element.appendChild(tableContainer);

	}
}

function convertTime(start, end) {
	var output = "";
	var startHour;
	var endHour;
	var startMinute;
	var endMinute;
	if (start.hour <= 12) {
		startHour = start.hour;
	} else {
		startHour = start.hour - 12;
	}

	if (end.hour <= 12) {
		endHour = end.hour;
	} else {
		endHour = end.hour - 12;
	}

	if (start.minute < 10) {
		startMinute = "0" + start.minute;
	} else {
		startMinute = start.minute;
	}

	if (end.Minute < 10) {
		endMinute = "0" + end.minute;
	} else {
		endMinute = end.minute;
	}

	output += startHour + ":" + startMinute + " - " + endHour + ":" + endMinute;

	return output;

}
